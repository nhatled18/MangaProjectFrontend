export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

export const getBackendUrl = () => {
  const apiUrl = getApiUrl();
  return apiUrl.endsWith('/api') ? apiUrl.replace('/api', '') : apiUrl;
};

export const getFullImageUrl = (path: string | null) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = getBackendUrl();
  return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};
