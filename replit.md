# BetterDay

## Overview

BetterDay is an AI-powered life guidance application that provides three distinct modes of assistance: decision-making support, daily planning, and general advisory guidance. The application uses OpenAI's GPT-5 model to analyze user input and generate structured, actionable responses tailored to each mode. Built with a mobile-first approach, the app features a clean, warm design centered around a rising sun motif that symbolizes clarity and new beginnings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- Mobile-first responsive design with max-width constraints (600px centered on desktop)

**UI Component System**
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom design system with Material Design influences
- CSS variables for theming (supports light/dark modes via HSL color definitions)
- Framer Motion for animations and transitions

**State Management**
- TanStack Query (React Query) for server state and API request management
- Local component state with React hooks
- Stateless architecture - no persistent client-side storage

**Key Design Patterns**
- Three-tab navigation structure (Decisions, Planner, Advisor) implemented with Radix Tabs
- Consistent layout structure: animated header zone → input area → action button → response display
- Single-column layout for simplicity and mobile optimization
- Card-based response presentation with clear visual hierarchy

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type safety
- ESM module system
- Custom Vite middleware integration for development HMR

**API Design**
- RESTful endpoints following `/api/ai/{mode}` pattern
- Three dedicated endpoints: `/api/ai/decisions`, `/api/ai/planner`, `/api/ai/advisor`
- JSON request/response format with validation
- Centralized error handling with user-friendly messages

**Request Flow**
1. Client submits user input through mode-specific component
2. Backend validates input and calls OpenAI API with mode-specific system prompts
3. OpenAI returns structured JSON response
4. Backend forwards response to client
5. Client renders structured data in mode-appropriate format

**Validation & Type Safety**
- Zod schemas for runtime validation (`aiRequestSchema`)
- Shared TypeScript types between client and server
- Type-safe response interfaces (`DecisionResponse`, `PlannerResponse`, `AdvisorResponse`)

### Data Storage

**Current Architecture**
- Stateless design with no persistent storage
- Each AI interaction is independent and ephemeral
- No user authentication or session management
- MemStorage implementation serves as placeholder for future storage needs

**Database Configuration (Prepared but Unused)**
- Drizzle ORM configured for PostgreSQL via Neon serverless driver
- Schema definitions exist in shared directory
- Migration system configured but no active database operations
- Connection configured via `DATABASE_URL` environment variable

### External Dependencies

**AI Service Integration**
- OpenAI API (GPT-5 model released August 7, 2025)
- Requires `OPENAI_API_KEY` environment variable
- Structured JSON responses via `response_format: { type: "json_object" }`
- Mode-specific system prompts for consistent output formatting

**Design & Typography**
- Google Fonts: Inter (primary), Fira Code (monospace)
- Inter weights: 300, 400, 500, 600, 700 for typography hierarchy
- Font loading via preconnect for performance

**Development Tools**
- Replit-specific plugins for development environment:
  - `@replit/vite-plugin-runtime-error-modal` for error overlay
  - `@replit/vite-plugin-cartographer` for project navigation
  - `@replit/vite-plugin-dev-banner` for development indicators
- Production builds exclude Replit development dependencies

**Component Libraries**
- Radix UI primitives for accessible, unstyled components
- Embla Carousel for carousel functionality
- Vaul for drawer components
- cmdk for command palette patterns
- react-day-picker for date selection

**Utility Libraries**
- class-variance-authority (CVA) for component variant management
- clsx and tailwind-merge for conditional className handling
- date-fns for date manipulation
- nanoid for unique ID generation
- Lucide React for icon system