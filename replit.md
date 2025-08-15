# Nexus Gamble

## Overview

Nexus Gamble is a futuristic gaming application built with React, TypeScript, and Express. The application features a multi-round gambling game with different game modes including rocket selection, projectile prediction, and battle scenarios. The frontend uses a modern tech stack with shadcn/ui components, Tailwind CSS for styling with a cyberpunk/gaming aesthetic, and TanStack Query for state management. The backend is built with Express.js and uses Drizzle ORM with PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend follows a component-based React architecture with TypeScript:

- **Component Structure**: Uses a hierarchical component system with reusable UI components from shadcn/ui
- **Routing**: React Router for client-side navigation with a catch-all route for 404 handling
- **State Management**: TanStack Query for server state management, local React state for UI interactions
- **Styling**: Tailwind CSS with custom CSS variables for theming, supporting a futuristic gaming aesthetic with neon colors and glowing effects
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
The backend follows a RESTful API pattern with Express.js:

- **Server Framework**: Express.js with TypeScript for type safety
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Storage Pattern**: Repository pattern with IStorage interface for data operations
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reload with tsx for development server

### Database Design
Uses PostgreSQL with Drizzle ORM:

- **Schema Definition**: Centralized schema in shared directory for type consistency
- **User Model**: Basic user table with username and password fields
- **Type Safety**: Drizzle-zod integration for runtime validation
- **Migrations**: Drizzle-kit for schema management and migrations

### Project Structure
The application uses a monorepo structure:

- **client/**: React frontend application
- **server/**: Express.js backend API
- **shared/**: Common TypeScript types and schemas
- **Root Configuration**: Shared configuration files for TypeScript, Tailwind, and build tools

### Authentication & Session Management
Currently implements basic user storage without authentication middleware. The storage interface suggests preparation for user management features.

### Development Environment
Optimized for Replit development:

- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend
- **Error Overlay**: Runtime error modal for development debugging
- **Replit Integration**: Cartographer plugin for Replit-specific features
- **Environment Variables**: Database URL configuration for PostgreSQL connection

### Game Architecture
The application implements a multi-round gaming system:

- **Game Phases**: Landing page, multiple game rounds with leaderboards
- **Round Types**: Rocket selection, projectile prediction, and battle scenarios
- **Mock Data**: Generates simulated player data for leaderboard functionality
- **Responsive Design**: Mobile-first approach with responsive components

### UI/UX Design System
Implements a comprehensive design system:

- **Theme**: Dark mode cyberpunk aesthetic with neon accents
- **Color Palette**: Electric blue primary, neon green accent, deep purple secondary
- **Typography**: Gaming-focused with glow effects and special animations
- **Components**: Extensive UI component library with gaming-specific variants