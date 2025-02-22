import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const moods = [
  { id: 1, name: 'Great', icon: 'happy', color: '#00B894' },
  { id: 2, name: 'Good', icon: 'smile', color: '#00CEC9' },
  { id: 3, name: 'Okay', icon: 'neutral', color: '#FFA502' },
  { id: 4, name: 'Bad', icon: 'sad', color: '#FF6B6B' },
  { id: 5, name: 'Awful', icon: 'sad-outline', color: '#FF4757' },
];

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top }}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerText}>How are you feeling today?</Text>
      </LinearGradient>

      <View style={styles.moodContainer}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodButton,
              { backgroundColor: colors.card },
              selectedMood === mood.id && { borderColor: mood.color, borderWidth: 2 }
            ]}
            onPress={() => setSelectedMood(mood.id)}
          >
            <Ionicons
              name={mood.icon as any}
              size={32}
              color={mood.color}
            />
            <Text style={[styles.moodText, { color: colors.text }]}>{mood.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.streakCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.streakTitle, { color: colors.text }]}>Current Streak</Text>
        <View style={styles.streakContent}>
          <Text style={[styles.streakNumber, { color: colors.primary }]}>7</Text>
          <Text style={[styles.streakDays, { color: colors.text }]}>days</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: colors.primary }]}
        onPress={() => {/* Handle mood submission */}}
      >
        <Text style={styles.submitButtonText}>Save Today's Mood</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  moodButton: {
    width: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moodText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  streakCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    marginRight: 8,
  },
  streakDays: {
    fontSize: 20,
    opacity: 0.8,
  },
  submitButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});