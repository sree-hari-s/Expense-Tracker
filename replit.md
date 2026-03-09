# Family Expense Tracker

## Overview

A family-oriented expense tracking application that enables multiple family members to log in, track shared expenses, manage budgets, and visualize spending patterns. The application provides a comprehensive view of family finances with individual member tracking, category-based expense organization, and interactive data visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Wouter for lightweight client-side routing
- Path aliases configured for clean imports (`@/`, `@shared/`, `@assets/`)

**UI Component System**
- Shadcn/ui component library (New York style) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Theme system supporting light/dark modes via React Context
- Material Design-inspired finance app aesthetic focusing on trust and clarity
- Custom color palette optimized for financial data (success/warning/danger states)
- Typography: Inter (primary), Plus Jakarta Sans (headers), JetBrains Mono (numbers)

**State Management**
- TanStack Query (React Query) for server state and data fetching
- React Context for global UI state (theme, current user session)
- Local Storage for user session persistence
- Form state managed by React Hook Form with Zod validation

**Data Visualization**
- Recharts library for interactive charts (pie charts, bar charts)
- Custom chart components wrapped with Shadcn chart utilities
- Category-wise expense distribution and member income vs. expense comparisons

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- ESM module system for modern JavaScript support
- RESTful API design pattern

**API Structure**
- `/api/family-members` - CRUD operations for family member profiles
- `/api/expenses` - CRUD operations for expense tracking
- `/api/categories` - Fetch available expense categories
- `/api/budget/summary` - Aggregated budget calculations
- Middleware for request logging and error handling
- JSON-based request/response communication

**Data Layer**
- In-memory storage implementation (MemStorage class) for development
- Drizzle ORM configured for PostgreSQL (production-ready schema defined)
- Type-safe database queries with Zod schema validation
- UUID-based primary keys for all entities

### Database Schema

**Tables**
- `family_members`: User profiles with name, income, and avatar color
- `expenses`: Transaction records linked to family members with category, amount, description, and timestamp

**Key Relationships**
- Expenses reference family members via `memberId` foreign key
- Soft relationship enforcement (no strict DB constraints in memory storage)

**Data Validation**
- Zod schemas for insert/update operations ensuring type safety
- Drizzle-Zod integration for automatic schema generation from database models
- Client and server-side validation using shared schema definitions

### Authentication & Authorization

**Current Implementation**
- Session-based authentication using localStorage for user persistence
- Login/registration flow with family member selection
- Protected route wrapper component preventing unauthorized access
- No backend session management (stateless authentication)

**User Flow**
- Users select existing family member or register new profile
- Optional income input during registration
- Avatar color selection for visual identification
- Automatic member association with all created expenses

### Design System

**Color System**
- HSL-based color tokens with CSS custom properties
- Automatic dark mode support with theme-specific color variations
- Finance-specific semantic colors (success for under budget, danger for over budget)
- Elevation system using opacity-based overlays for depth

**Component Patterns**
- Consistent border radius (lg: 9px, md: 6px, sm: 3px)
- Shadow system for card elevation and visual hierarchy
- Hover and active state elevation effects
- Responsive design with mobile-first breakpoints

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver for serverless environments
- **drizzle-orm**: Type-safe SQL ORM for database operations
- **express**: Web application framework for Node.js backend
- **react**: Frontend UI library
- **vite**: Frontend build tool and development server

### UI & Visualization Libraries
- **@radix-ui/***: Headless UI component primitives (20+ components)
- **recharts**: Charting library for data visualization
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### Form & Validation
- **react-hook-form**: Performant form state management
- **zod**: Schema validation library
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Data Fetching & State
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing library

### Development Tools
- **typescript**: Type checking and development experience
- **tsx**: TypeScript execution for development server
- **esbuild**: JavaScript bundler for production builds
- **drizzle-kit**: Database migration and schema management CLI

### Export & Data Processing
- **jspdf & jspdf-autotable**: PDF generation for expense reports
- **papaparse**: CSV parsing and generation for data export

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Code navigation enhancement
- **@replit/vite-plugin-dev-banner**: Development environment indicator

### Third-Party Services
- PostgreSQL database (configured for Neon serverless)
- Font delivery via Google Fonts (Inter, Plus Jakarta Sans, JetBrains Mono)