# AIRAB Money Brand Guidelines

## Overview
AIRAB Money is a premium AI-powered financial media platform designed to convey authority, financial precision, and a modern Middle Eastern tech perspective. Our design system moves away from typical "neon" clichés, embracing a sophisticated, grounded aesthetic that reflects the region's landscape and technological advancement.

## 1. Core Color Palette

The palette is built on high-contrast, muted tones that provide a premium, editorial feel.

### Primary: Dusk Rose
```
HEX: #A67C74
HSL: hsl(10, 22%, 55%)
```
**Usage**: Sidebar background, primary action buttons, key data visualization lines (like the MENA AI Index), and subtle accents. It represents the warmth of the region's landscape.

### Background: Graphite
```
HEX: #1E1E1E
HSL: hsl(0, 0%, 12%)
```
**Usage**: Primary background color for the application. It provides a sophisticated, "deep-tech" foundation.

### Surface: Charcoal Overlay
```
HEX: #252525
HSL: hsl(0, 0%, 15%)
```
**Usage**: Used for card backgrounds and widgets to create subtle depth against the Graphite base.

### Typography Primary: Brushed Silver
```
HEX: #C0C0C0
HSL: hsl(0, 0%, 75%)
```
**Usage**: Headlines, labels, and secondary navigation items. It feels more premium and technical than pure white.

### Typography Highlight: Off-White
```
HEX: #F5F5F5
HSL: hsl(0, 0%, 96%)
```
**Usage**: Body text and high-importance data points for maximum readability.

## 2. Typography Principles

### Headlines (Display)
Use a high-end Serif or sharp, geometric Sans-serif:
- **Primary**: Playfair Display (400, 500, 600, 700)
- **Alternative**: PP Mori or Inter Bold for data-heavy contexts

### Body & UI
Clean, highly legible Sans-serif:
- **Primary**: Inter (300, 400, 500, 600, 700)
- **Usage**: All interface text, buttons, and navigation

### Data/Monospace
Monospaced font for financial accuracy:
- **Primary**: JetBrains Mono
- **Usage**: Stock tickers, numerical values, and data tables

## 3. Visual Language & Imagery

### Photography Guidelines
- **Style**: High-contrast black and white, or subtly desaturated
- **Avoid**: Saturated "stock" photos and artificial color grading
- **Enhancement**: Subtle Dusk Rose tint can be applied to hero images for cohesion
- **Subject Matter**: Architectural, technological, and landscape imagery reflecting Middle Eastern context

### Borders & Dividers
- **Thickness**: Extremely thin (0.5px to 1px)
- **Color**: `rgba(255, 255, 255, 0.05)` for subtle separation
- **Avoid**: Thick borders that create visual noise

### Iconography
- **Style**: Fine-line icons (stroke-based, not solid fills)
- **Color**: Brushed Silver (#C0C0C0)
- **Weight**: Reinforces "precision engineering" aesthetic
- **Usage**: Navigation, data indicators, and interface elements

### Data Visualization
- **Charts**: Smooth area fills with gradients (Dusk Rose to Transparent)
- **Grid Lines**: Avoid harsh grid lines; use subtle guides if necessary
- **Data Points**: Clean, minimal markers in Dusk Rose
- **Background**: Transparent or Graphite overlay

## 4. Brand Voice

### Expert-Led
The UI doesn't shout; it presents data clearly and confidently. Content is authoritative without being aggressive.

### Grounded
By using earthy, muted tones (Dusk Rose) rather than electric blues, the brand feels rooted in the physical reality of the Middle East. The design emphasizes substance over spectacle.

### Key Attributes
- **Authority**: Financial precision and reliability
- **Sophistication**: Premium, editorial aesthetic
- **Regional Identity**: Reflects Middle Eastern technological advancement
- **Clarity**: Data-first approach with exceptional readability

## Implementation Notes

### CSS Custom Properties
```css
:root {
  --color-dusk-rose: #A67C74;
  --color-graphite: #1E1E1E;
  --color-charcoal: #252525;
  --color-brushed-silver: #C0C0C0;
  --color-off-white: #F5F5F5;
}
```

### Tailwind Configuration
```javascript
colors: {
  'dusk-rose': '#A67C74',
  'graphite': '#1E1E1E',
  'charcoal': '#252525',
  'brushed-silver': '#C0C0C0',
  'off-white': '#F5F5F5',
}
```

### Accessibility Considerations
- **Contrast**: All text combinations meet WCAG AA standards
- **Readability**: Minimum font size 14px for body text
- **Focus States**: Clear focus indicators using Dusk Rose
- **Color Independence**: Information conveyed through more than color alone

This brand system creates a distinctive identity that stands apart from typical fintech designs while maintaining the authority and precision expected in financial media.