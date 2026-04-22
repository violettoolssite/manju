import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore, StyleOption } from '../store/useStore';
import { MOCK_STYLES } from '../utils/apiService';

export const StyleSelector: React.FC = () => {
  const { isStyleSelectorOpen, setIsStyleSelectorOpen, selectedStyle, setSelectedStyle } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const ITEMS_PER_PAGE = 4;

  useEffect(() => {
    if (isStyleSelectorOpen) {
      setCurrentPage(1);
    }
  }, [isStyleSelectorOpen]);

  const handleSelect = (style: StyleOption) => {
    setSelectedStyle(style);
    setTimeout(() => {
      setIsStyleSelectorOpen(false);
    }, 300);
  };

  const totalPages = Math.ceil(MOCK_STYLES.length / ITEMS_PER_PAGE);
  const currentStyles = MOCK_STYLES.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  return (
    <AnimatePresence>
      {isStyleSelectorOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsStyleSelectorOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <div ref={dragConstraintsRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              drag
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={dragConstraintsRef}
              dragMomentum={false}
              dragElastic={0.08}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[80vh]"
            >
            <div
              className="flex items-center justify-between mb-6 shrink-0 cursor-move select-none"
              onPointerDown={(event) => dragControls.start(event)}
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">选择视觉风格</h2>
                <p className="text-zinc-400 text-sm">为您的故事奠定全局视觉基调，后续场景将以此为基础生成。</p>
              </div>
              <button
                onClick={() => setIsStyleSelectorOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 pb-4">
              {currentStyles.map((style) => (
                <div
                  key={style.id}
                  onClick={() => handleSelect(style)}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                    selectedStyle?.id === style.id
                      ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="aspect-video w-full relative">
                    <img
                      src={style.thumbnail}
                      alt={style.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl text-white font-bold mb-2 flex items-center justify-between">
                      {style.name}
                      {selectedStyle?.id === style.id && (
                        <CheckCircle2 className="text-cyan-400" size={22} />
                      )}
                    </h3>
                    <p className="text-zinc-300 text-sm line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-5 border-t border-zinc-800 mt-2 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} /> 上一页
              </button>
              
              <div className="text-zinc-400 font-medium">
                第 <span className="text-white">{currentPage}</span> 页，共 {totalPages} 页
              </div>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页 <ChevronRight size={18} />
              </button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
