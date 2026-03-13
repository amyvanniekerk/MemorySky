export type EmotionType = 'happy' | 'sad' | 'nostalgic' | 'grateful' | 'excited' | 'peaceful' | 'bittersweet' | 'angry';

export type CategoryType = 'childhood' | 'career' | 'travel' | 'family' | 'friendship' | 'romance' | 'milestone' | 'everyday';

export type ImportanceLevel = 1 | 2 | 3 | 4 | 5;

export interface Memory {
  id: string;
  title: string;
  date: Date;
  description: string;
  emotion: EmotionType;
  category: CategoryType;
  importance: ImportanceLevel;
  photoUri?: string;
  location?: string;
  hidden?: boolean;
}
