import { useState, useEffect } from 'react';
import { Anime } from '@/types';
import { animeService } from '@/services/animeService';

export const useTrendingAnimes = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await animeService.getTrendingAnimes();
        // Backend returns { items: [...], pagination: {...} }
        setAnimes(response.items || []);
      } catch (err) {
        setError('Failed to fetch trending animes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return { animes, loading, error };
};

export const useNewReleases = (page: number = 1) => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchNew = async () => {
      setLoading(true);
      try {
        const response = await animeService.getNewReleases(page);
        setAnimes(response.items || []);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalItems || 0);
      } catch (err) {
        setError('Failed to fetch new releases');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNew();
  }, [page]);

  return { animes, loading, error, totalPages, totalItems };
};

export const useAllStories = (page: number = 1) => {
  const [stories, setStories] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchAllStories = async () => {
      setLoading(true);
      try {
        const response = await animeService.getAllAnimes({ page });
        setStories(response.items || []);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalItems || 0);
      } catch (err) {
        setError('Failed to fetch stories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStories();
  }, [page]);

  return { stories, loading, error, totalPages, totalItems };
};

export const useSearchAnimes = (query: string, page: number = 1) => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setAnimes([]);
      setTotalPages(0);
      setTotalItems(0);
      return;
    }

    const search = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await animeService.searchAnimes(query, page);
        setAnimes(response.items || []);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalItems || 0);
      } catch (err) {
        setError('Failed to search animes');
        console.error(err);
        setAnimes([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search requests
    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, page]);

  return { animes, loading, error, totalPages, totalItems };
};

export const useAnimeDetail = (id: string) => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setAnime(null);
      setLoading(false);
      return;
    }

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await animeService.getAnimeById(id);
        setAnime(data);
      } catch (err) {
        setError('Failed to fetch anime details');
        console.error(err);
        setAnime(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { anime, loading, error };
};

export const useEpisodes = (animeId: string, page: number = 1) => {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!animeId) {
      setEpisodes([]);
      setLoading(false);
      return;
    }

    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const data = await animeService.getEpisodes(animeId, page);
        setEpisodes(data || []);
      } catch (err) {
        setError('Failed to fetch episodes');
        console.error(err);
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [animeId, page]);

  return { episodes, loading, error };
};