# MemorySky

A mobile app that transforms your memories into a personal galaxy. Each memory becomes a star — colored by emotion, sized by importance, and grouped into constellations by category. Built with React Native and Expo.

## Project Scope

MemorySky is a visual life-log where users record memories and watch them come alive as an interactive galaxy. Instead of scrolling through a list, users explore a spatial map of their life — pinching to zoom, tapping stars to revisit moments, and sharing screenshots of their sky.

### Core Concept

- Every memory becomes a **star** in the galaxy
- Stars are **colored by emotion** (8 emotion types, each with a unique color)
- Stars are **sized by importance** (1–5 scale)
- Stars in the same **category** form **constellations** (connected by lines)
- Stars are **positioned by time and category** using a spiral layout algorithm

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React Native + Expo SDK 55 | Cross-platform mobile app |
| Language | TypeScript | Type safety |
| Navigation | React Navigation (Native Stack) | Screen routing with slide transitions |
| State | React hooks + AsyncStorage | Local-first data persistence |
| Rendering | React Native SVG | 4-pointed star shapes with glow halos |
| Gestures | react-native-gesture-handler | Pinch zoom, double-tap, long-press drag, star taps |
| Animations | React Native Animated API | Star pulsing, toast slide-up, fade transitions |
| Sharing | expo-view-shot + expo-sharing | Galaxy screenshot export |
| Styling | expo-linear-gradient | Ombre gradient toast effects |
| Date Picker | @react-native-community/datetimepicker | Memory date selection |
| Photos | expo-image-picker | Attach photos to memories |

## Project Structure

```
src/
  screens/
    GalaxyScreen.tsx        # Main landing screen — interactive galaxy view
    HomeScreen.tsx           # Memory list + add/edit memories
  components/
    galaxy/
      GalaxyView.tsx         # Galaxy renderer — background stars, constellations, memory stars
      InteractiveGalaxy.tsx   # Wraps GalaxyView with pinch/zoom/drag gestures
      StarShape.tsx           # Individual memory star — SVG shape, glow, pulse animation
      BgStar.tsx              # Twinkling background star
      ConstellationLine.tsx   # Line connecting related stars
      NebulaBackground.tsx    # Nebula gas cloud background
      GalaxyShareCapture.tsx  # Screenshot capture wrapper for sharing
      GalaxyToast.tsx         # Animated toast for hidden star taps
    memory/
      MemoryCard.tsx          # Memory list item card
      MemoryFormModal.tsx     # Add/edit memory form with progressive disclosure
      EmptyState.tsx          # Empty state with sample data loader
  hooks/
    useMemoryStorage.ts      # AsyncStorage persistence hook
    useGalaxyGestures.ts     # Pinch, zoom, rotation, drag gesture logic
  utils/
    galaxyLayout.ts          # Spiral positioning algorithm for stars
  types/
    Memory.ts                # Memory, EmotionType, CategoryType types
    Navigation.ts            # Navigation stack param types
  theme/
    colors.ts                # Galaxy-inspired color palette + emotion colors
```

## What's Been Built

### Galaxy View
- Interactive 2D galaxy with SVG star shapes and glow halos
- Stars colored by emotion (8 colors), sized by importance (1–5)
- Constellation lines connecting stars in the same category
- Twinkling background stars and nebula effects
- Pinch to zoom, double-tap to toggle zoom, long-press drag to rotate
- Tap a star to view the full memory detail in a modal popup
- Galaxy is the landing screen when the app opens

### Memory Management
- Add memories with title, description, emotion, category, importance, date, photo, and location
- Streamlined form: only title is required, emotion picker always visible, everything else behind a collapsible "More details" section
- Edit existing memories by tapping them in the list view
- Emotion picker with icons for each emotion type
- Photo attachment via device image picker
- Data persisted locally with AsyncStorage

### Hidden Memories
- Hide/unhide memories via a toggle in the edit form
- Hidden stars appear dimmed and greyed out in the galaxy
- Tapping a hidden star shows an animated toast ("This memory is hidden") instead of opening the detail
- Toast slides up from the star's position with an ombre gradient and glow pulse
- Debounce guard prevents toast stacking on rapid taps

### Sharing
- Share button captures a clean screenshot of the galaxy (UI buttons auto-hidden)
- Uses expo-view-shot for capture and expo-sharing for export

### Navigation
- Galaxy view is the initial screen
- Home button navigates to the memory list with a slide transition
- Galaxy button on the list view navigates back

## What Still Needs to Be Done

### Near-term
- [ ] Sort memories by date, emotion, or importance in spiral formation
- [ ] Onboarding flow for first-time users
- [ ] Haptic feedback on star interactions
- [ ] Animated transitions when adding/removing stars from the galaxy

### Future Features
- [ ] **Supernova Reel** — auto-generated video flythrough of the galaxy for sharing on social media
- [ ] **Manual Constellations** — let users draw custom story paths by tapping stars in sequence, creating named constellation narratives
- [ ] **Binary Systems** — social feature where two users can view their galaxies orbiting a shared center
- [ ] **Nebula Heatmapping** — procedural background that changes color based on local density of emotional star colors
- [ ] **Timeline scrubber** — slide through time to watch the galaxy grow
- [ ] **Data export/import** — backup and restore memories
- [ ] **Cloud sync** — optional sync across devices

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

## Emotion Colors

| Emotion | Color | Hex |
|---------|-------|-----|
| Happy | Warm yellow | `#FFD93D` |
| Sad | Soft blue | `#4A90E2` |
| Nostalgic | Dusty lavender | `#C8A2C8` |
| Grateful | Gentle green | `#6BCB77` |
| Excited | Energetic orange | `#FF8C42` |
| Peaceful | Calm mint | `#A8E6CF` |
| Bittersweet | Warm dusty rose | `#D47B8A` |
| Angry | Fiery red | `#E63946` |

## Categories

Childhood, Career, Travel, Family, Friendship, Romance, Milestone, Everyday
