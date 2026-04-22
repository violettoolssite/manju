import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileVideo, Plus, Trash2, Edit2, Clock, ArrowLeft, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';

export const EpisodeBrowser: React.FC = () => {
  const { 
    projects, 
    currentProjectId, 
    createEpisode, 
    openEpisode, 
    deleteEpisode, 
    renameEpisode,
    closeProject 
  } = useStore();
  
  const currentProject = projects.find(p => p.id === currentProjectId);
  const episodes = currentProject?.episodes || [];
  
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    episodeId: string;
  } | null>(null);
  
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (editingEpisodeId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingEpisodeId]);

  if (!currentProjectId || !currentProject) return null;

  const handleContextMenu = (e: React.MouseEvent, episodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      episodeId
    });
  };

  const handleCreateEpisode = () => {
    const newId = createEpisode(currentProjectId, `第 ${episodes.length + 1} 集`);
    openEpisode(currentProjectId, newId);
  };

  const handleRenameSubmit = () => {
    if (editingEpisodeId && editName.trim()) {
      renameEpisode(currentProjectId, editingEpisodeId, editName.trim());
    }
    setEditingEpisodeId(null);
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(ts));
  };

  return (
    <div className="flex-1 bg-zinc-950 flex flex-col h-screen overflow-hidden">
      {/* Header Navigation */}
      <div className="h-14 bg-zinc-900/50 border-b border-zinc-800 flex items-center px-6 shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={closeProject}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium px-2 py-1 rounded-lg hover:bg-zinc-800"
          >
            <ArrowLeft size={16} />
            返回所有项目
          </button>
          <div className="h-4 w-px bg-zinc-700" />
          <span className="text-zinc-300 font-medium flex items-center gap-2">
            <FolderKanban size={16} className="text-cyan-500" />
            {currentProject.name}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
                <Layers size={32} className="text-fuchsia-400" />
                剧集管理
              </h1>
              <p className="text-zinc-400">管理该项目下的所有分集，集与集之间共享角色和场景资产。</p>
            </div>
            
            <button
              onClick={handleCreateEpisode}
              className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:scale-105"
            >
              <Plus size={20} />
              新建集数
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {episodes.map((episode) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={episode.id}
                  onContextMenu={(e) => handleContextMenu(e, episode.id)}
                  onClick={() => {
                    if (editingEpisodeId !== episode.id) {
                      openEpisode(currentProjectId, episode.id);
                    }
                  }}
                  className="group bg-zinc-900 border border-zinc-800 hover:border-fuchsia-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(217,70,239,0.1)] relative"
                >
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-4 group-hover:bg-fuchsia-500/10 group-hover:text-fuchsia-400 transition-colors">
                    <FileVideo size={24} />
                  </div>
                  
                  {editingEpisodeId === episode.id ? (
                    <input
                      ref={renameInputRef}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={handleRenameSubmit}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-zinc-950 border border-fuchsia-500 text-white px-2 py-1 rounded text-lg font-bold mb-2 outline-none"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-zinc-100 mb-2 truncate group-hover:text-fuchsia-400 transition-colors">
                      {episode.name}
                    </h3>
                  )}
                  
                  <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-zinc-800/50">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock size={12} /> 更新于: {formatDate(episode.updatedAt)}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <FileVideo size={12} /> 分镜数: {episode.scenes?.length || 0}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {episodes.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-3xl">
                <Layers size={64} className="mb-4 opacity-50" />
                <p className="text-lg mb-2">暂无集数</p>
                <p className="text-sm">点击右上角"新建集数"开始创作您的第一集</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl overflow-hidden py-1 min-w-[160px]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                openEpisode(currentProjectId, contextMenu.episodeId);
                setContextMenu(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-fuchsia-500/20 hover:text-fuchsia-400 flex items-center gap-2"
            >
              <FileVideo size={14} /> 打开该集
            </button>
            <button
              onClick={() => {
                const ep = episodes.find(e => e.id === contextMenu.episodeId);
                if (ep) {
                  setEditName(ep.name);
                  setEditingEpisodeId(contextMenu.episodeId);
                }
                setContextMenu(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
            >
              <Edit2 size={14} /> 重命名
            </button>
            <div className="h-px bg-zinc-800 my-1" />
            <button
              onClick={() => {
                deleteEpisode(currentProjectId, contextMenu.episodeId);
                setContextMenu(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2"
            >
              <Trash2 size={14} /> 删除该集
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Also need to import FolderKanban in this file
import { FolderKanban } from 'lucide-react';