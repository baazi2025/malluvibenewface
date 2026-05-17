# Tech Spec — Vibe Malayali Redesign

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.0 | UI framework |
| react-dom | ^19.0 | DOM renderer |
| three | ^0.172 | 3D text helix (hero background) |
| @types/three | ^0.172 | TypeScript types for Three.js |
| @react-three/fiber | ^9.0 | React renderer for Three.js |
| gsap | ^3.12 | ScrollTrigger animations, skew-slide reveals |
| lenis | ^1.3 | Smooth scroll with inertia |
| @fontsource/plus-jakarta-sans | ^5.0 | Primary display font |
| @fontsource/space-grotesk | ^5.0 | Label/tag font |
| @fontsource/noto-sans-malayalam | ^5.0 | Malayalam text font |
| lucide-react | ^0.460 | Nav icons (Home, MessageCircle, Gift, Wallet, Lock) |

**Note**: shadcn/ui is NOT used — this is a fully custom landing page with bespoke styling.

## Component Inventory

### Layout

| Component | Source | Reuse | Notes |
|-----------|--------|-------|-------|
| BottomNav | Custom | 1x | Fixed glassmorphism pill nav bar at viewport bottom |
| GlassCard | Custom | 4x (features) + reusable pattern | Glassmorphism card: `rgba(255,255,255,0.07)` bg, `rgba(255,255,255,0.12)` border, 20px radius, `backdrop-filter: blur(16px)` |

### Sections

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Full viewport. Contains Three.js canvas, centered content, stats row, avatar cluster, CTA group. BottomNav rendered inside. |
| TrendingRoomsSection | Custom | Horizontal card row with scroll-triggered skew-slide entrance. 4 room cards. |
| FeaturesSection | Custom | 2x2 grid of glassmorphism cards with radial gradient glows. |
| LiveNowSection | Custom | Large live radio card with audio visualizer. |
| LoginBonusSection | Custom | Compact CTA strip with claim button. |
| FooterSection | Custom | Brand + nav links. |

### Reusable Components

| Component | Source | Used By | Notes |
|-----------|--------|---------|-------|
| SectionHeader | Custom | All sections except Hero | Accepts eyebrow, title, subtitle, alignment (left/center), optional "see all" link. |
| RoomCard | Custom | TrendingRoomsSection | Colored background card with icon overlay, live count, waveform bars. |
| AudioWaveform | Custom | RoomCard (×4), LiveNowSection | Vertical bar visualizer with staggered CSS animation. Props: barCount, color, heightRange. |
| SkewSlideWrapper | Custom | All content sections | GSAP ScrollTrigger wrapper. Props: direction ('left'|'right'), children. Applies skewX + translateX entrance. |

### Hooks

| Hook | Purpose |
|------|---------|
| useLenis | Initialize Lenis smooth scroll, integrate with GSAP ScrollTrigger |
| useScrollDirection | Track scroll direction for animation triggers |

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| 3D Text Name Helix | three + @react-three/fiber | InstancedMesh with TextGeometry, 576 instances arranged in cylindrical grid, custom ShaderMaterial with depth-based radial fade. Per-frame rotation driven by scroll position via useFrame. | **High** 🔒 |
| Skew-Slide Section Reveals | gsap + ScrollTrigger | Odd sections: skewX 30° → 0°, x "-100vw" → 0. Even sections: skewX -30° → 0°, x "100vw" → 0. Duration 1.2s, ease "cubic.inOut", stagger 0.1. Trigger: "top 80%". | **Medium** |
| Live Pulse Dot | CSS @keyframes | Green dot scale 1→1.4→1 + opacity pulse, 2s infinite. | Low |
| Live Red Dot | CSS @keyframes | Red dot opacity 1→0.3→1, 1.5s infinite. | Low |
| Audio Waveform Bars | CSS @keyframes | Bar height oscillation with random staggered delays (0–0.4s). Each bar gets unique animation-delay. | Low |
| Float Animation | CSS @keyframes | CTA group translateY(0)→(-8px)→(0), 6s infinite ease-in-out. | Low |
| Card Hover | CSS transition | translateY(-4px), border-color brighten, 0.4s transition. | Low |
| Button Hover | CSS transition | scale(1.05), filter brightness(1.1), 0.3s. | Low |
| Nav Underline | CSS transition | Gold gradient underline on active item. | Low |

## State & Logic

No reactive state management needed. This is a purely presentational landing page. All "interactivity" is visual (animations, hover states, scroll-driven effects). No user input forms, no data fetching, no complex state.

## Other Key Decisions

### Three.js over CSS 3D
The hero name helix requires Three.js for performance (576 instanced text meshes) and the custom depth fade shader. CSS 3D transforms cannot handle this volume of textured geometry efficiently.

### Raw Three.js via @react-three/fiber
Use `@react-three/fiber`'s `<Canvas>` for React integration but implement the InstancedMesh and shader material directly with Three.js APIs (not Drei abstractions), as the design specifies exact custom ShaderMaterial uniforms and per-frame matrix updates.

### No shadcn/ui
The design is entirely bespoke glassmorphism with custom styling. Standard UI components would add unnecessary abstraction. Build everything with raw Tailwind + custom CSS.

### Font Loading Strategy
Use `@fontsource/*` packages for self-hosted fonts to avoid external CDN dependencies and ensure fast loading. Import in main.tsx.

### Mobile Performance
On screens < 768px, reduce helix to 6 columns × 24 rows (144 instances) via a media query check in the Canvas component. This is a hard performance threshold — do not attempt responsive reduction via CSS.

### GSAP ScrollTrigger + Lenis Integration
Lenis must be connected to GSAP's ticker for ScrollTrigger compatibility. On each Lenis scroll event, call `ScrollTrigger.update()`. Register the Lenis scroll position as the scroll source for all ScrollTrigger instances.
