# BetterDay Design Guidelines

## Design Approach

**Selected Approach:** Custom Design System with Material Design influences
- Utility-focused clarity engine requiring intuitive, efficient interactions
- Clean, modern aesthetic with emotional warmth (rising sun motif)
- Mobile-first design prioritizing single-column simplicity

## Core Layout Structure

### Application Shell
- Fixed tab navigation at top: 3 equal-width tabs for Decisions, Planner, Advisor
- Main content area: Single-column, centered layout with max-width of 600px on desktop
- Consistent padding: p-4 on mobile, p-8 on desktop
- Full-height viewport usage with natural scrolling for AI responses

### Tab Navigation
- Horizontal tab bar with clear active state indication
- Tab labels: "Decisions", "Planner", "Advisor" 
- Active tab receives subtle underline or elevated appearance
- Smooth transitions between modes (0.2s ease)

### Content Sections (per mode)
1. **Rising Sun Animation Zone** - Top section, h-32 to h-40, contains animated SVG sun element
2. **Input Area** - Large textarea, min-h-32, rounded corners (rounded-xl), generous padding (p-4)
3. **Action Button** - Full-width on mobile, centered on desktop, h-12, rounded-lg
4. **Response Display** - Structured cards with clear visual hierarchy, space-y-6 between sections

## Typography System

**Font Stack:** 
- Primary: 'Inter' or 'DM Sans' from Google Fonts
- Monospace: 'Fira Code' for any code/technical content

**Type Scale:**
- Hero/Page Title: text-3xl font-semibold (hidden on mobile, shows mode name on desktop)
- Section Headers: text-xl font-semibold
- Body Text: text-base leading-relaxed
- Labels/Meta: text-sm font-medium
- Button Text: text-base font-semibold

## Spacing System

**Tailwind Units:** Consistent use of 2, 4, 6, 8, 12, 16, 20 units
- Component gaps: gap-4 or gap-6
- Section spacing: space-y-6 to space-y-8
- Card padding: p-6 on desktop, p-4 on mobile
- Button padding: px-8 py-3

## Component Library

### Input Components
**Large Text Input:**
- Textarea with min-height, auto-resize capability
- Placeholder text guides user per mode (e.g., "Describe your decision...", "List your tasks and goals...", "What would you like to understand?")
- Border treatment: 2px solid, increased on focus
- Shadow on focus: shadow-lg transition

**Submit Button:**
- High contrast, rounded corners (rounded-lg)
- Icon + text (e.g., "Get Recommendation", "Create Plan", "Get Clarity")
- Loading state: spinner animation replaces text during API call
- Disabled state when input empty

### Response Cards

**Decisions Mode Structure:**
- Recommendation card with bold headline
- Pros list: checkmark icons + text items
- Cons list: x-mark icons + text items  
- "What Matters Most" callout section with highlight treatment
- Next Steps: numbered list with action items

**Planner Mode Structure:**
- Time-blocked schedule cards
- Each block: time label + task + duration
- Day/week toggle if applicable
- Visual separators between time blocks

**Advisor Mode Structure:**
- Clean explanation text with natural paragraph breaks
- Key points highlighted in callout boxes
- Friendly tone with supportive next steps section

### Visual Elements

**Rising Sun Animation:**
- SVG sun graphic with gradient rays
- Subtle rise animation on page load (translate-y and opacity)
- Positioned center-top of each mode's content area
- Animation runs once on mode switch, 1.5s duration

**Loading States:**
- Skeleton screens for response areas
- Pulsing animation on placeholder cards
- Spinner in button during processing

## Layout Behavior

### Mobile (< 768px)
- Single column, full-width inputs
- Tabs stack horizontally, text-sm
- Sun animation scaled down (h-24)
- Reduced padding throughout (p-4)

### Desktop (≥ 768px)
- Centered content with max-w-2xl
- Larger sun animation (h-40)
- More generous spacing (p-8, space-y-8)
- Button width constrained to max-w-xs, centered

## Interaction Patterns

**Tab Switching:**
- Clear active state
- Content fade transition (0.3s)
- Preserve input if switching back
- Reset response area on mode change

**Form Submission:**
- Button disabled until input has content
- Loading state replaces button text
- Response area fades in from below
- Scroll to response automatically on completion

**Response Display:**
- Staggered fade-in for each card section
- Smooth height transitions
- Allow copy-to-clipboard for recommendations

## Accessibility

- Semantic HTML: nav, main, section elements
- ARIA labels for tab navigation
- Focus visible states on all interactive elements
- Keyboard navigation through tabs (arrow keys)
- Screen reader announcements for loading/completion states
- Minimum touch target size: 44x44px

## Images

**No hero images required.** This application uses the rising sun animation as the primary visual element instead of photographic imagery. The design relies on clean typography, structured layouts, and the animated sun motif to create visual interest.