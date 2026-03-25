import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chapter } from '@/hooks/useChapterViewer';

interface ChapterNavBarProps {
  animeId: string | undefined;
  chapters: Chapter[];
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}

export function ChapterNavBar({ animeId, chapters, prevChapter, nextChapter }: ChapterNavBarProps) {
  const navigate = useNavigate();

  const goTo = (chapter: Chapter) =>
    navigate(`/chapter/${animeId}/${encodeURIComponent(chapter.id)}`, { state: { chapters } });

  return (
    <div className="flex flex-wrap gap-2 md:gap-4">
      {prevChapter && (
        <button
          onClick={() => goTo(prevChapter)}
          className="flex items-center gap-1 md:gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 md:px-4 py-2 rounded text-sm md:text-base transition-colors"
        >
          <ChevronLeft size={18} />
          <span className="hidden xs:inline">Chương</span> {prevChapter.chapterNumber}
        </button>
      )}
      {nextChapter && (
        <button
          onClick={() => goTo(nextChapter)}
          className="flex items-center gap-1 md:gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-3 md:px-4 py-2 rounded font-bold ml-auto text-sm md:text-base transition-colors"
        >
          <span className="hidden xs:inline">Chương</span> {nextChapter.chapterNumber}
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
