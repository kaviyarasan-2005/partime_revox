# AquaShine Marine — Design System & Color Palette

This document defines and documents the consistent visual style, color palette, and component design tokens applied uniformly across the entire site.

## 🎨 Color Palette

We utilize a strict 3-color primary design palette combined with semantic dark-mode tokens to ensure luxury appeal, accessibility, and high contrast.

| Palette Role | Token Name | Default Value (HEX) | Description |
| :--- | :--- | :--- | :--- |
| **Primary** | `--c-primary` | `#008080` | **Teal**: Used for navbar styling, headings, text highlights, and primary brand indicators. |
| **Secondary** | `--c-secondary` | `#00ABAB` | **Light Sea Green**: Used for hover states, card/button overlays, and marine accent panels. |
| **Accent** | `--c-accent` | `#F1A56F` | **Sandy Brown**: Used for active links, icons, borders, and main CTA emphasis (e.g. Booking). |
| **Accent Light** | `--c-accent-light` | `#F6BE96` | **Lighter Sandy Brown**: Soft sandy peach used for active hover shadows and lighter accents. |

---

## 🎛️ Semantic Variables & Backgrounds

These variables are defined inside [style.css](style.css) and switch automatically when the `.dark` class is toggled on the root `<html>` tag.

### Base Default Theme (`:root`)
- **Main Background**: `var(--bg-root)` (`#000000`) - deep luxury solid black.
- **Section Alt**: `var(--bg-section)` (`#202020`) - Jet Gray supporting backdrop.
- **Card Fill**: `var(--bg-card)` (`#161616`) - sleek off-black cards that stand out on solid black background.
- **Glass Panel**: `var(--bg-glass)` (`rgba(255,255,255,0.03)`) - frosted outline transparent grids.
- **Text Color**: `var(--text-primary)` (`#FFFFFF`) - pure white text.
- **Text Accent/Secondary**: `var(--text-secondary)` (`#D1D5DB`) - readable light gray text.

### Alternative Slate Theme (`.dark`)
- **Main Background**: `var(--bg-root)` (`#000000`) - deep solid black.
- **Section Alt**: `var(--bg-section)` (`#202020`) - Jet Gray section backdrop.
- **Card Fill**: `var(--bg-card)` (`#161616`) - sleek off-black/charcoal cards.
- **Glass Panel**: `var(--bg-glass)` (`rgba(255,255,255,0.03)`) - dark frosted glass details.
- **Text Color**: `var(--text-primary)` (`#F3F4F6`) - readable light gray text.

---

## 🔘 Button System

All buttons are built on top of uniform border-radius utility settings (`999px` capsule style) and transition effects:

1. **Primary Button (`.btn-primary`)**:
   - **Static**: Background `var(--c-primary)` (Teal) with `#ffffff` text.
   - **Hover**: Background `var(--c-secondary)` (Light Sea Green) with soft translation up (`-2px`) and shadow drop.
2. **Accent Button (`.btn-accent`)**:
   - **Static**: Background `var(--c-accent)` (Sandy Brown) with `var(--c-primary)` (Teal) text.
   - **Hover**: Background `var(--c-accent-light)` with sandy glow shadow.
3. **Outline Button (`.btn-outline`)**:
   - **Static**: Transparent background with `var(--c-accent)` border and text.
   - **Hover**: Solid `var(--c-accent)` background with `var(--c-primary)` text.
4. **Social Login Buttons (`.btn-google`, `.btn-apple`)**:
   - **Google**: Background `#4285F4`, transitions to `#357AE8` with blue shadow glow.
   - **Apple**: Background `#000000`, transitions to `#1A1A1A` with dark shadow glow.

---

## 🔗 Hyperlinks

Hyperlinks are styled to guarantee readability and interactive transitions:
- **Navigation Links**: White or light-slate with transparent transitions. Hover transitions to `var(--c-accent)` (Sandy Brown) with soft background scale.
- **Text Links / Anchors**: Styled with `color: var(--c-accent)` or standard text-primary with `hover:underline` highlights.
- **Footer Links**: Slate-gray (`rgba(255,255,255,0.55)`). Hover pushes left indentation `+4px` and switches to sandy `var(--c-accent)`.
