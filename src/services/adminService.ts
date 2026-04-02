import { getApiUrl } from '../utils/image';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errData;
    try {
      errData = await response.json();
    } catch {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    throw new Error(errData.msg || errData.error || 'Request failed');
  }
  return response.json();
};

const getHeaders = (token: string, isFormData = false) => {
  const headers: HeadersInit = {
    'Authorization': `Bearer ${token}`
  };
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const adminService = {
  // --- User Management ---
  getUsers: (token: string, page: number = 1, limit: number = 10) => {
    return fetch(`${getApiUrl()}/auth/admin/users?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getHeaders(token)
    }).then(handleResponse);
  },
  
  updateUserRole: (token: string, userId: number, role: 'admin' | 'user') => {
    return fetch(`${getApiUrl()}/auth/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ role })
    }).then(handleResponse);
  },
  
  toggleUserStatus: (token: string, userId: number, isActive: boolean) => {
    return fetch(`${getApiUrl()}/auth/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ is_active: isActive })
    }).then(handleResponse);
  },

  // --- Image Upload ---
  uploadImage: (token: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${getApiUrl()}/admin/upload-image`, {
      method: 'POST',
      headers: getHeaders(token, true),
      body: formData
    }).then(handleResponse);
  },

  // --- Anime Management ---
  createAnime: (token: string, data: any) => {
    return fetch(`${getApiUrl()}/admin/anime`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    }).then(handleResponse);
  },

  getMyAnimes: (token: string, page: number = 1, limit: number = 20) => {
    return fetch(`${getApiUrl()}/admin/animes/mine?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getHeaders(token)
    }).then(handleResponse);
  },

  updateAnime: (token: string, id: number, data: any) => {
    return fetch(`${getApiUrl()}/admin/anime/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data)
    }).then(handleResponse);
  },

  deleteAnime: (token: string, id: number) => {
    return fetch(`${getApiUrl()}/admin/anime/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    }).then(handleResponse);
  },

  // --- Chapter Management ---
  uploadChaptersZip: (token: string, animeId: string, formData: FormData) => {
    return fetch(`${getApiUrl()}/admin/anime/${animeId}/upload-chapters-zip`, {
      method: 'POST',
      headers: getHeaders(token, true),
      body: formData
    }).then(handleResponse);
  },

  getChapters: (token: string, animeId: number) => {
    return fetch(`${getApiUrl()}/admin/anime/${animeId}/chapters`, {
      method: 'GET',
      headers: getHeaders(token)
    }).then(handleResponse);
  },

  deleteChapter: (token: string, chapterId: number) => {
    return fetch(`${getApiUrl()}/admin/chapter/${chapterId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    }).then(handleResponse);
  },

  updateChapter: (token: string, chapterId: number, formData: FormData) => {
    return fetch(`${getApiUrl()}/admin/chapter/${chapterId}`, {
      method: 'PUT',
      headers: getHeaders(token, true),
      body: formData
    }).then(handleResponse);
  },

  uploadChapterImages: (token: string, animeId: string, formData: FormData) => {
    return fetch(`${getApiUrl()}/admin/anime/${animeId}/upload-chapter-images`, {
      method: 'POST',
      headers: getHeaders(token, true),
      body: formData
    }).then(handleResponse);
  },

  // --- Page Management ---
  getPages: (token: string, chapterId: number) => {
    return fetch(`${getApiUrl()}/admin/chapter/${chapterId}/pages`, {
      method: 'GET',
      headers: getHeaders(token)
    }).then(handleResponse);
  },

  deletePage: (token: string, pageId: number) => {
    return fetch(`${getApiUrl()}/admin/page/${pageId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    }).then(handleResponse);
  },

  updatePageImage: (token: string, pageId: number, formData: FormData) => {
    return fetch(`${getApiUrl()}/admin/page/${pageId}`, {
      method: 'PUT',
      headers: getHeaders(token, true),
      body: formData
    }).then(handleResponse);
  }
};
