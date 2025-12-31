import axios from 'axios';
import { Anime, Episode } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for API responses
// interface PaginationResponse {
//   items: any[];
//   pagination?: {
//     currentPage: number;
//     totalItems: number;
//     totalItemsPerPage: number;
//   };
//   params?: {
//     pagination: {
//       currentPage: number;
//       totalItems: number;
//       totalItemsPerPage: number;
//     };
//   };
// }

interface SearchResponse {
  items: Anime[];
  totalItems: number;
  totalPages: number;
}

// Convert snake_case from backend to camelCase for frontend
const convertAnimeData = (data: any): Anime => {
  return {
    id: data._id || data.id || '',
    title: data.name || data.title || '',
    image: data.thumb_url || data.image || '',
    description: data.content || data.description || '',
    episodeCount: data.episode_count || data.chaptersLatest?.length || 0,
    currentEpisode: data.current_episode || data.chaptersLatest?.[0]?.chapter_name || 'N/A',
    rating: data.rating || 0,
    viewCount: data.view_count || 0,
    type: data.type || 'Manga',
    status: data.status || 'Ongoing',
    category: data.category || 'Manga',
    slug: data.slug || '',
  };
};

interface GetAnimesOptions {
  page?: number;
  limit?: number;
}

export const animeService = {
  // Get all animes with pagination
  getAllAnimes: async (options?: GetAnimesOptions): Promise<SearchResponse> => {
    try {
      const page = options?.page || 1;
      const response = await apiClient.get('/danh-sach', {
        params: { page },
      });

      const data = response.data.data;
      const items = (data.items || []).map(convertAnimeData);
      const pagination = data.params?.pagination || {};

      return {
        items,
        totalItems: pagination.totalItems || items.length,
        totalPages: Math.ceil((pagination.totalItems || items.length) / (pagination.totalItemsPerPage || 24)),
      };
    } catch (error) {
      console.error('Error fetching animes:', error);
      return { items: [], totalItems: 0, totalPages: 0 };
    }
  },

  // Get anime by ID
  getAnimeById: async (id: string): Promise<Anime | null> => {
    try {
      const response = await apiClient.get(`/truyen-tranh/${id}`);
      const data = response.data.data?.item || response.data.data;
      return data ? convertAnimeData(data) : null;
    } catch (error) {
      console.error('Error fetching anime:', error);
      return null;
    }
  },

  // Search animes with pagination
  searchAnimes: async (query: string, page: number = 1): Promise<SearchResponse> => {
    try {
      if (!query.trim()) {
        return { items: [], totalItems: 0, totalPages: 0 };
      }

      const response = await apiClient.get('/danh-sach', {
        params: { keyword: query, page },
      });

      const data = response.data.data;
      const items = (data.items || []).map(convertAnimeData);
      const pagination = data.params?.pagination || {};

      return {
        items,
        totalItems: pagination.totalItems || items.length,
        totalPages: Math.ceil((pagination.totalItems || items.length) / (pagination.totalItemsPerPage || 24)),
      };
    } catch (error) {
      console.error('Error searching animes:', error);
      return { items: [], totalItems: 0, totalPages: 0 };
    }
  },

  // Get trending animes with pagination (return SearchResponse format)
  getTrendingAnimes: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await apiClient.get('/danh-sach', {
        params: { page },
      });
      const data = response.data.data;
      const items = (data.items || []).map(convertAnimeData);
      const pagination = data.params?.pagination || {};

      return {
        items,
        totalItems: pagination.totalItems || items.length,
        totalPages: Math.ceil((pagination.totalItems || items.length) / (pagination.totalItemsPerPage || 24)),
      };
    } catch (error) {
      console.error('Error fetching trending:', error);
      return { items: [], totalItems: 0, totalPages: 0 };
    }
  },

  // Get new releases with pagination
  getNewReleases: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await apiClient.get('/danh-sach/truyen-moi', {
        params: { page },
      });

      const data = response.data.data;
      const items = (data.items || []).map(convertAnimeData);
      const pagination = data.params?.pagination || {};

      return {
        items,
        totalItems: pagination.totalItems || items.length,
        totalPages: Math.ceil((pagination.totalItems || items.length) / (pagination.totalItemsPerPage || 24)),
      };
    } catch (error) {
      console.error('Error fetching new releases:', error);
      return { items: [], totalItems: 0, totalPages: 0 };
    }
  },

  // Get episodes for an anime
  getEpisodes: async (animeId: string, page: number = 1): Promise<Episode[]> => {
    try {
      const response = await apiClient.get(`/comic/${animeId}/chapters`, {
        params: { page },
      });
      const data = response.data.data;
      return Array.isArray(data?.items) ? data.items : [];
    } catch (error) {
      console.error('Error fetching episodes:', error);
      return [];
    }
  },

  // Get chapter content
  getChapterContent: async (chapterId: string) => {
    try {
      const response = await apiClient.get(`/chapter/${chapterId}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching chapter content:', error);
      return null;
    }
  },
};

export default apiClient;