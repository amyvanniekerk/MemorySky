import { EmotionType, CategoryType } from '../types/Memory';
import { emotionColors } from '../theme/colors';

export const EMOTIONS: { type: EmotionType; label: string; icon: string; color: string }[] = [
  { type: 'happy', label: 'Happy', icon: '☀', color: emotionColors.happy },
  { type: 'sad', label: 'Sad', icon: '🌧', color: emotionColors.sad },
  { type: 'nostalgic', label: 'Nostalgic', icon: '🌙', color: emotionColors.nostalgic },
  { type: 'grateful', label: 'Grateful', icon: '✧', color: emotionColors.grateful },
  { type: 'excited', label: 'Excited', icon: '⚡', color: emotionColors.excited },
  { type: 'peaceful', label: 'Peaceful', icon: '☁', color: emotionColors.peaceful },
  { type: 'bittersweet', label: 'Bittersweet', icon: '🥀', color: emotionColors.bittersweet },
  { type: 'angry', label: 'Angry', icon: '🔥', color: emotionColors.angry },
];

export const CATEGORIES: { type: CategoryType; label: string }[] = [
  { type: 'childhood', label: 'Childhood' },
  { type: 'career', label: 'Career' },
  { type: 'travel', label: 'Travel' },
  { type: 'family', label: 'Family' },
  { type: 'friendship', label: 'Friendship' },
  { type: 'romance', label: 'Romance' },
  { type: 'milestone', label: 'Milestone' },
  { type: 'everyday', label: 'Everyday' },
];
