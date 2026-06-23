import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MediaLightbox({ items, isOpen, onClose, initialIndex = 0, currentIndex, setCurrentIndex }) {
  const index = currentIndex ?? initialIndex;

  const goNext = useCallback(() => {
    setCurrentIndex?.((prev) => (prev + 1) % items.length);
  }, [items.length, setCurrentIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex?.((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length, setCurrentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goNext, goPrev]);

  if (!items || items.length === 0) return null;

  const currentItem = items[index];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/95 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-dark-400/80 text-white hover:bg-dark-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Navigation */}
          {items.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-6 z-10 p-4 rounded-full bg-dark-400/80 text-white hover:bg-dark-400 transition-colors"
              >
                <ChevronLeft className="w-8 h-8" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-6 z-10 p-4 rounded-full bg-dark-400/80 text-white hover:bg-dark-400 transition-colors"
              >
                <ChevronRight className="w-8 h-8" />
              </motion.button>
            </>
          )}

          {/* Media Content */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem?.type === 'image' || currentItem?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={currentItem.url || currentItem}
                alt={`Media ${index + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            ) : currentItem?.type === 'video' || currentItem?.url?.match(/\.(mp4|mov|webm)$/i) ? (
              <video
                src={currentItem.url || currentItem}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-lg"
              />
            ) : (
              <img
                src={currentItem.url || currentItem}
                alt={`Media ${index + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            )}
          </motion.div>

          {/* Counter */}
          <div className="absolute top-6 left-6 px-3 py-1.5 rounded-lg bg-dark-400/80 text-white text-sm font-medium">
            {index + 1} / {items.length}
          </div>

          {/* Thumbnails */}
          {items.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-xl bg-dark-400/80 backdrop-blur-sm max-w-[90vw] overflow-x-auto"
            >
              {items.map((item, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex?.(i); }}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 transition-all ${
                    i === index ? 'ring-2 ring-primary scale-105' : 'opacity-50 hover:opacity-75'
                  }`}
                >
                  <img
                    src={item.url || item}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
