import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/auth';
import { Shield, UserCheck, UserX, Plus, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface AnimeForm {
  title: string;
  description: string;
  image: string;
  banner: string;
  type: 'TV' | 'Movie' | 'OVA';
  status: 'Ongoing' | 'Completed';
  category: string;
  rating: number;
  episodeCount: number;
  currentEpisode: number;
  isPublished: boolean;
}

interface ChapterUploadResult {
  success: boolean;
  message?: string;
  error?: string;
  chapters_created?: Array<{ chapter: number; title: string; pages: number }>;
  total_chapters?: number;
  errors?: string[];
}

export function AdminDashboard() {
  const { isAdmin, isAuthenticated, token, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'upload-anime' | 'my-stories'>('users');
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [lastCreatedAnimeId, setLastCreatedAnimeId] = useState<number | null>(null);
  const [myStories, setMyStories] = useState<any[]>([]);
  const [myStoriesLoading, setMyStoriesLoading] = useState(false);
  const [myStoriesError, setMyStoriesError] = useState<string | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingForm, setEditingForm] = useState<{ title: string; description: string; image?: string }>({ title: '', description: '' });
  const [editingError, setEditingError] = useState<string | null>(null);
  const [editingSaving, setEditingSaving] = useState(false);
  const [editingImageFile, setEditingImageFile] = useState<File | null>(null);
  const [editingImagePreview, setEditingImagePreview] = useState<string | null>(null);
  const [editingImageUploading, setEditingImageUploading] = useState(false);
  
  // Chapter upload state
  const [chapterFile, setChapterFile] = useState<File | null>(null);
  const [animeId, setAnimeId] = useState<string>('');
  const [chapterResult, setChapterResult] = useState<ChapterUploadResult | null>(null);

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [form, setForm] = useState<AnimeForm>({
    title: '',
    description: '',
    image: '',
    banner: '',
    type: 'TV',
    status: 'Ongoing',
    category: '',
    rating: 0,
    episodeCount: 0,
    currentEpisode: 0,
    isPublished: true,
  });

  // Get API URL from environment or use default
  const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  };

  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    fetchUsers();
  }, [isInitialized, isAuthenticated, isAdmin, token, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/auth/admin/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || errorData.error || 'Failed to load users');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
      } else {
        setError(data.error || 'Failed to load users');
      }
    } catch (err) {
      setError('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: 'admin' | 'user') => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/auth/admin/users/${userId}/role`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role: newRole })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to update role');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? data.user : u));
      } else {
        setError(data.error || 'Failed to update role');
      }
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Error updating role');
    }
  };

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/auth/admin/users/${userId}/status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ is_active: !currentStatus })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.msg || 'Failed to update status');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setUsers(users.map(u => u.id === userId ? data.user : u));
      } else {
        setError(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Error updating status');
    }
  };

  const handleFormChange = (e: any) => {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? (name === 'rating' ? parseFloat(value) : parseInt(value)) : 
              value
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    // Kiểm tra loại file bằng extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const isImageByExt = fileExt && validExtensions.includes(fileExt);
    
    if (isImageByExt) {
      setImageFile(file);
      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert(`❌ File type không hỗ trợ! Chỉ chấp nhận: ${validExtensions.join(', ').toUpperCase()}`);
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const uploadImageFile = async (file: File, isEditing: boolean = false): Promise<string | null> => {
    try {
      if (isEditing) {
        setEditingImageUploading(true);
      } else {
        setImageUploading(true);
      }
      
      const apiUrl = getApiUrl();
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${apiUrl}/admin/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.msg || err.error || 'Failed to upload image');
        return null;
      }

      const data = await response.json();
      
      if (data.success) {
        return data.image_url;
      } else {
        alert(data.error || 'Failed to upload image');
        return null;
      }
    } catch (err) {
      alert('Error uploading image: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return null;
    } finally {
      if (isEditing) {
        setEditingImageUploading(false);
      } else {
        setImageUploading(false);
      }
    }
  };

  const handleUploadAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadMessage(null);

    try {
      const apiUrl = getApiUrl();
      
      // Upload image if file selected
      let imageUrl = form.image || '';
      if (imageFile) {
        imageUrl = await uploadImageFile(imageFile, false) || imageUrl;
      }
      
      const { banner, ...formData } = form;
      const submitData = { ...formData, image: imageUrl };
      

      
      const response = await fetch(`${apiUrl}/admin/anime`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUploadMessage({ type: 'error', text: errorData.msg || 'Failed to upload truyện' });
        return;
      }

      const data = await response.json();

      if (data.success) {
        const animeId = data.data?.id || data.id;
        setLastCreatedAnimeId(animeId);
        if (animeId) {
          setAnimeId(animeId.toString());
        }
        const msgText = animeId 
          ? `✅ Truyện uploaded successfully! ID: ${animeId}` 
          : '✅ Truyện uploaded successfully!';
        setUploadMessage({ 
          type: 'success', 
          text: msgText
        });
        setForm({
          title: '',
          description: '',
          image: '',
          banner: '',
          type: 'TV',
          status: 'Ongoing',
          category: '',
          rating: 0,
          episodeCount: 0,
          currentEpisode: 0,
          isPublished: true,
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        setUploadMessage({ type: 'error', text: data.error || 'Failed to upload truyện' });
      }
    } catch (err) {
      console.error('Error uploading truyện:', err);
      setUploadMessage({ type: 'error', text: 'Error uploading truyện' });
    } finally {
      setUploading(false);
    }
  };

  const handleChapterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setChapterFile(file);
    } else {
      setChapterResult({
        success: false,
        error: 'Please select a valid ZIP file'
      });
    }
  };

  const fetchMyStories = async () => {
    try {
      setMyStoriesLoading(true);
      setMyStoriesError(null);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/admin/animes/mine`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const err = await response.json();
        setMyStoriesError(err.msg || err.error || 'Failed to load stories');
        return;
      }

      const data = await response.json();
      if (data.success) {
        // Fix image URLs: prepend API base URL if they start with /uploads/
        const storiesWithFixedImages = data.data.animes?.map((story: any) => ({
          ...story,
          image: story.image && story.image.startsWith('/uploads/') 
            ? `${apiUrl.replace('/admin', '')}${story.image}` 
            : story.image
        })) || [];
        
        setMyStories(storiesWithFixedImages);
      } else {
        setMyStoriesError(data.error || 'Failed to load stories');
      }
    } catch (err) {
      setMyStoriesError('Error loading my stories');
    } finally {
      setMyStoriesLoading(false);
    }
  };

  // Start editing a story inline
  const startEdit = (story: any) => {
    setEditingId(story.id);
    setEditingForm({ title: story.title || '', description: story.description || '', image: story.image || '' });
    setEditingError(null);
    setEditingImageFile(null);
    setEditingImagePreview(story.image ? story.image : null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingForm({ title: '', description: '' });
    setEditingError(null);
    setEditingImageFile(null);
    setEditingImagePreview(null);
  };

  const handleEditingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as any;
    setEditingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file: MIME type hoặc extension
    const isImageByType = file.type.startsWith('image/');
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const isImageByExt = fileExt && validExtensions.includes(fileExt);
    
    if (isImageByType || isImageByExt) {
      setEditingImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert(`❌ File type không hỗ trợ! Chỉ chấp nhận: ${validExtensions.join(', ').toUpperCase()}`);
    }
  };

  const submitEdit = async () => {
    if (!editingId) return;
    setEditingSaving(true);
    setEditingError(null);
    try {
      const apiUrl = getApiUrl();
      
      // Upload image if file selected
      let imageUrl = editingForm.image || undefined;
      if (editingImageFile) {
        imageUrl = await uploadImageFile(editingImageFile, true) || editingForm.image;
      }

      const submitData: any = { title: editingForm.title, description: editingForm.description };
      if (imageUrl) {
        submitData.image = imageUrl;
      }

      const response = await fetch(`${apiUrl}/admin/anime/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const err = await response.json();
        setEditingError(err.msg || err.error || 'Failed to update strory');
        return;
      }

      const data = await response.json();
      if (data.success) {
        await fetchMyStories();
        cancelEdit();
      } else {
        setEditingError(data.error || 'Failed to update truyện');
      }
    } catch (err) {
      console.error('Error updating truyện', err);
      setEditingError('Error updating truyện');
    } finally {
      setEditingSaving(false);
    }
  };

  const deleteStory = async (storyId: number) => {
    if (!window.confirm('Are you sure you want to delete this truyện? This will remove all chapters.')) return;
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/admin/anime/${storyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.msg || err.error || 'Failed to delete truyện');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setMyStories(myStories.filter(s => s.id !== storyId));
      } else {
        alert(data.error || 'Failed to delete truyện');
      }
    } catch (err) {
      console.error('Error deleting story', err);
      alert('Error deleting truyện');
    }
  };

  const handleUploadChapters = async () => {
    if (!chapterFile || !animeId) {
      setChapterResult({
        success: false,
        error: 'Please select a ZIP file and enter Truyện ID'
      });
      return;
    }

    setUploading(true);
    setChapterResult(null);

    const formData = new FormData();
    formData.append('file', chapterFile);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(
        `${apiUrl}/admin/anime/${animeId}/upload-chapters-zip`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      const data: ChapterUploadResult = await response.json();
      setChapterResult(data);

      if (data.success) {
        setChapterFile(null);
        const fileInput = document.getElementById('chapterFileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      console.error('Error uploading chapters:', err);
      setChapterResult({
        success: false,
        error: 'Error uploading chapters'
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-yellow-500" size={32} />
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">Quản lý người dùng và upload truyện & chương</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-yellow-500 border-yellow-500'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('upload-anime')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'upload-anime'
                ? 'text-yellow-500 border-yellow-500'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <Plus size={18} />
            Upload Truyện & Chương
          </button>

          <button
            onClick={() => { setActiveTab('my-stories'); fetchMyStories(); }}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'my-stories'
                ? 'text-yellow-500 border-yellow-500'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            <CheckCircle size={18} />
            Truyện đã upload
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-800/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Username</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">{user.username}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as 'admin' | 'user')}
                            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 hover:border-yellow-500"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded text-sm font-semibold ${
                            user.is_active
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}>
                            {user.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => toggleUserStatus(user.id, user.is_active)}
                            className={`p-2 rounded transition-colors ${
                              user.is_active
                                ? 'bg-red-900/30 hover:bg-red-900 text-red-400'
                                : 'bg-green-900/30 hover:bg-green-900 text-green-400'
                            }`}
                            title={user.is_active ? 'Disable user' : 'Enable user'}
                          >
                            {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Upload Anime & Chapters Tab */}
        {activeTab === 'upload-anime' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            {uploadMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                uploadMessage.type === 'success'
                  ? 'bg-green-900/20 border border-green-500 text-green-400'
                  : 'bg-red-900/20 border border-red-500 text-red-400'
              }`}>
                {uploadMessage.text}
              </div>
            )}

            <div className="space-y-8">
              {/* Anime Form Section */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Upload Truyện</h2>
                <form onSubmit={handleUploadAnime} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                      placeholder="Tiêu đề truyện"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      required
                      rows={4}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                      placeholder="Mô tả truyện"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Upload Image </label>
                    <div className="flex gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={imageUploading}
                        className="flex-1 bg-gray-800 text-gray-400 px-4 py-2 rounded-lg border border-gray-700 hover:border-yellow-500 cursor-pointer"
                      />
                      {imageUploading && <span className="text-yellow-500">Uploading...</span>}
                    </div>
                    {imagePreview && (
                      <div className="mt-3">
                        <img src={imagePreview} alt="Preview" className="w-32 h-48 object-cover rounded border border-gray-700" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Type</label>
                      <select
                        name="type"
                        value={form.type}
                        onChange={handleFormChange}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                      >
                        <option value="TV">TV</option>
                        <option value="Movie">Movie</option>
                        <option value="OVA">OVA</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Status</label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleFormChange}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleFormChange}
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                        placeholder="Action, Drama, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Rating</label>
                      <input
                        type="number"
                        name="rating"
                        value={form.rating || 0}
                        onChange={handleFormChange}
                        step="0.1"
                        min="0"
                        max="10"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Total Episodes</label>
                      <input
                        type="number"
                        name="episodeCount"
                        value={form.episodeCount || 0}
                        onChange={handleFormChange}
                        min="0"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Current Episode</label>
                      <input
                        type="number"
                        name="currentEpisode"
                        value={form.currentEpisode || 0}
                        onChange={handleFormChange}
                        min="0"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isPublished"
                        id="isPublished"
                        checked={form.isPublished}
                        onChange={handleFormChange}
                        className="w-5 h-5 rounded bg-gray-800 border-gray-700 cursor-pointer"
                      />
                      <label htmlFor="isPublished" className="text-blue-300 cursor-pointer flex-1">
                        ✅ Publish immediately (để truyện hiển thị trong search) 
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {uploading ? 'Uploading...' : <><Plus size={20} /> Upload Truyện</>}
                  </button>
                </form>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700"></div>

              {/* Chapters Section */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Upload Chapters from ZIP</h2>

                {chapterResult && (
                  <div className={`mb-6 p-6 rounded-lg border ${
                    chapterResult.success
                      ? 'bg-green-900/20 border-green-500'
                      : 'bg-red-900/20 border-red-500'
                  }`}>
                    <div className="flex gap-3 mb-4">
                      {chapterResult.success ? (
                        <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
                      ) : (
                        <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
                      )}
                      <div>
                        <h3 className={`font-bold ${
                          chapterResult.success ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {chapterResult.message || chapterResult.error}
                        </h3>
                      </div>
                    </div>

                    {chapterResult.chapters_created && (
                      <div className="bg-gray-800 rounded p-4 mb-4">
                        <p className="text-white font-semibold mb-3">
                          📚 {chapterResult.total_chapters} chapters uploaded:
                        </p>
                        <div className="space-y-2">
                          {chapterResult.chapters_created.map((ch, idx) => (
                            <div key={idx} className="text-gray-300 text-sm">
                              • Chapter {ch.chapter}: {ch.pages} pages
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {chapterResult.errors && chapterResult.errors.length > 0 && (
                      <div className="bg-red-900/30 rounded p-4">
                        <p className="text-red-300 font-semibold mb-2">⚠️ Warnings:</p>
                        <ul className="text-red-200 text-sm space-y-1">
                          {chapterResult.errors.slice(0, 5).map((err, idx) => (
                            <li key={idx}>• {err}</li>
                          ))}
                          {chapterResult.errors.length > 5 && (
                            <li>... and {chapterResult.errors.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Mã Truyện (ID) *</label>
                    <input
                      type="number"
                      value={animeId}
                      onChange={(e) => setAnimeId(e.target.value)}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                      placeholder="Mã truyện (ID)"
                    />
                    {lastCreatedAnimeId && !animeId && (
                      <p className="mt-2 text-green-400 text-sm">💡 Vừa tạo truyện ID: {lastCreatedAnimeId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Select ZIP File *</label>
                    <input
                      id="chapterFileInput"
                      type="file"
                      accept=".zip"
                      onChange={handleChapterFileChange}
                      className="w-full bg-gray-800 text-gray-400 px-4 py-3 rounded-lg border-2 border-dashed border-gray-700 hover:border-yellow-500 cursor-pointer"
                    />
                    {chapterFile && (
                      <p className="mt-2 text-green-400 text-sm">✓ {chapterFile.name}</p>
                    )}
                    <p className="mt-3 text-gray-400 text-sm">
                      <strong>ZIP Structure:</strong> a/, b/, c/ or chapter-1/, chapter-2/...<br/>
                      Each folder should contain images: 1.jpg, 2.jpg, etc.
                    </p>
                  </div>

                  <button
                    onClick={handleUploadChapters}
                    disabled={uploading || !chapterFile || !animeId}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-black font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {uploading ? 'Uploading...' : <><Upload size={20} /> Upload Chương</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Stories Tab */}
        {activeTab === 'my-stories' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Truyện đã upload</h2>
              <button onClick={fetchMyStories} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded">Refresh</button>
            </div>

            {myStoriesLoading ? (
              <div className="p-8 text-gray-400">Loading your stories...</div>
            ) : myStoriesError ? (
              <div className="p-6 text-red-400">{myStoriesError}</div>
            ) : myStories.length === 0 ? (
              <div className="p-6 text-gray-400">You have not uploaded any stories yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-800/50">
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">ID</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Tiêu đề</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Trạng thái</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myStories.map((s) => (
                      <React.Fragment key={s.id}>
                        <tr className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="px-4 py-3 text-gray-300">{s.id}</td>
                          <td className="px-4 py-3">
                            <div className="text-white font-semibold">{s.title}</div>
                            <div className="text-gray-400 text-sm">{s.slug}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-300">{s.status}</td>
                          <td className="px-4 py-3 flex gap-2">
                            <button onClick={() => startEdit(s)} className="px-3 py-1 bg-yellow-600 text-black rounded">Chỉnh sửa</button>
                            <button onClick={() => { setAnimeId(s.id.toString()); setActiveTab('upload-anime'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-3 py-1 bg-blue-600 text-white rounded">Upload Chương</button>
                            <button onClick={() => deleteStory(s.id)} className="px-3 py-1 bg-red-700 text-white rounded">Delete</button>
                          </td>
                        </tr>

                        {editingId === s.id && (
                          <tr key={`edit-${s.id}`} className="bg-gray-800">
                            <td colSpan={4} className="p-4">
                              <div className="grid gap-3">
                                <input
                                  name="title"
                                  value={editingForm.title}
                                  onChange={handleEditingChange}
                                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                                  placeholder="Tiêu đề truyện"
                                />
                                <textarea
                                  name="description"
                                  value={editingForm.description}
                                  onChange={handleEditingChange}
                                  rows={4}
                                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                                  placeholder="Mô tả truyện"
                                />

                                <div>
                                  <label className="block text-gray-300 text-sm font-semibold mb-2">Ảnh Bìa</label>
                                  <div className="flex gap-3">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleEditingImageChange}
                                      disabled={editingImageUploading}
                                      className="flex-1 bg-gray-700 text-gray-400 px-3 py-2 rounded border border-gray-600 hover:border-yellow-500 cursor-pointer text-sm"
                                    />
                                    {editingImageUploading && <span className="text-yellow-500 text-sm">Uploading...</span>}
                                  </div>
                                  {editingImagePreview && (
                                    <div className="mt-2">
                                      <img src={editingImagePreview} alt="Preview" className="w-24 h-32 object-cover rounded border border-gray-600" />
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2 mt-2">
                                  <button onClick={submitEdit} disabled={editingSaving || editingImageUploading} className="px-3 py-1 bg-yellow-600 text-black rounded">
                                    {editingSaving ? 'Saving...' : 'Lưu'}
                                  </button>
                                  <button onClick={cancelEdit} className="px-3 py-1 bg-gray-700 text-white rounded">Hủy</button>
                                </div>

                                {editingError && <div className="text-red-400 mt-2">{editingError}</div>}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}