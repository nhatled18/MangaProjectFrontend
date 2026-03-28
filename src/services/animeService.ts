import apiClient from './api';
import { Anime, Episode } from '@/types';
import { getFullImageUrl } from '@/utils/image';

interface SearchResponse {
  items: Anime[];
  totalItems: number;
  totalPages: number;
}

interface GetAnimesOptions {
  page?: number;
  limit?: number;
  keyword?: string;
}

// ✅ Helper to convert raw backend data to Anime type
const convertAnimeData = (data: any): Anime => {
  return {
    id: data._id || data.id || '',
    title: data.name || data.title || '',
    image: getFullImageUrl(data.image || data.thumb_url),
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

// ✅ Generic fetcher for paginated results
const fetchPaginatedResults = async (url: string, params: any = {}): Promise<SearchResponse> => {
  try {
    const response = await apiClient.get(url, { params });
    const data = response.data.data;
    const items = (data.items || []).map(convertAnimeData);
    const pagination = data.params?.pagination || {};

    return {
      items,
      totalItems: pagination.totalItems || items.length,
      totalPages: Math.ceil(
        (pagination.totalItems || items.length) / 
        (pagination.totalItemsPerPage || 24)
      ),
    };
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return { items: [], totalItems: 0, totalPages: 0 };
  }
};

export const animeService = {
  getAllAnimes: (options?: GetAnimesOptions) => 
    fetchPaginatedResults('/danh-sach', { page: options?.page || 1 }),

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

  searchAnimes: (query: string, page: number = 1) => {
    if (!query.trim()) return Promise.resolve({ items: [], totalItems: 0, totalPages: 0 });
    return fetchPaginatedResults('/danh-sach', { keyword: query, page });
  },

  getTrendingAnimes: (page: number = 1) => 
    fetchPaginatedResults('/danh-sach', { page }),

  getNewReleases: (page: number = 1) => 
    fetchPaginatedResults('/danh-sach/truyen-moi', { page }),

  getEpisodes: async (animeId: string, page: number = 1): Promise<Episode[]> => {
    try {
      const response = await apiClient.get(`/comic/${animeId}/chapters`, {
        params: { page },
      });
      return Array.isArray(response.data.data?.items) ? response.data.data.items : [];
    } catch (error) {
      console.error('Error fetching episodes:', error);
      return [];
    }
  },

  getChapterContent: async (chapterId: string) => {
    const response = await apiClient.get('/chapter', { params: { id: chapterId } });
    return response.data || null;
  },
};

export default animeService;