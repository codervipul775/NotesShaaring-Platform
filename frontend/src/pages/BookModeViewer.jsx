import React, { useEffect, useState, useRef } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import HTMLFlipBook from 'react-pageflip';
import { Howl } from 'howler';
import { X, Bookmark, CornerDownLeft, ChevronLeft, ChevronRight } from 'lucide-react';
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const BookModeViewer = ({ fileUrl, onClose }) => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [jumpTo, setJumpTo] = useState('');
  const [savedPages, setSavedPages] = useState([]);
  const bookRef = useRef(null);

  const flipSound = new Howl({ src: ['/flip.mp3'] });

  useEffect(() => {
    const loadPdf = async () => {
      const loadingTask = getDocument(fileUrl);
      const pdf = await loadingTask.promise;

      const canvasPages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        await page.render({ canvasContext: context, viewport }).promise;

        canvasPages.push(canvas.toDataURL());
      }

      setPages(canvasPages);
    };

    loadPdf();
  }, [fileUrl]);

  const handleFlip = (e) => {
    setCurrentPage(e.data);
    flipSound.play();
  };

  const handleJump = () => {
    const page = parseInt(jumpTo);
    if (!isNaN(page) && page >= 1 && page <= pages.length) {
      bookRef.current.pageFlip().flip(page - 1);
    }
  };

  const toggleMarkPage = () => {
    if (savedPages.includes(currentPage)) {
      setSavedPages(savedPages.filter((p) => p !== currentPage));
    } else {
      setSavedPages([...savedPages, currentPage]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 text-xl z-50"
        >
          <X />
        </button>
        <div className="flex-grow flex items-center justify-center">
          {pages.length > 0 ? (
            <HTMLFlipBook
              ref={bookRef}
              width={550}
              height={750}
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1536}
              drawShadow
              flippingTime={500}
              maxShadowOpacity={0.5}
              showCover={false}
              mobileScrollSupport
              onFlip={handleFlip}
              className="mx-auto"
            >
              {pages.map((src, idx) => (
                <div key={idx} className="page bg-white relative">
                  <img
                    src={src}
                    alt={`Page ${idx + 1}`}
                    className={`w-full h-full object-contain ${
                      currentPage === idx ? 'ring-4 ring-green-500' : ''
                    }`}
                  />
                  {savedPages.includes(idx) && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 text-xs rounded shadow">
                      Marked
                    </div>
                  )}
                </div>
              ))}
            </HTMLFlipBook>
          ) : (
            <div className="text-gray-500">Loading PDF...</div>
          )}
        </div>
<div className="bg-gray-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t relative">
  <div className="flex items-center gap-4">
    <span className="text-gray-700 font-medium">
      Page {currentPage + 1} / {pages.length}
    </span>
    <button
      onClick={toggleMarkPage}
      className={`flex items-center gap-1 px-3 py-1 text-sm ${
        savedPages.includes(currentPage)
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-yellow-500 hover:bg-yellow-600'
      } text-white rounded transition`}
    >
      <Bookmark className="w-4 h-4" />
      {savedPages.includes(currentPage) ? 'Unmark' : 'Mark Page'}
    </button>
  </div>
  <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-6 z-10">
    <button
      onClick={() => bookRef.current?.pageFlip().flipPrev()}
      className="p-2 bg-gray-800 hover:bg-gray-600 text-white rounded-full shadow"
      aria-label="Previous Page"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
    <button
      onClick={() => bookRef.current?.pageFlip().flipNext()}
      className="p-2 bg-gray-800 hover:bg-gray-600 text-white rounded-full shadow"
      aria-label="Next Page"
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  </div>
  <div className="flex items-center gap-3">
    <input
      type="number"
      min="1"
      max={pages.length}
      value={jumpTo}
      onChange={(e) => setJumpTo(e.target.value)}
      placeholder="Go to page..."
      className="px-3 py-2 border rounded w-32 focus:ring focus:outline-none text-black"
    />
    <button
      onClick={handleJump}
      className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      <CornerDownLeft className="w-4 h-4" /> Jump
    </button>
    {savedPages.length > 0 && (
      <>
        <label className="text-gray-700 text-sm font-medium">Go to marked:</label>
        <select
          onChange={(e) => {
            const page = parseInt(e.target.value, 10);
            if (!isNaN(page)) {
              bookRef.current?.pageFlip().flip(page);
            }
          }}
          className="px-3 py-2 border text-black rounded focus:ring focus:outline-none text-sm"
        >
          <option value="">Select</option>
          {savedPages.map((pageNum) => (
            <option key={pageNum} value={pageNum}>
              Page {pageNum + 1}
            </option>
          ))}
        </select>
      </>
    )}
  </div>
</div>


      </div>
    </div>
  );
};

export default BookModeViewer;
