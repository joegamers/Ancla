# Design System: Ancla (Rich Zen)
**Project ID:** Ancla-Web

## 1. Visual Theme & Atmosphere
The design evokes a "Sanctuary of Calm." It is airy, organic, and deeply textured, moving away from clinical minimalism to a "milky," tactile luxury. The atmosphere is defined by slow-moving, multi-layered gradients that mimic natural light and water. It feels like a premium, native wellness application, not a website.

## 2. Color Palette & Roles

### Background Layers
*   **Mist (Neutral Base)**: `#F8FAF9` - The canvas, slightly warmer than pure white.
*   **Sage (Organic Accent)**: `#E0F2F1` - Used for calm, grounding background blobs.
*   **Warm Cream (Light Accent)**: `#F1F8E9` - Adds a touch of sunlight and warmth.
*   **Ether Blue (Cool Accent)**: `#E3F2FD` - Represents air and flow.

### UI Elements
*   **Milky Glass (Container Background)**: `rgba(255, 255, 255, 0.85)` - High opacity white with strong blur (`24px`), creating a solid but translucent material.
*   **Teal Deep (Primary Text)**: `#115E59` (Teal 800) - Used for primary actions and strong headings.
*   **Slate Muted (Secondary Text)**: `#64748B` (Slate 500) - Used for supporting text and labels.

## 3. Typography Rules
**Font Family:** `Inter` (Sans-serif) with specific tracking adjustments.

*   **Headings (Zen)**: Light weights (`font-light`), tight tracking (`-0.02em`), and relaxed line-height.
*   **Body**: Readable, clean, with ample line height (`leading-relaxed`).
*   **Labels (Micro)**: Uppercase, wide tracking (`0.3em`), small size (`text-[10px]`), heavily muted.

## 4. Component Stylings

*   **Glass Cards (Containers)**:
    *   **Shape**: Generously rounded corners (`rounded-3xl` or `rounded-[2rem]`).
    *   **Material**: "Milky Glass" with a subtle white border (`border-white/50`) and an inner white glow (`box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3)`).
    *   **Elevation**: Soft, colored shadows (`shadow-teal-900/5`) to lift elements without harsh contrast.

*   **Buttons (Mood Selectors)**:
    *   **Interactive**: Hover shifts the background to be slightly more opaque and lifts the element (`-2px`).
    *   **Iconography**: Enclosed in soft colored squares (`bg-white/40`) to create a focal point.

## 5. Layout Principles

*   **Mobile-First Constraint**: On desktop, the application is strictly bounded to a `max-w-[480px]` central column, mimicking a handheld device.
*   **Breathing Room**: Spacing is exaggerated (`p-8`, `gap-6`). Content is never crowded.
*   **Centering**: The "Anchor Card" (protagonist) is always the optical center of the screen.
