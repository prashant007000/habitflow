export const CATEGORIES = [
  { value: 'CODING', label: 'Coding', icon: '💻', color: '#71717A' },
  { value: 'FITNESS', label: 'Fitness', icon: '🏋️', color: '#71717A' },
  { value: 'READING', label: 'Reading', icon: '📚', color: '#71717A' },
  { value: 'STUDY', label: 'Study', icon: '🧠', color: '#71717A' },
  { value: 'HEALTH', label: 'Health', icon: '🌿', color: '#71717A' },
  { value: 'PRODUCTIVITY', label: 'Productivity', icon: '💼', color: '#71717A' },
  { value: 'LEARNING', label: 'Learning', icon: '🎓', color: '#71717A' },
  { value: 'MINDFULNESS', label: 'Mindfulness', icon: '🧘', color: '#71717A' },
  { value: 'CUSTOM', label: 'Custom', icon: '✨', color: '#71717A' },
]

export const MOODS = [
  { value: 'AMAZING', label: 'Very Good', emoji: '😄', color: '#10B981' },
  { value: 'GOOD', label: 'Good', emoji: '😊', color: '#3B82F6' },
  { value: 'AVERAGE', label: 'Average', emoji: '😐', color: '#F59E0B' },
  { value: 'BAD', label: 'Bad', emoji: '😔', color: '#EF4444' },
  { value: 'FUCKED_UP', label: 'Fucked Up', emoji: '💀', color: '#71717A' },
]

export const GOALS = [
  'Crack CDS',
  'Learn DSA',
  'Get a Software Job',
  'Weight Gain',
  'Improve Productivity',
]

export function getCategoryMeta(value) {
  return CATEGORIES.find((c) => c.value === value) || CATEGORIES[5]
}

export function getMoodMeta(value) {
  return MOODS.find((m) => m.value === value) || MOODS[2]
}
