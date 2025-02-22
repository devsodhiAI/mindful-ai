import { StyleSheet, View, Text, ScrollView, useColorScheme, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme ?? 'light'];

  const features = [
    {
      icon: 'chatbubbles',
      title: 'AI Therapy Chat',
      description: 'Chat with our AI therapist for support and guidance anytime, anywhere.',
      delay: 200,
    },
    {
      icon: 'heart',
      title: 'Mood Tracking',
      description: 'Track your daily moods and emotions to understand your patterns.',
      delay: 400,
    },
    {
      icon: 'analytics',
      title: 'Insights',
      description: 'Get personalized insights and recommendations based on your mood history.',
      delay: 600,
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: 20
      }}
    >
      <Animated.View entering={FadeInDown.duration(1000).springify()}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.welcomeText}>Welcome to MindfulAI</Text>
          <Text style={styles.subtitle}>Your AI-powered mental wellness companion</Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View 
          entering={FadeInUp.duration(1000).springify()}
          style={[styles.streakCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.streakHeader}>
            <Ionicons name="flame" size={24} color={colors.primary} />
            <Text style={[styles.streakTitle, { color: colors.text }]}>Current Streak</Text>
          </View>
          <Text style={[styles.streakCount, { color: colors.primary }]}>7 Days</Text>
          <Text style={[styles.streakSubtitle, { color: colors.text }]}>Keep up the great work!</Text>
        </Animated.View>

        {features.map((feature, index) => (
          <AnimatedPressable
            key={feature.title}
            entering={FadeInUp.delay(feature.delay).springify()}
            style={[styles.card, { backgroundColor: colors.card }]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={feature.icon} size={24} color={colors.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{feature.title}</Text>
            </View>
            <Text style={[styles.cardText, { color: colors.text }]}>
              {feature.description}
            </Text>
          </AnimatedPressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderRadius: 0,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  streakCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  streakCount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streakSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 22,
  },
});