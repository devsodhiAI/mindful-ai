import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface MoodState {
  currentStreak: number;
  todaysMood: any;
  moodHistory: any[];
  loading: boolean;
  submitMood: (moodData: any) => Promise<void>;
  fetchMoodHistory: () => Promise<void>;
}

export const useMoodStore = create<MoodState>((set, get) => ({
  currentStreak: 0,
  todaysMood: null,
  moodHistory: [],
  loading: false,
  submitMood: async (moodData) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('moods')
        .insert([moodData])
        .select()
        .single();

      if (error) throw error;
      set({ todaysMood: data });
    } catch (error) {
      console.error('Error submitting mood:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  fetchMoodHistory: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ moodHistory: data });
    } catch (error) {
      console.error('Error fetching mood history:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));