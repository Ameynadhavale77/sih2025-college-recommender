# Overview

This is a college recommendation system built for SIH 2025, specifically designed to help students in Jammu & Kashmir find suitable colleges based on their preferences. The application uses a quiz-based approach to collect user preferences and provides personalized college recommendations using a scoring algorithm.

The system consists of a React frontend that presents an interactive quiz, collects user responses about academic streams, course preferences, location, and practical work interests, then generates ranked college recommendations from a curated database of J&K institutions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with Vite as the build tool and development server
- **Routing**: React Router DOM for client-side navigation
- **Styling**: Tailwind CSS for utility-first styling approach
- **State Management**: React hooks (useState) for local component state
- **Build System**: Vite configured to serve from `./frontend` directory on port 5000

## Backend Architecture
- **Primary Backend**: Firebase Cloud Functions for serverless API endpoints
- **Alternative Logic**: Local JavaScript modules for recommendation algorithms
- **API Structure**: RESTful endpoints for colleges, courses, quiz data, and recommendations
- **CORS**: Configured to allow cross-origin requests from frontend

## Data Storage Solutions
- **Static Data**: JSON files stored in `/data` directory containing:
  - `jk_colleges.json`: College database with location, courses, cutoffs, facilities
  - `courses.json`: Course catalog with streams, duration, subjects, career options
  - `quiz.json`: Quiz questions with scoring weights and answer options
- **No Database**: Currently uses file-based storage for simplicity and rapid development

## Recommendation Algorithm
- **Scoring System**: Weighted scoring based on user preferences
- **Factors Considered**: Academic stream (30 points), course type (25 points), location (20 points), practical work interest (15 points)
- **Ranking**: Colleges sorted by total score with top 5 returned
- **Fallback Logic**: Local algorithm in frontend when Firebase functions unavailable

## Quiz System Design
- **Question Types**: Single-select and multi-select questions supported
- **Scoring Schema**: Each answer option has predefined score weights
- **Progressive Disclosure**: Results shown only after quiz completion
- **User Experience**: Simple form-based interface with immediate feedback

# External Dependencies

## Development Tools
- **Vite**: Modern frontend build tool and development server
- **React Developer Tools**: For component debugging and state inspection

## Production Services
- **Firebase**: 
  - Cloud Functions for serverless API hosting
  - Admin SDK for backend operations
  - Functions emulator for local development

## Third-party Libraries
- **React Router**: Client-side routing and navigation
- **Tailwind CSS**: Utility-first CSS framework
- **CORS**: Cross-origin resource sharing middleware

## Potential Integrations
- **Authentication**: Firebase Auth (not yet implemented)
- **Analytics**: Usage tracking and recommendation effectiveness
- **Maps Integration**: Google Maps for college location visualization
- **Database Migration**: Future PostgreSQL integration for dynamic data management