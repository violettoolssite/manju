import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, Loader2, Sparkles, LayoutPanelLeft, FolderKanban, FileVideo, RefreshCcw, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { parseTextToScenes, ApiError } from '../utils/apiService';

export const Workbench: React.FC = () => {
  const {
    projectName,
    episodeName,
    setEpisodeName,
    originalText,
    setOriginalText,
    selectedStyle,
    setIsStyleSelectorOpen,
    status,
    setStatus,
    scenes,
    setScenes,
    addScenes,
    projectCharacters,
    projectEnvironments,
    setProjectAssets,
    settings,
    projects,
    currentProjectId
  } = useStore();

  const [clearPrevious, setClearPrevious] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeProject = projects.find(p => p.id === currentProjectId) || { aspectRatio: '16:9', frameLayout: 'single' };

  const handleGenerate = async () => {
    if (!originalText.trim()) return;
    if (!selectedStyle) {
      setIsStyleSelectorOpen(true);
      return;
    }

    setErrorMsg(null);
    setStatus('parsing');
    try {
      const startIndex = clearPrevious ? 0 : scenes.length;
      
      // Ensure we pass empty arrays if undefined to prevent .map undefined errors
      const safeCharacters = projectCharacters || [];
      const safeEnvironments = projectEnvironments || [];

      const { scenes: newScenes, characters, environments } = await parseTextToScenes(
        originalText,
        selectedStyle,
        safeCharacters,
        safeEnvironments,
        startIndex,
        settings,
        { 
          aspectRatio: (activeProject as any).aspectRatio || '16:9', 
          frameLayout: (activeProject as any).frameLayout || 'single' 
        }
      );
      
      setProjectAssets(characters, environments);

      if (clearPrevious) {
        setScenes(newScenes);
      } else {
        addScenes(newScenes);
      }
      
      // Update workflow step to "Wait for 3D Generation"
      useStore.getState().setWorkflowStep(1);
      
      setStatus('idle'); 
    } catch (error) {
      console.error('Parsing failed:', error);
      if (error instanceof ApiError) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('发生未知错误，请检查网络连接或控制台日志。');
      }
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 p-6 border-r border-zinc-800/50 w-full md:w-[400px] shrink-0">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2 flex items-center gap-3">
          <Sparkles size={28} className="text-cyan-400" />
          工作台
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
          为当前集粘贴故事文本，系统将跨集分析已有的角色和场景。
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <FolderKanban size={14} />
              所属项目
            </label>
            <div className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-3 py-2 text-sm text-zinc-400 cursor-not-allowed">
              {projectName}
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <FileVideo size={14} />
              当前集数名称
            </label>
            <input
              type="text"
              value={episodeName}
              onChange={(e) => setEpisodeName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="输入集数名称..."
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
          <LayoutPanelLeft size={14} />
          项目全局视觉风格
        </label>
        <button
          onClick={() => setIsStyleSelectorOpen(true)}
          className="flex items-center justify-between w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 transition-colors group relative overflow-hidden"
        >
          {selectedStyle ? (
            <div className="flex items-center gap-4 z-10 relative w-full text-left">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 border-zinc-700 shadow-lg relative group-hover:border-cyan-500 transition-colors">
                <img src={selectedStyle.thumbnail} alt={selectedStyle.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-white">
                  更换
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-zinc-100 font-medium truncate text-lg">{selectedStyle.name}</h3>
                <p className="text-zinc-500 text-xs truncate mt-1">{selectedStyle.description}</p>
              </div>
            </div>
          ) : (
            <span className="text-zinc-400">点击选择风格...</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      </div>

      <div className="flex flex-col flex-1 relative min-h-[250px]">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} />
            添加新故事剧本
          </label>
          {scenes.length > 0 && (
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors">
              <input 
                type="checkbox" 
                checked={clearPrevious}
                onChange={(e) => setClearPrevious(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-cyan-500/50"
              />
              清空已有分镜
            </label>
          )}
        </div>
        <textarea
          value={originalText}
          onChange={(e) => setOriginalText(e.target.value)}
          placeholder="在此输入或粘贴剧本文本... 点击下方确认按钮后开始解析。"
          className="w-full flex-1 bg-zinc-900/50 text-zinc-100 placeholder-zinc-600 border border-zinc-800 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all shadow-inner"
          disabled={status !== 'idle'}
        />
        
        {status === 'parsing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-cyan-400 mt-7"
          >
            <Loader2 size={32} className="animate-spin mb-4" />
            <p className="text-sm font-medium animate-pulse">正在利用大模型解析剧本结构...</p>
            <p className="text-xs text-zinc-500 mt-2">跨集检索资产 · 提取角色/场景 · 生成分镜</p>
          </motion.div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start gap-2"
            >
              <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-200">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleGenerate}
          disabled={!originalText.trim() || status !== 'idle'}
          className="w-full relative group overflow-hidden rounded-xl p-4 flex items-center justify-center gap-2 font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 group-hover:scale-[1.05] transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10 flex items-center gap-2">
            {status === 'parsing' ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            确定文本并开始解析
          </span>
        </button>
      </div>
    </div>
  );
};
