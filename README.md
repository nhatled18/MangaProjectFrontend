# Manga Reading Web Frontend

A modern, responsive frontend application for a manga and anime reading platform built with React, TypeScript, and Tailwind CSS.

## Features

- 🎬 Anime catalog and search
- 📺 Detailed anime information pages
- 🔥 Trending and new releases sections
- 🎨 Modern dark theme with gold accents
- 📱 Fully responsive design
- ⚡ Fast and optimized performance
- 🔍 Search functionality
- 💕 Favorites management
- 📊 Rating and view count displays

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── AnimeCard.tsx
│   ├── AnimeGrid.tsx
│   ├── TrendingItem.tsx
│   ├── MangaBanner.tsx
│   └── Footer.tsx
│   └── Pagination.tsx #add pagination for this page 
├── pages/          # Page components
│   ├── Home.tsx
│   ├── AnimeList.tsx #update pagination 
│   ├── AnimeDetail.tsx
│   ├── NewSeasons.tsx
│   ├── Popular.tsx
│   └── SearchResults.tsx
│   └── ChapterViewer.tsx #update ChapterViewer
|   Setting.tsx

├── hooks/          # Custom React hooks
│   └── useAnime.ts
|   └── usePagination.ts
├── services/       # API services
│   └── animeService.ts
├── types/          # TypeScript types
│   └── index.ts
├── styles/         # Styling files
├── App.tsx         # Main app component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Configuration

The API base URL can be configured via environment variables:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Technologies Used

- React 18.2
- TypeScript 5.2
- Vite 5.0
- Tailwind CSS 3.3
- React Router 6.20
- Axios 1.6
- Lucide React 0.294

## API Endpoints

The frontend expects the following API endpoints from the backend:

- `GET /api/animes` - Get all animes
- `GET /api/animes/:id` - Get anime by ID
- `GET /api/animes/search?q=query` - Search animes
- `GET /api/animes/trending` - Get trending animes
- `GET /api/animes/new` - Get new releases
- `GET /api/animes/:id/episodes` - Get episodes for an anime

## Component Guide

### Navbar
Navigation bar with search, menu links, and user profile button.

### HeroSection
Large banner showing featured anime with call-to-action buttons.

### AnimeCard
Small card component displaying anime thumbnail, title, rating, and view count.

### AnimeGrid
Grid layout component that renders multiple anime cards.

### TrendingItem
Ranked list item component showing trending anime with more details.

### MangaBanner
Promotional banner for manga reading features.

### Footer
Footer component with links and social media.

## Styling

The project uses Tailwind CSS for styling with custom color scheme:
- Dark theme: Gray palette (900, 800, 700, etc.)
- Accent color: Gold (500, 600)
- Responsive breakpoints: Mobile-first approach

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Episode streaming
- [ ] User authentication
- [ ] Favorites/Watchlist
- [ ] Comments and reviews
- [ ] Social sharing
- [ ] Dark/Light theme toggle
- [ ] Download functionality
- [ ] Offline mode

## License

This project is part of the Manga Reading Web application.
