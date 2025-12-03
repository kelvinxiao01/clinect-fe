# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Framework**: Next.js 16.0.6 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono via next/font
- **Backend**: Flask API (separate codebase, default port 5001)

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
1. User lands on root (`/`) and is redirected to `/login` or `/search` based on auth status
2. Mock authentication - any username is accepted (session-based via backend cookies)
3. Authenticated users can access: Search, Saved Trials, and Profile pages
4. All API calls use `credentials: 'include'` for session cookie handling

### Directory Structure

```
app/
├── page.tsx                  # Auth redirect (login or search)
├── layout.tsx                # Root layout with metadata
├── LayoutClient.tsx          # Client component for conditional nav
├── login/
│   └── page.tsx             # Mock login page
├── search/
│   └── page.tsx             # Trial search with filters
├── trials/
│   └── [nctId]/
│       └── page.tsx         # Trial detail page (dynamic route)
├── saved/
│   └── page.tsx             # Saved trials list
├── profile/
│   └── page.tsx             # Medical history form
└── components/
    ├── Nav.tsx              # Navigation bar
    ├── TrialCard.tsx        # Trial display card (reusable)
    ├── SearchFilters.tsx    # Search form with "Use Medical History" feature
    └── SaveButton.tsx       # Save/unsave trial button
lib/
├── types.ts                 # TypeScript interfaces for all API responses
└── api.ts                   # Typed API client functions
```

## Backend API Integration

The backend runs on `http://localhost:5001` by default. Set `NEXT_PUBLIC_API_URL` to override.

### Available Endpoints

**Authentication** (session-based, no JWT):
- `POST /api/login` - Mock login with username
- `POST /api/logout` - Clear session
- `GET /api/current-user` - Check auth status

**Medical History**:
- `POST /api/medical-history` - Save user's medical history
- `GET /api/medical-history` - Get user's medical history

**Clinical Trials** (ClinicalTrials.gov API with MongoDB caching):
- `GET /api/trials/search` - Search trials (params: condition, location, status, pageSize, pageToken)
- `GET /api/trials/{nctId}` - Get trial details

**Saved Trials**:
- `GET /api/saved-trials` - Get user's saved trials
- `POST /api/saved-trials` - Save a trial
- `DELETE /api/saved-trials/{nctId}` - Remove saved trial

### Key Implementation Notes

- All API calls require `credentials: 'include'` for session cookies
- Medical history fields: age, gender, location, conditions (textarea), medications (textarea)
- Search filters auto-fill from medical history via "Use My Medical History" button
- Trial data cached in MongoDB on backend for performance
- NCT ID is the unique identifier for clinical trials

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
