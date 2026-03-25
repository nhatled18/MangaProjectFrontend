import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { adminService } from '../../services/adminService';

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

interface AnimeUploadProps {
  token: string | null;
}

export function AnimeUpload({ token }: AnimeUploadProps) {
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

  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [lastCreatedAnimeId, setLastCreatedAnimeId] = useState<number | null>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const [uploadChapterType, setUploadChapterType] = useState<'zip' | 'images'>('zip');
  const [chapterFile, setChapterFile] = useState<File | null>(null);
  const [chapterImages, setChapterImages] = useState<File[]>([]);
  const [chapterNumberUpload, setChapterNumberUpload] = useState<string>('');
  const [chapterTitleUpload, setChapterTitleUpload] = useState<string>('');
  const [animeId, setAnimeId] = useState<string>('');
  const [chapterResult, setChapterResult] = useState<ChapterUploadResult | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as any;
    const { name, type, value } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (target as HTMLInputElement).checked :
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
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const isImageByExt = fileExt && validExtensions.includes(fileExt);

    if (isImageByExt) {
      setImageFile(file);
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

  const handleUploadAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setUploading(true);
    setUploadMessage(null);

    try {
      let imageUrl = form.image || '';
      if (imageFile) {
        setImageUploading(true);
        try {
          const imgData = await adminService.uploadImage(token, imageFile);
          if (imgData.success) imageUrl = imgData.image_url;
        } catch (err: any) {
          alert('Failed to upload image: ' + err.message);
        } finally {
          setImageUploading(false);
        }
      }

      const { banner, ...formData } = form;
      const submitData = { ...formData, image: imageUrl };

      const data = await adminService.createAnime(token, submitData);

      if (data.success) {
        const id = data.data?.id || data.id;
        setLastCreatedAnimeId(id);
        if (id) setAnimeId(id.toString());
        setUploadMessage({
          type: 'success',
          text: id ? `✅ Truyện uploaded successfully! ID: ${id}` : '✅ Truyện uploaded successfully!'
        });
        setForm({
          title: '', description: '', image: '', banner: '', type: 'TV',
          status: 'Ongoing', category: '', rating: 0, episodeCount: 0,
          currentEpisode: 0, isPublished: true,
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        setUploadMessage({ type: 'error', text: data.error || 'Failed to upload truyện' });
      }
    } catch (err: any) {
      setUploadMessage({ type: 'error', text: err.message || 'Error uploading truyện' });
    } finally {
      setUploading(false);
    }
  };

  const handleChapterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.zip')) {
      setChapterFile(file);
    } else {
      setChapterResult({ success: false, error: 'Please select a valid ZIP file' });
    }
  };

  const handleUploadChapters = async () => {
    if (!token || !chapterFile || !animeId) {
      setChapterResult({ success: false, error: 'Please select a ZIP file and enter Truyện ID' });
      return;
    }
    setUploading(true);
    setChapterResult(null);

    const formData = new FormData();
    formData.append('file', chapterFile);
    formData.append('chapter_title', chapterTitleUpload);

    try {
      const data = await adminService.uploadChaptersZip(token, animeId, formData) as ChapterUploadResult;
      setChapterResult(data);
      if (data.success) {
        setChapterFile(null);
        setChapterTitleUpload('');
        const fileInput = document.getElementById('chapterFileInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (err: any) {
      setChapterResult({ success: false, error: err.message || 'Error uploading chapters' });
    } finally {
      setUploading(false);
    }
  };

  const handleChapterImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setChapterImages(Array.from(e.target.files));
    }
  };

  const handleUploadChapterImages = async () => {
    if (!token || !animeId || !chapterNumberUpload || chapterImages.length === 0) {
      setChapterResult({ success: false, error: 'Vui lòng nhập ID Truyện, Số Chapter và chọn ảnh.' });
      return;
    }
    setUploading(true);
    setChapterResult(null);

    const formData = new FormData();
    formData.append('chapter_number', chapterNumberUpload);
    formData.append('chapter_title', chapterTitleUpload);
    chapterImages.forEach(file => {
      formData.append('files', file);
    });

    try {
      const data = await adminService.uploadChapterImages(token, animeId, formData) as ChapterUploadResult;
      setChapterResult(data);
      if (data.success) {
        setChapterImages([]);
        setChapterNumberUpload('');
        setChapterTitleUpload('');
        const fileInput = document.getElementById('chapterImagesInput') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (err: any) {
      setChapterResult({ success: false, error: err.message || 'Lỗi khi upload ảnh.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
      {uploadMessage && (
        <div className={`mb-6 p-4 rounded-lg ${uploadMessage.type === 'success'
            ? 'bg-green-900/20 border border-green-500 text-green-400'
            : 'bg-red-900/20 border border-red-500 text-red-400'
          }`}>
          {uploadMessage.text}
        </div>
      )}

      <div className="space-y-8">
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
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                >
                  <option value="TV">Manga</option>
                  <option value="Movie">Manhwa</option>
                  <option value="OVA">Comic</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                >
                  <option value="Ongoing">Đang tiến hành</option>
                  <option value="Completed">Hoàn thành</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Category (Comma separated)</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                  placeholder="Action, Romance..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || imageUploading}
              className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Đang tải lên...' : 'Thêm Truyện Mới'}
            </button>
          </form>
        </div>

        <hr className="border-gray-800" />

        <div>
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 md:mb-0">Upload Các Chương (Truyện tranh)</h2>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setUploadChapterType('zip')}
                   className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${uploadChapterType === 'zip' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                 >
                   Upload File ZIP
                 </button>
                 <button 
                   onClick={() => setUploadChapterType('images')}
                   className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${uploadChapterType === 'images' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                 >
                   Upload Nhiều Ảnh
                 </button>
              </div>
           </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Truyện ID *</label>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  value={animeId}
                  onChange={(e) => setAnimeId(e.target.value)}
                  placeholder="Nhập ID Truyện"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                />
                {lastCreatedAnimeId && (
                  <button
                    onClick={() => setAnimeId(lastCreatedAnimeId.toString())}
                    className="whitespace-nowrap bg-gray-800 text-yellow-500 px-4 py-2 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors text-sm"
                  >
                    Use Last ID ({lastCreatedAnimeId})
                  </button>
                )}
              </div>
            </div>

            {uploadChapterType === 'zip' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg text-sm text-gray-400 border border-gray-700">
                  <p className="font-semibold text-yellow-500 mb-2">Hướng dẫn cấu trúc file ZIP:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Tên folder bên trong thư mục ZIP nên là số thứ tự chapter (VD: 1, 2, 3...) hoặc "Chapter 1".</li>
                    <li>Trong mỗi folder chứa các ảnh trang (VD: 1.jpg, 2.jpg...).</li>
                    <li>Tool sẽ bung nén và tự động tạo chapter tương ứng với folder.</li>
                  </ul>
                </div>
                <div>
                   <label className="block text-gray-300 text-sm font-semibold mb-2">Tên cho Chapter tải lên (Tuỳ chọn)</label>
                   <input
                    type="text"
                    value={chapterTitleUpload}
                    onChange={(e) => setChapterTitleUpload(e.target.value)}
                    placeholder="VD: Khởi đầu mới"
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                   />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Select ZIP File *</label>
                  <label className="flex w-full cursor-pointer appearance-none items-center justify-center rounded-lg border-2 border-dashed border-gray-700 p-6 transition-all hover:border-yellow-500 bg-gray-800/50">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="text-gray-400">
                        <span className="text-yellow-500 font-semibold text-sm cursor-pointer border-b border-yellow-500/50 hover:border-yellow-500 mr-1">Tải file</span>
                        <span className="text-xs">hoặc kéo thả vào đây</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Chỉ hỗ trợ file .zip chứa folder các chương</p>
                    </div>
                    <input id="chapterFileInput" type="file" accept=".zip" className="sr-only" onChange={handleChapterFileChange} />
                  </label>
                  {chapterFile && (
                    <div className="mt-2 text-sm text-yellow-500 flex items-center justify-between bg-yellow-500/10 p-2 rounded">
                      <span className="truncate max-w-[80%]">File đã chọn: {chapterFile.name} ({(chapterFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button onClick={() => setChapterFile(null)} className="text-red-400 hover:text-red-300 ml-2">Huỷ</button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleUploadChapters}
                  disabled={uploading || !chapterFile || !animeId}
                  className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload size={20} />
                  {uploading ? 'Đang xử lý ZIP...' : 'Upload & Giải nén ZIP'}
                </button>
              </div>
            )}

            {uploadChapterType === 'images' && (
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Số Chapter *</label>
                      <input
                        type="text"
                        value={chapterNumberUpload}
                        onChange={(e) => setChapterNumberUpload(e.target.value)}
                        placeholder="VD: 1, 1.5, 2..."
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Tiêu đề (Tùy chọn)</label>
                      <input
                        type="text"
                        value={chapterTitleUpload}
                        onChange={(e) => setChapterTitleUpload(e.target.value)}
                        placeholder="Tên chương"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Chọn các ảnh trang *</label>
                    <input
                      id="chapterImagesInput"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleChapterImagesChange}
                      className="w-full bg-gray-800 text-gray-400 px-4 py-2 rounded-lg border border-gray-700"
                    />
                    {chapterImages.length > 0 && (
                      <p className="mt-2 text-sm text-yellow-500">Đã chọn {chapterImages.length} ảnh trang</p>
                    )}
                 </div>

                 <button
                    onClick={handleUploadChapterImages}
                    disabled={uploading || chapterImages.length === 0 || !animeId || !chapterNumberUpload}
                    className="w-full bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Upload size={20} />
                    {uploading ? 'Đang upload ảnh...' : 'Upload Ảnh Chương'}
                  </button>
              </div>
            )}

            {/* Error or Success Results */}
            {chapterResult && (
              <div className={`p-6 rounded-lg border ${chapterResult.success ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                <h3 className={`text-lg font-bold mb-2 ${chapterResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {chapterResult.success ? '✅ ' : '❌ '}
                  {chapterResult.success ? 'Upload Thành Công' : 'Upload Thất Bại'}
                </h3>
                
                {chapterResult.message && <p className="text-gray-300 mb-2">{chapterResult.message}</p>}
                {chapterResult.error && <p className="text-red-400 mb-2">{chapterResult.error}</p>}
                
                {chapterResult.total_chapters !== undefined && (
                  <p className="text-gray-400 mt-2">Tổng số chương tìm thấy: <span className="text-white font-bold">{chapterResult.total_chapters}</span></p>
                )}
                
                {chapterResult.chapters_created && chapterResult.chapters_created.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-300 mb-2 border-b border-gray-700 pb-2">Danh sách chương đã tạo:</p>
                    <ul className="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {chapterResult.chapters_created.map((ch, idx) => (
                        <li key={idx} className="bg-gray-800/80 p-2 text-sm rounded flex justify-between">
                          <span className="text-yellow-500 font-medium">Chương {ch.chapter} {ch.title ? `- ${ch.title}` : ''}</span>
                          <span className="text-gray-400">{ch.pages} trang</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {chapterResult.errors && chapterResult.errors.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-red-400 mb-2">Chi tiết lỗi:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                      {chapterResult.errors.map((err, idx) => (
                        <li key={idx} className="bg-red-900/20 p-1 rounded">{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
