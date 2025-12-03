# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Framework**: Next.js 16.0.6 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono via next/font
- **Authentication**: Firebase Auth (email/password, Google, anonymous)
- **Backend**: Flask API with Neo4j graph database (separate codebase, default port 5001)

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Architecture

This is a **Clinical Trial Patient Matching Platform** frontend that connects to a Flask backend API.

### Application Flow
1. User lands on root (`/`) and is redirected to `/login` or `/search` based on Firebase auth status
2. **Firebase Authentication**:
   - Email/password sign in/sign up
   - Google OAuth sign in
   - Anonymous (guest) sign in
3. After Firebase auth, frontend sends ID token to backend `/api/firebase-login`
4. Backend verifies token with Firebase Admin SDK and creates session
5. Authenticated users can access: Search, Saved Trials, and Profile pages
6. All subsequent API calls use `credentials: 'include'` for session cookie handling

### Directory Structure

```
app/
├── page.tsx                  # Auth redirect (login or search)
├── layout.tsx                # Root layout with metadata
├── LayoutClient.tsx          # Client component with AuthProvider & route protection
├── login/
│   └── page.tsx             # Firebase login (email, Google, anonymous)
├── signup/
│   └── page.tsx             # Firebase sign up page
├── search/
│   └── page.tsx             # Trial search with filters + recommendations
├── smart-match/
│   └── page.tsx             # LLM-powered conversational chatbot for smart matching
├── trials/
│   └── [nctId]/
│       └── page.tsx         # Trial detail page + related trials
├── saved/
│   └── page.tsx             # Saved trials list
├── profile/
│   └── page.tsx             # Medical history form
└── components/
    ├── Nav.tsx              # Navigation bar with Smart Match link
    ├── TrialCard.tsx        # Trial display card (reusable)
    ├── SearchFilters.tsx    # Search form with "Use Medical History" feature
    ├── SaveButton.tsx       # Save/unsave trial button
    ├── RelatedTrials.tsx    # Graph-based related trials component
    ├── Recommendations.tsx  # Personalized recommendations component
    ├── MatchScoreBadge.tsx  # Visual match score indicator
    ├── ChatMessage.tsx      # Chat message bubble component
    ├── ChatInput.tsx        # Chat input field with Send button
    └── TypingIndicator.tsx  # Animated typing indicator
lib/
├── firebase.ts              # Firebase client initialization
├── auth.ts                  # Firebase auth functions (signIn, signUp, etc.)
├── auth-context.tsx         # React context for Firebase auth state
├── types.ts                 # TypeScript interfaces for all API responses
├── types/
│   ├── graph.ts            # Neo4j graph matching types
│   └── chat.ts             # Chat message and LLM API types
├── api.ts                   # Typed API client functions
└── api/
    ├── graphMatching.ts     # Neo4j graph matching API client
    └── chat.ts              # LLM chat API client
proxy.ts                      # Next.js 16 middleware for route protection
```

## Backend API Integration

The backend runs on `http://localhost:5001` by default. Set `NEXT_PUBLIC_API_URL` to override.

### Available Endpoints

**Authentication** (Firebase + session-based):
- `POST /api/firebase-login` - Exchange Firebase ID token for backend session
- `POST /api/login` - Legacy username login (deprecated)
- `POST /api/logout` - Clear session
- `GET /api/current-user` - Check auth status

**Medical History**:
- `POST /api/medical-history` - Save user's medical history
- `GET /api/medical-history` - Get user's medical history

**Clinical Trials** (ClinicalTrials.gov API with MongoDB caching):
- `GET /api/trials/search` - Basic search trials (params: condition, location, status, pageSize, pageToken)
- `GET /api/trials/{nctId}` - Get trial details

**Neo4j Graph-Based Matching** (Intelligent trial discovery):
- `POST /api/trials/smart-match` - Graph-based smart matching with match scores
- `GET /api/trials/{nctId}/related` - Find related trials through graph relationships
- `GET /api/recommendations` - Personalized recommendations based on medical history
- `GET /api/conditions/hierarchy` - Get condition parent/child relationships

**LLM-Powered Chat** (Conversational smart matching):
- `POST /api/chat` - Send message to LLM assistant, receives conversational response + optional trial results

**Saved Trials**:
- `GET /api/saved-trials` - Get user's saved trials
- `POST /api/saved-trials` - Save a trial
- `DELETE /api/saved-trials/{nctId}` - Remove saved trial

### Key Implementation Notes

- **Firebase Authentication Flow**:
  1. User authenticates with Firebase (email/password, Google, or anonymous)
  2. Frontend gets Firebase ID token via `getIdToken()`
  3. Frontend sends token to `/api/firebase-login`
  4. Backend verifies token with Firebase Admin SDK
  5. Backend creates session and returns success
  6. Frontend stores Firebase auth state in AuthContext

- **Neo4j Graph-Based Matching**:
  - Smart Match uses graph traversal to find trials based on condition relationships
  - Match scores indicate relevance (+10 per condition match, +5 for location)
  - Related Trials shows trials connected through shared conditions/locations
  - Recommendations are personalized based on user's medical history conditions
  - All graph queries are fast (Neo4j traverses millions of relationships in milliseconds)

- **LLM-Powered Chat Interface**:
  - Smart Match page features conversational chatbot (Google Gemini 1.5)
  - LLM extracts medical conditions, location, age, gender from natural language
  - Uses function calling to invoke Neo4j smart matching when enough info is gathered
  - Explains match results in plain English with reasoning
  - Maintains conversation context for follow-up questions
  - "Use My Medical History" button auto-fills from user profile
  - Trial results display inline within assistant messages as clickable cards
  - Gemini free tier: 15 requests/min, 1M tokens/day (sufficient for development/small production)

- All API calls require `credentials: 'include'` for session cookies
- Medical history fields: age, gender, location, conditions (textarea), medications (textarea)
- Search filters auto-fill from medical history via "Use My Medical History" button
- Trial data cached in MongoDB on backend for performance
- NCT ID is the unique identifier for clinical trials

## Firebase Configuration

1. Create a `.env.local` file based on `.env.local.example`
2. Get Firebase config from [Firebase Console](https://console.firebase.google.com/) → Project Settings → General
3. Enable authentication methods:
   - Email/Password
   - Google OAuth
   - Anonymous
4. Backend also needs Firebase Admin SDK configuration (see backend integration docs)

## Styling Guidelines

- Minimalist design with clean cards and subtle shadows
- Tailwind utility classes throughout
- Color coding for recruitment status:
  - Green: `RECRUITING`
  - Yellow: `NOT_YET_RECRUITING`
  - Gray: `COMPLETED`
  - Blue: Other statuses
- Mobile-first responsive design
- No custom CSS files beyond `globals.css`
