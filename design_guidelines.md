# Expense Tracker Design Guidelines

## Design Approach: Finance-Focused Design System

**Selected Approach:** Material Design with Financial App Refinement  
**Justification:** As a data-dense, utility-focused family finance application, the design prioritizes clarity, trust, and efficient data management. Drawing inspiration from modern finance apps like YNAB, Mint, and banking dashboards while following Material Design principles for consistency.

**Key Design Principles:**
- Trust & Clarity: Clean layouts that build confidence in financial data
- Efficient Information Hierarchy: Critical financial data immediately visible
- Data-First Design: Charts and numbers take visual priority
- Family-Friendly: Welcoming yet professional aesthetic

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary: 210 100% 50% (Professional blue - trust & stability)
- Secondary: 210 15% 25% (Dark slate for text/headers)
- Success: 142 71% 45% (Financial gain/under budget)
- Warning: 38 92% 50% (Approaching budget limit)
- Danger: 0 84% 60% (Over budget/critical alerts)
- Background: 0 0% 98% (Soft white)
- Surface: 0 0% 100% (Pure white for cards)
- Border: 220 13% 91% (Subtle dividers)

**Dark Mode:**
- Primary: 210 100% 60% (Brighter blue for dark backgrounds)
- Secondary: 210 15% 85% (Light text)
- Success: 142 71% 55% (Adjusted for dark mode)
- Warning: 38 92% 60%
- Danger: 0 84% 65%
- Background: 222 47% 11% (Rich dark blue-gray)
- Surface: 217 33% 17% (Elevated dark cards)
- Border: 217 33% 25% (Dark dividers)

### B. Typography

**Font Families:**
- Primary: Inter (clean, modern, excellent for numbers)
- Accent: Plus Jakarta Sans (friendly headers for family context)
- Mono: JetBrains Mono (financial figures, transaction IDs)

**Hierarchy:**
- H1: 2.5rem / 700 weight (Page titles)
- H2: 2rem / 600 weight (Section headers)
- H3: 1.5rem / 600 weight (Card titles)
- Body: 1rem / 400 weight (General content)
- Small: 0.875rem / 400 weight (Labels, metadata)
- Numbers: 1.25rem / 600 weight / Mono font (Financial figures)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 6, 8, 12, 16** (e.g., p-4, gap-6, mt-8)

**Container Structure:**
- Max width: max-w-7xl for main dashboard
- Sidebar: Fixed 280px width (desktop), full-width drawer (mobile)
- Content padding: px-4 md:px-6 lg:px-8
- Card spacing: gap-6 for grid layouts
- Section spacing: space-y-8 between major sections

### D. Component Library

**Navigation:**
- Sidebar Navigation (Desktop): Vertical tabs with icons, active state with accent border and background tint
- Bottom Tab Bar (Mobile): Fixed 5 primary sections with icons
- User Profile Header: Avatar, name, last login at top of sidebar

**Dashboard Cards:**
- Budget Overview Card: Large hero card spanning full width, gradient background subtle, large typography for total income vs expenses, animated progress bar
- Quick Stats Grid: 2x2 or 3-column grid showing key metrics (monthly spend, transactions count, top category)
- Elevated shadow (shadow-lg), rounded corners (rounded-xl)

**Login/Registration:**
- Centered card layout (max-w-md)
- Form fields with floating labels
- Optional income field with helper text
- Family member avatar selection or upload
- Welcoming gradient background or financial-themed illustration

**Budget Bar Component:**
- Full-width progress bar with segments for each category
- Color-coded: Green (safe) → Yellow (80%+) → Red (exceeded)
- Tooltip on hover showing exact amounts
- Animated transitions when values update
- Display: Total Income | Amount Spent | Remaining

**Add Expense Tab:**
- Clean form layout with icon-prefixed inputs
- Category dropdown with colored icons
- Amount input with currency symbol prefix (large, prominent)
- Date picker with calendar icon
- Member auto-tagged (display logged-in user with small badge)
- Primary action button: "Add Expense" (full-width on mobile)

**Transaction Table:**
- Striped rows for readability
- Columns: Date | Description | Category | Amount | Member | Actions
- Inline edit icons (pencil) and delete (trash) with confirmation
- Filter bar above table: Member dropdown, Category chips, Date range picker
- Sort by clicking column headers
- Pagination for long lists (show 15-20 per page)
- Mobile: Card-based layout stacking transaction details

**Visualization Tab:**
- Two-column layout (desktop): Pie chart left, Bar chart right
- Pie Chart: Category-wise expenses, vibrant distinct colors, percentage labels, interactive legend
- Cluster Bar Chart: X-axis members, Y-axis amounts, grouped bars for income vs expenses
- Chart background: Surface color with subtle grid lines
- Responsive: Stack vertically on mobile
- Date range selector above charts

**Export Section:**
- Two-column card layout: CSV Export (left) | PDF Export (right)
- Each card shows preview icon and format details
- Large download buttons with icons
- Export options checkboxes: Include charts, Summary only, All transactions
- Generated filename preview

### E. Interactions & Animations

**Micro-interactions (subtle only):**
- Button hover: Slight scale (1.02) and shadow increase
- Card hover: Subtle shadow elevation change
- Form focus: Border color shift and subtle glow
- Number changes: Brief highlight animation
- Chart tooltips: Smooth fade-in

**Navigation:**
- Page transitions: Simple fade (150ms)
- Sidebar toggle: Slide animation (200ms ease-out)

**Data Updates:**
- Budget bar: Smooth width transition (300ms)
- Transaction add/delete: Fade in/out (200ms)

---

## Images

**Login/Registration Background:**
- Abstract financial pattern or subtle gradient (blue-to-teal)
- Or: Welcoming family illustration in muted colors
- Placement: Full viewport background with overlay for readability

**Empty States:**
- No transactions: Friendly illustration of piggy bank or wallet
- No data for charts: "Start tracking" illustration
- Placement: Centered in respective sections

**Dashboard Header:**
- Optional: Small decorative icon/illustration near budget overview
- Placement: Top-right of budget card as accent

---

## Key UX Patterns

**Information Hierarchy:**
1. Budget status (most critical) - largest, top position
2. Quick actions (Add Expense) - prominent placement
3. Recent transactions - scrollable list
4. Analytics - dedicated tab for deeper analysis

**Responsive Strategy:**
- Desktop: Sidebar + multi-column dashboard
- Tablet: Collapsible sidebar + 2-column cards
- Mobile: Bottom navigation + single column + swipeable cards

**Accessibility:**
- High contrast mode support
- Focus indicators on all interactive elements
- Screen reader labels for chart data
- Keyboard navigation for all features
- ARIA labels for financial figures

**Trust Indicators:**
- Consistent number formatting (currency symbols, decimals)
- Confirmation dialogs for delete actions
- Auto-save indicators
- Last updated timestamps
- Member badges on all transactions