import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getFullImageUrl } from '../../utils/image';
import { adminService } from '../../services/adminService';
import { Pagination } from '../Pagination';

// ── Types ──────────────────────────────────────────────────────────────────
interface Story {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  status: string;
}

interface StoryChapter {
  id: number;
  chapter_number: number;
  title: string;
}

interface ChapterPage {
  id: number;
  pageNumber: number;
  imageUrl: string;
}

interface AnimeManagementProps {
  token: string | null;
  onNavigateToUpload: () => void;
}

export function AnimeManagement({ token, onNavigateToUpload }: AnimeManagementProps) {
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [myStoriesLoading, setMyStoriesLoading] = useState(false);
  const [myStoriesError, setMyStoriesError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Inline editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingForm, setEditingForm] = useState<{ title: string; description: string; image?: string }>({ title: '', description: '' });
  const [editingError, setEditingError] = useState<string | null>(null);
  const [editingSaving, setEditingSaving] = useState(false);
  const [editingImageFile, setEditingImageFile] = useState<File | null>(null);
  const [editingImagePreview, setEditingImagePreview] = useState<string | null>(null);
  const [editingImageUploading, setEditingImageUploading] = useState(false);

  // Chapter management state
  const [managingStoryId, setManagingStoryId] = useState<number | null>(null);
  const [storyChapters, setStoryChapters] = useState<StoryChapter[]>([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);

  // Chapter editing
  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [editingChapterForm, setEditingChapterForm] = useState({ chapter_number: '', chapter_title: '' });
  const [editingChapterFiles, setEditingChapterFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Page management state
  const [managingPagesChapterId, setManagingPagesChapterId] = useState<number | null>(null);
  const [chapterPages, setChapterPages] = useState<ChapterPage[]>([]);
  const [pagesLoading, setPagesLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchMyStories(currentPage);
    }
  }, [token, currentPage]);

  const uploadImageFile = async (file: File): Promise<string | null> => {
    if (!token) return null;
    try {
      setEditingImageUploading(true);
      const data = await adminService.uploadImage(token, file);
      if (data.success) return data.image_url;
      alert(data.error || 'Failed to upload image');
      return null;
    } catch (err) {
      alert('Error uploading image: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return null;
    } finally {
      setEditingImageUploading(false);
    }
  };

  const fetchMyStories = async (page: number = 1) => {
    if (!token) return;
    try {
      setMyStoriesLoading(true);
      setMyStoriesError(null);
      const data = await adminService.getMyAnimes(token, page);
      if (data.success) {
        const storiesWithFixedImages: Story[] = (data.data.animes ?? []).map((story: Story) => ({
          ...story,
          image: getFullImageUrl(story.image),
        }));
        setMyStories(storiesWithFixedImages);
        setTotalPages(data.data.pages ?? 1);
        setCurrentPage(data.data.current_page ?? 1);
      } else {
        setMyStoriesError(data.error || 'Failed to load stories');
      }
    } catch (err) {
      setMyStoriesError(err instanceof Error ? err.message : 'Error loading my stories');
    } finally {
      setMyStoriesLoading(false);
    }
  };

  const startEdit = (story: Story) => {
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
    const { name, value } = e.target;
    setEditingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    if (!editingId || !token) return;
    setEditingSaving(true);
    setEditingError(null);
    try {
      let imageUrl = editingForm.image || undefined;
      if (editingImageFile) {
        imageUrl = (await uploadImageFile(editingImageFile)) || editingForm.image;
      }

      const submitData: Record<string, string | undefined> = {
        title: editingForm.title,
        description: editingForm.description,
      };
      if (imageUrl) submitData.image = imageUrl;

      const data = await adminService.updateAnime(token, editingId, submitData);
      if (data.success) {
        await fetchMyStories(currentPage);
        cancelEdit();
      } else {
        setEditingError(data.error || 'Failed to update truyện');
      }
    } catch (err) {
      setEditingError(err instanceof Error ? err.message : 'Error updating truyện');
    } finally {
      setEditingSaving(false);
    }
  };

  const deleteStory = async (storyId: number) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this truyện? This will remove all chapters.')) return;
    try {
      const data = await adminService.deleteAnime(token, storyId);
      if (data.success) {
        setMyStories(prev => prev.filter(s => s.id !== storyId));
      } else {
        alert(data.error || 'Failed to delete truyện');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting truyện');
    }
  };

  const fetchChapters = async (storyId: number) => {
    if (!token) return;
    try {
      setChaptersLoading(true);
      const data = await adminService.getChapters(token, storyId);
      if (data.success) setStoryChapters(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setChaptersLoading(false);
    }
  };

  const openChapterManager = (storyId: number) => {
    setManagingStoryId(storyId);
    fetchChapters(storyId);
  };

  const closeChapterManager = () => {
    setManagingStoryId(null);
    setStoryChapters([]);
  };

  const handleDeleteChapter = async (chapterId: number) => {
    if (!token) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa chapter này không?')) return;
    try {
      const data = await adminService.deleteChapter(token, chapterId);
      if (data.success) {
        setStoryChapters(prev => prev.filter(ch => ch.id !== chapterId));
      } else {
        alert(data.error || 'Lỗi xóa chapter');
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Lỗi xóa chapter');
    }
  };

  const startEditChapter = (chapter: StoryChapter) => {
    setEditingChapterId(chapter.id);
    setEditingChapterForm({
      chapter_number: chapter.chapter_number.toString(),
      chapter_title: chapter.title || '',
    });
    setEditingChapterFiles([]);
  };

  const cancelEditChapter = () => {
    setEditingChapterId(null);
    setEditingChapterFiles([]);
  };

  const handleUpdateChapter = async (chapterId: number) => {
    if (!token) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('chapter_number', editingChapterForm.chapter_number);
    formData.append('chapter_title', editingChapterForm.chapter_title);
    editingChapterFiles.forEach(file => formData.append('files', file));

    try {
      const data = await adminService.updateChapter(token, chapterId, formData);
      if (data.success) {
        alert('Cập nhật chapter thành công!');
        cancelEditChapter();
        if (managingStoryId) fetchChapters(managingStoryId);
      } else {
        alert(data.error || 'Lỗi cập nhật chapter');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi cập nhật chapter');
    } finally {
      setUploading(false);
    }
  };

  const fetchChapterPages = async (chapterId: number) => {
    if (!token) return;
    try {
      setPagesLoading(true);
      const data = await adminService.getPages(token, chapterId);
      if (data.success) setChapterPages(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setPagesLoading(false);
    }
  };

  const handleDeletePage = async (pageId: number) => {
    if (!token) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa trang này? Các trang sau sẽ tự động lùi số thứ tự.')) return;
    try {
      const data = await adminService.deletePage(token, pageId);
      if (data.success) {
        if (managingPagesChapterId) fetchChapterPages(managingPagesChapterId);
      } else {
        alert(data.error || 'Lỗi xóa trang');
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Lỗi xóa trang');
    }
  };

  const handleUpdatePageImage = async (pageId: number, file: File) => {
    if (!token) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const data = await adminService.updatePageImage(token, pageId, formData);
      if (data.success) {
        alert('Cập nhật ảnh trang thành công!');
        if (managingPagesChapterId) fetchChapterPages(managingPagesChapterId);
      } else {
        alert(data.error || 'Lỗi cập nhật trang');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi cập nhật trang');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">Quản lý truyện</h2>
        <button onClick={() => fetchMyStories(currentPage)} className="px-2 md:px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm">Refresh</button>
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
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300 w-16">ID</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300 min-w-[200px]">Tiêu đề</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300 min-w-[120px]">Trạng thái</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300 min-w-[250px]">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {myStories.map((s) => (
                <React.Fragment key={s.id}>
                  <tr className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-gray-300 text-sm">{s.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-white font-semibold text-sm line-clamp-1">{s.title}</div>
                      <div className="text-gray-400 text-xs truncate max-w-[150px]">{s.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">{s.status}</td>
                    <td className="px-4 py-3 flex gap-2 flex-wrap">
                      <button onClick={() => startEdit(s)} className="px-2 md:px-3 py-1 bg-yellow-600 text-black rounded text-xs">Sửa</button>
                      <button onClick={() => openChapterManager(s.id)} className="px-2 md:px-3 py-1 bg-green-600 text-white rounded text-xs">Chương</button>
                      <button onClick={() => deleteStory(s.id)} className="px-2 md:px-3 py-1 bg-red-700 text-white rounded text-xs">Xóa</button>
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

                  {managingStoryId === s.id && (
                    <tr key={`manage-${s.id}`} className="bg-gray-800">
                      <td colSpan={4} className="p-2 md:p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                          <h3 className="text-md md:text-lg font-bold text-white line-clamp-1">Chapters của {s.title}</h3>
                          <button onClick={closeChapterManager} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white rounded text-xs">Đóng</button>
                        </div>
                        {chaptersLoading ? (
                          <div className="text-gray-400">Đang tải chapters...</div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {storyChapters.map(ch => (
                                <div key={ch.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                                  {editingChapterId === ch.id ? (
                                    <div className="space-y-3">
                                      <div className="grid grid-cols-2 gap-2">
                                        <input
                                          type="number"
                                          step="0.1"
                                          value={editingChapterForm.chapter_number}
                                          onChange={(e) => setEditingChapterForm({ ...editingChapterForm, chapter_number: e.target.value })}
                                          className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 text-sm"
                                          placeholder="Số Chapter"
                                        />
                                        <input
                                          type="text"
                                          value={editingChapterForm.chapter_title}
                                          onChange={(e) => setEditingChapterForm({ ...editingChapterForm, chapter_title: e.target.value })}
                                          className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 text-sm"
                                          placeholder="Tiêu đề"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400 mb-1">Thay thế toàn bộ ảnh (Tùy chọn)</label>
                                        <input
                                          type="file"
                                          accept="image/*,.zip"
                                          multiple
                                          onChange={(e) => setEditingChapterFiles(e.target.files ? Array.from(e.target.files) : [])}
                                          className="w-full bg-gray-800 text-gray-400 px-3 py-1 rounded border border-gray-600 text-xs"
                                        />
                                        {editingChapterFiles.length > 0 && (
                                          <p className="text-xs text-green-400 mt-1">✓ {editingChapterFiles.length} file được chọn</p>
                                        )}
                                      </div>
                                      <div className="flex gap-2 justify-end">
                                        <button
                                          onClick={() => handleUpdateChapter(ch.id)}
                                          disabled={uploading}
                                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded"
                                        >
                                          {uploading ? 'Đang lưu...' : 'Lưu'}
                                        </button>
                                        <button
                                          onClick={cancelEditChapter}
                                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded"
                                        >
                                          Hủy
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-between items-center">
                                      <div className="flex flex-col">
                                        <span className="text-white font-semibold text-sm">Chapter {ch.chapter_number}</span>
                                        <span className="text-gray-400 text-xs truncate max-w-[150px]">{ch.title || `Chapter ${ch.chapter_number}`}</span>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => {
                                            setManagingPagesChapterId(ch.id);
                                            fetchChapterPages(ch.id);
                                          }}
                                          className="text-green-400 hover:text-green-300 text-xs px-2 py-1 bg-green-900/30 rounded border border-green-500/30"
                                        >
                                          Xem trang
                                        </button>
                                        <button
                                          onClick={() => startEditChapter(ch)}
                                          className="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 bg-blue-900/30 rounded border border-blue-500/30"
                                        >
                                          Sửa
                                        </button>
                                        <button
                                          onClick={() => handleDeleteChapter(ch.id)}
                                          className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-900/30 rounded border border-red-500/30"
                                        >
                                          Xóa
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {storyChapters.length === 0 && <div className="col-span-full text-gray-400 py-4 text-center text-sm italic">Không có chương nào.</div>}
                            </div>

                            {/* Page Manager Section */}
                            {managingPagesChapterId && (
                              <div className="mt-8 pt-8 border-t border-gray-700">
                                <div className="flex justify-between items-center mb-6">
                                  <h3 className="text-xl font-bold text-yellow-500">Quản lý các trang của Chapter</h3>
                                  <button
                                    onClick={() => setManagingPagesChapterId(null)}
                                    className="text-gray-400 hover:text-white underline"
                                  >
                                    Đóng quản lý trang
                                  </button>
                                </div>

                                {pagesLoading ? (
                                  <div className="text-center py-8 text-gray-500 italic">Đang tải danh sách trang...</div>
                                ) : (
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {chapterPages.map((page) => (
                                      <div key={page.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col group">
                                        <div className="relative aspect-[2/3]">
                                          <img
                                            src={getFullImageUrl(page.imageUrl)}
                                            alt={`Page ${page.pageNumber}`}
                                            className="w-full h-full object-cover"
                                          />
                                          <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                                            Trang {page.pageNumber}
                                          </div>
                                        </div>
                                        <div className="p-2 flex flex-col gap-1">
                                          <label className="text-center py-1 bg-blue-600/20 text-blue-400 text-[10px] rounded border border-blue-500/30 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors font-bold">
                                            Thay ảnh
                                            <input
                                              type="file"
                                              className="hidden"
                                              accept="image/*"
                                              onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleUpdatePageImage(page.id, file);
                                              }}
                                            />
                                          </label>
                                          <button
                                            onClick={() => handleDeletePage(page.id)}
                                            className="py-1 bg-red-600/20 text-red-400 text-[10px] rounded border border-red-500/30 hover:bg-red-600 hover:text-white transition-colors font-bold"
                                          >
                                            Xóa trang
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                    {chapterPages.length === 0 && (
                                      <div className="col-span-full py-8 text-center text-gray-500 border-2 border-dashed border-gray-800 rounded-lg">
                                        Chương này chưa có trang nào.
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <button onClick={() => onNavigateToUpload()} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold flex items-center gap-2">
                            <Plus size={18} /> Thêm Chapter Mới
                          </button>
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

      {/* Pagination */}
      {totalPages > 1 && !managingStoryId && (
        <div className="mt-8 border-t border-gray-800 pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
