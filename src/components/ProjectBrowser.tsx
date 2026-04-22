import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Plus, Trash2, Edit2, Clock, Sparkles, FolderKanban, Settings2, Upload, ImageIcon, ImagePlus, RefreshCcw, LayoutTemplate, LayoutPanelTop } from 'lucide-react';
import { useStore, Project, AspectRatio, FrameLayout } from '../store/useStore';
import { SettingsModal } from './SettingsModal';

export const ProjectBrowser: React.FC = () => {
  const { projects, createProject, openProject, deleteProject, renameProject, setIsSettingsModalOpen } = useStore();
  
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    projectId: string;
  } | null>(null);
  
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // Create Project Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCover, setNewProjectCover] = useState('');
  const [newProjectAspectRatio, setNewProjectAspectRatio] = useState<AspectRatio>('16:9');
  const [newProjectFrameLayout, setNewProjectFrameLayout] = useState<FrameLayout>('single');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (editingProjectId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [editingProjectId]);

  const handleContextMenu = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      projectId
    });
  };

  const handleCreateOrUpdateProject = () => {
    if (!newProjectName.trim()) {
      alert("项目名称不能为空");
      return;
    }
    
    if (modalMode === 'create') {
      const newId = useStore.getState().createProject(
        newProjectName.trim(), 
        newProjectCover, 
        newProjectAspectRatio, 
        newProjectFrameLayout
      );
      setIsCreateModalOpen(false);
      openProject(newId);
    } else if (modalMode === 'edit' && editTargetId) {
      useStore.getState().updateProject(editTargetId, {
        name: newProjectName.trim(),
        coverImage: newProjectCover,
        aspectRatio: newProjectAspectRatio,
        frameLayout: newProjectFrameLayout
      });
      setIsCreateModalOpen(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setNewProjectName(`未命名项目 ${projects.length + 1}`);
    setNewProjectCover('');
    setNewProjectAspectRatio('16:9');
    setNewProjectFrameLayout('single');
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setModalMode('edit');
      setEditTargetId(project.id);
      setNewProjectName(project.name);
      setNewProjectCover(project.coverImage || '');
      setNewProjectAspectRatio(project.aspectRatio || '16:9');
      setNewProjectFrameLayout(project.frameLayout || 'single');
      setIsCreateModalOpen(true);
      setContextMenu(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProjectCover(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRandomCover = () => {
    // Collect all generated images from all projects as a pool
    const allImages: string[] = [];
    projects.forEach(p => {
      p.episodes.forEach(ep => {
        ep.scenes.forEach(s => {
          if (s.imageUrl) allImages.push(s.imageUrl);
          if (s.videoUrl) allImages.push(s.videoUrl); // poster or preview
        });
      });
    });

    if (allImages.length > 0) {
      const randomImg = allImages[Math.floor(Math.random() * allImages.length)];
      setNewProjectCover(randomImg);
    } else {
      alert("当前没有任何已生成的场景图片可以作为随机封面。");
    }
  };

  const handleRenameSubmit = () => {
    if (editingProjectId && editName.trim()) {
      renameProject(editingProjectId, editName.trim());
    }
    setEditingProjectId(null);
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
    <div className="flex-1 bg-zinc-950 p-8 h-screen overflow-y-auto relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
              <FolderKanban size={32} className="text-cyan-400" />
              项目浏览器
            </h1>
            <p className="text-zinc-400">管理您的所有创作项目，右键点击项目可进行操作</p>
          </div>
          
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105"
          >
            <Plus size={20} />
            新建项目
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {projects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={project.id}
                onContextMenu={(e) => handleContextMenu(e, project.id)}
                onClick={() => {
                  if (editingProjectId !== project.id) {
                    openProject(project.id);
                  }
                }}
                className="group bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] relative flex flex-col"
              >
                <div className="h-40 relative">
                  {(project as any).coverImage || (project as any).cover ? (
                    <img src={(project as any).coverImage || (project as any).cover} alt={project.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity bg-zinc-800/50">
                      <FolderKanban size={64} className="text-zinc-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none" />
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  {editingProjectId === project.id ? (
                    <input
                      ref={renameInputRef}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={handleRenameSubmit}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-zinc-950 border border-cyan-500 text-white px-2 py-1 rounded text-lg font-bold mb-2 outline-none"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-zinc-100 mb-2 truncate group-hover:text-cyan-400 transition-colors">
                      {project.name}
                    </h3>
                  )}
                  
                  <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-zinc-800/50">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock size={12} /> 更新于: {formatDate(project.updatedAt)}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Sparkles size={12} /> 包含集数: {project.episodes?.length || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {projects.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-3xl">
              <FolderKanban size={64} className="mb-4 opacity-50" />
              <p className="text-lg mb-2">暂无项目</p>
              <p className="text-sm">点击右上角"新建项目"开始您的创作</p>
            </div>
          )}
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
                openProject(contextMenu.projectId);
                setContextMenu(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-cyan-500/20 hover:text-cyan-400 flex items-center gap-2"
            >
              <Folder size={14} /> 打开项目
            </button>
            <button
              onClick={() => {
                const proj = projects.find(p => p.id === contextMenu.projectId);
                if (proj) {
                  setEditName(proj.name);
                  setEditingProjectId(contextMenu.projectId);
                }
                setContextMenu(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
            >
              <Edit2 size={14} /> 重命名
            </button>
            <button
              onClick={() => handleOpenEditModal(contextMenu.projectId)}
              className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
            >
              <Settings2 size={14} /> 项目设置
            </button>
            <div className="h-px bg-zinc-800 my-1" />
            <button
              onClick={() => {
                deleteProject(contextMenu.projectId);
                setContextMenu(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2"
            >
              <Trash2 size={14} /> 删除项目
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Settings Button */}
      <button
        onClick={() => setIsSettingsModalOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-zinc-800 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] group"
        title="全局设置"
      >
        <Settings2 size={24} className="group-hover:rotate-45 transition-transform duration-500" />
      </button>

      <SettingsModal />
      
      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {modalMode === 'create' ? (
                    <><FolderKanban size={24} className="text-cyan-400" />新建项目</>
                  ) : (
                    <><Settings2 size={24} className="text-purple-400" />编辑项目设置</>
                  )}
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">项目名称</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="输入项目名称"
                    autoFocus
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-1">
                      <LayoutTemplate size={14} /> 画面比例
                    </label>
                    <select
                      value={newProjectAspectRatio}
                      onChange={(e) => setNewProjectAspectRatio(e.target.value as AspectRatio)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="16:9">16:9 (横屏视频)</option>
                      <option value="9:16">9:16 (竖屏短视频)</option>
                      <option value="1:1">1:1 (正方形图)</option>
                      <option value="4:3">4:3 (传统横屏)</option>
                      <option value="3:4">3:4 (传统竖屏)</option>
                      <option value="21:9">21:9 (宽荧幕电影)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-1">
                      <LayoutPanelTop size={14} /> 画面布局
                    </label>
                    <select
                      value={newProjectFrameLayout}
                      onChange={(e) => setNewProjectFrameLayout(e.target.value as FrameLayout)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      <option value="single">单格图 (常规)</option>
                      <option value="double">双格图 (上下/左右分屏)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">项目封面 (可选)</label>
                  <div className="flex gap-4 items-end">
                    <div 
                      className="w-32 h-20 rounded-lg border-2 border-dashed border-zinc-700 overflow-hidden flex items-center justify-center bg-zinc-950 relative group cursor-pointer hover:border-cyan-500/50 transition-colors shrink-0"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {newProjectCover ? (
                        <img src={newProjectCover} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={24} className="text-zinc-600 group-hover:text-cyan-500 transition-colors" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Upload size={14} /> 本地上传
                      </button>
                      <button
                        onClick={handleRandomCover}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <ImagePlus size={14} /> 随机抽取已生成画面
                      </button>
                      {newProjectCover && (
                        <button
                          onClick={() => setNewProjectCover('')}
                          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Trash2 size={14} /> 清除封面
                        </button>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 flex justify-end gap-3">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateOrUpdateProject}
                  className="px-5 py-2.5 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-lg shadow-cyan-900/20"
                >
                  {modalMode === 'create' ? '创建并打开' : '保存设置'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};