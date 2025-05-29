# Overview

This is a modern full-stack web application for a smart building environmental monitoring system. The system provides real-time dashboard visualization of environmental data from IoT sensors including temperature, humidity, air quality, noise levels, and energy usage. It features a sleek, animated dashboard interface with WebSocket real-time updates and a PostgreSQL database backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with a clear separation between client and server code:

- **Frontend**: React-based single-page application with TypeScript
- **Backend**: Express.js REST API with WebSocket support  
- **Database**: PostgreSQL with Drizzle ORM
- **Build System**: Vite for frontend bundling and development
- **UI Framework**: Tailwind CSS with shadcn/ui components

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dashboard theming
- **Real-time Updates**: WebSocket client with automatic reconnection

### Backend Architecture
- **Runtime**: Node.js with TypeScript (using tsx for development)
- **Framework**: Express.js for REST API
- **WebSocket**: ws library for real-time communication
- **Database Access**: Drizzle ORM with PostgreSQL
- **Data Storage**: Dual storage approach with in-memory fallback and PostgreSQL persistence

### Database Schema
The system uses three main tables:
- `users`: Basic user authentication (username/password)
- `sensor_data`: Environmental sensor readings with timestamps
- `system_status`: System health and connectivity status

## Data Flow

1. **Data Collection**: Simulated sensor data is generated and stored in memory/database
2. **API Layer**: REST endpoints serve dashboard data and system status
3. **Real-time Updates**: WebSocket server broadcasts live data updates to connected clients
4. **Frontend Display**: Dashboard components render data with animations and responsive design
5. **State Management**: React Query caches API responses with WebSocket updates taking precedence

## External Dependencies

### Production Dependencies
- **Database**: `@neondatabase/serverless` for Neon PostgreSQL connection
- **ORM**: `drizzle-orm` with `drizzle-zod` for schema validation
- **UI**: Comprehensive Radix UI component set for accessibility
- **Real-time**: `ws` WebSocket library for live updates
- **Utilities**: `date-fns`, `clsx`, `class-variance-authority` for various utilities

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Database**: Drizzle Kit for schema migrations
- **Bundling**: esbuild for server-side production builds

## Deployment Strategy

The application is configured for Replit deployment with:

- **Development**: `npm run dev` starts both frontend and backend with hot reload
- **Production Build**: Vite builds frontend assets, esbuild bundles server code
- **Runtime**: Node.js production server serves static files and API endpoints
- **Database**: PostgreSQL 16 module enabled in Replit environment
- **WebSocket**: Configured for both local development and production deployment

The system includes proper environment variable handling for database connections and supports both development and production deployment scenarios on Replit's infrastructure.