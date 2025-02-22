/*
  # Initial Schema for MindfulAI

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to auth.users
    - `moods`
      - Daily mood check-ins
      - Includes sentiment analysis results
    - `chat_sessions`
      - AI therapy chat sessions
      - Stores conversation history
    - `subscriptions`
      - User subscription status
      - Links to Stripe customer data
    - `achievements`
      - User achievements and rewards
      - Tracks streaks and milestones

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure users can only access their own data

  3. Functions
    - Add function to calculate current streak
    - Add function to check subscription status
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  streak_count int DEFAULT 0,
  total_check_ins int DEFAULT 0,
  last_check_in timestamptz
);

-- Create moods table
CREATE TABLE IF NOT EXISTS moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  mood_type text NOT NULL,
  mood_score int NOT NULL,
  notes text,
  sentiment_score float,
  sentiment_analysis jsonb,
  created_at timestamptz DEFAULT now(),
  is_crisis boolean DEFAULT false
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  summary text,
  sentiment_analysis jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES chat_sessions(id) NOT NULL,
  content text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_type text NOT NULL,
  status text NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  achievement_type text NOT NULL,
  achievement_data jsonb,
  unlocked_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own moods"
  ON moods FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own moods"
  ON moods FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own chat sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own chat sessions"
  ON chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (session_id IN (
    SELECT id FROM chat_sessions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (session_id IN (
    SELECT id FROM chat_sessions WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to calculate streak
CREATE OR REPLACE FUNCTION calculate_streak(user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  streak integer;
  last_check_in timestamptz;
BEGIN
  -- Get the last check-in date
  SELECT profiles.last_check_in INTO last_check_in
  FROM profiles
  WHERE profiles.id = user_id;

  -- If no check-in or last check-in was more than 48 hours ago, streak is 0
  IF last_check_in IS NULL OR 
     last_check_in < (now() - interval '48 hours') THEN
    RETURN 0;
  END IF;

  -- Calculate the streak
  SELECT COUNT(DISTINCT DATE(created_at))
  INTO streak
  FROM moods
  WHERE moods.user_id = user_id
    AND created_at > (now() - interval '30 days')
    AND created_at <= now()
  GROUP BY user_id;

  RETURN COALESCE(streak, 0);
END;
$$;