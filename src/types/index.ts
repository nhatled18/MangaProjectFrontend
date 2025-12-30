export interface Anime {
  id: string;
  title: string;
  image: string;
  description: string;
  episodeCount: number;
  currentEpisode: string;
  rating: number;
  viewCount: number;
  type: string;
  status: string;
  category: string | string[];
  slug?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

export interface Episode {
  id: string;
  animeId: string;
  episodeNumber: number;
  title: string;
  videoUrl: string;
  description: string;
  duration: number;
  releaseDate: string;
}
