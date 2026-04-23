import React, { useEffect } from 'react';
import { Workbench } from './components/Workbench';
import { PreviewPanel } from './components/PreviewPanel';
import { StyleSelector } from './components/StyleSelector';
import { ProjectBrowser } from './components/ProjectBrowser';
import { EpisodeBrowser } from './components/EpisodeBrowser';
import { useStore } from './store/useStore';
import { PlayCircle, ArrowLeft, Save, FolderKanban, FileVideo } from 'lucide-react';

function App() {
  const { 
    scenes, 
    status, 
    viewMode, 
    closeProject, 
    closeEpisode,
    saveCurrentState, 
    currentProjectId,
    currentEpisodeId,
    projectName,
    episodeName
  } = useStore();
  
  const allCompleted = scenes.length > 0 && scenes.every(s => s.status === 'completed');

  // Auto-save logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (currentProjectId) {
      interval = setInterval(() => {
        saveCurrentState();
        console.log('Auto-saved at', new Date().toLocaleTimeString());
      }, 30000); // 30 seconds
    }
    return () => clearInterval(interval);
  }, [currentProjectId, saveCurrentState]);

  if (viewMode === 'browser') {
    return <ProjectBrowser />;
  }

  if (viewMode === 'episodes') {
    return <EpisodeBrowser />;
  }

  return (
    <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden flex-col">
      {/* Top Header Navigation */}
      <div className="h-14 bg-zinc-950 border-b border-zinc-800/50 flex items-center px-4 justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={closeEpisode}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-900"
          >
            <ArrowLeft size={16} />
            返回集数列表
          </button>
          
          <div className="h-4 w-px bg-zinc-800" />
          
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-zinc-500 font-medium cursor-pointer hover:text-zinc-300" onClick={closeEpisode}>
              <FolderKanban size={14} />
              {projectName}
            </span>
            <span className="text-zinc-700">/</span>
            <span className="flex items-center gap-1.5 text-fuchsia-400 font-bold">
              <FileVideo size={14} />
              {episodeName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-zinc-500 text-xs">
          <Save size={14} className="text-emerald-500/50" />
          <span>系统将每30秒及退出时自动保存</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <Workbench />
        <PreviewPanel />
        <StyleSelector />
        
        {allCompleted && (
          <div className="fixed bottom-6 right-6 z-50">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-4 rounded-full font-bold shadow-[0_10px_40px_-10px_rgba(6,182,212,0.8)] hover:scale-105 transition-all flex items-center gap-3">
              <PlayCircle size={24} />
              播放当前集
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
