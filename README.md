🌌 MemorySky: Full Project Scope
1. Executive Summary

MemorySky is a mobile "Life-Log" that uses spatial mapping to turn memories into a personal galaxy. Unlike a standard list-based diary, it uses Godot 4 to render a 3D environment where time is distance, categories are clusters, and emotions are light.

2. Functional Requirements (The "Core")

A. Memory Engine (Flutter)

Input System: Title, Date (historical or current), Description, and Photos.

The Emotional Scale: Selection of 8 core emotions (mapped to specific hex codes/shaders).

Importance Weighting: A slider (1–10) that physically scales the star size and brightness in the Godot engine.

Data Storage: Local-first approach using SQLite/Hive for privacy and speed.

B. The Galaxy View (Godot 4 Engine)

Spatial Algorithm: * Radius(r)=Time elapsed since birth/start date

Angle (θ)=Category ID ×Sector Offset +Noise

Visual Assets: 4-pointed SVG stars with dynamic glow halos and pulsing logic.

Nebula Heatmapping: Background gas clouds that procedurally change color based on the local density of specific emotional star colors.

3. The "Viral" Feature Set (Phase 2 & Polish)

The Supernova Reel (Auto-Video)

A programmatic camera path that zooms into the most "Important" stars.

Generates a 9:16 vertical video with music sync for TikTok/Reels.

Trigger: Automated at milestones (e.g., "Your First 100 Stars") or on-demand "Year in Review."

Manual Constellations (Narrative)

The "Star-Trace" tool: Users tap stars in sequence to create a named story path.

Myth-Making: The app generates a "Constellation Card" showing the shape, the name (e.g., The Graduation Path), and the date range.

Binary Systems (Social)

The "Portal" interaction: A localized multiplayer view or deep-link sharing that lets users see two galaxies orbiting a shared center of gravity.

Privacy Guard: Only "Public" flagged stars appear in a friend’s view.

4. Technical Architecture

Layer	Technology	Responsibility
Framework	Flutter	UI, Overlays, Settings, and Data Entry.
Rendering	Godot 4 (GDExtension)	3D Space, Shaders, Physics-based Rotation.
State	Riverpod	Synchronizing Flutter inputs with Godot's scene tree.
Graphics	GLSL Shaders	Pulsing stars, Twinkling backgrounds, and Nebula glow.
5. Implementation Roadmap (5-Week Sprint)

Week 1: The Foundation. Set up Flutter CRUD logic and Hive database. Define the "Emotion-to-Color" mapping.

Week 2: The Big Bang. Integrate Godot. Implement the spiral coordinate math (r,θ) and basic star instantiation.

Week 3: Tactile Feel. Build the rotation (atan2), pinch-to-zoom, and "Snap-to-Star" camera transitions.

Week 4: The Viral Hooks. Develop the "Supernova" video renderer and the manual constellation drawing tool.

Week 5: Polish & Launch. Onboarding flow (creating your "Sun"), haptic feedback, and App Store optimization.

6. The "Viral" Checklist

[ ] Does the galaxy look beautiful even with only 5 stars? (Initial "Nebula" padding).

[ ] Is the export button prominent after adding a "Highly Important" memory?

[ ] Can a user identify their "happiest" year just by looking at the galaxy color?
