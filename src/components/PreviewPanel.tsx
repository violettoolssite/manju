import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Download, Pause, Maximize2, Camera, Link as LinkIcon, RefreshCcw, User, MapPin, FolderKanban, Trash2, AlertTriangle, Edit2, CheckCircle2, MessageSquare } from 'lucide-react';
import { useStore, Scene, CharacterAsset, EnvironmentAsset } from '../store/useStore';
import { generateImageForScene, generateVideoForScene, generateThreeViewImage, ApiError } from '../utils/apiService';

const WorkflowToolbar: React.FC = () => {
  const { 
    workflowStep, setWorkflowStep, 
    projectCharacters, projectEnvironments, updateProjectAsset,
    scenes, updateScene,
    settings, selectedStyle, currentProjectId, projects 
  } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const activeProject = projects.find(p => p.id === currentProjectId);

  const handleGenerate3DViews = async () => {
    if (!selectedStyle || !activeProject) {
      alert('请先选择全局风格或确认项目存在');
      return;
    }
    setIsProcessing(true);
    try {
      for (const char of projectCharacters) {
        if (!char.threeViewUrl) {
          const url = await generateThreeViewImage('character', char.name, selectedStyle.name, settings, {
            aspectRatio: activeProject.aspectRatio,
            frameLayout: activeProject.frameLayout
          });
          updateProjectAsset('character', char.id, { threeViewUrl: url });
        }
      }
      for (const env of projectEnvironments) {
        if (!env.threeViewUrl) {
          const url = await generateThreeViewImage('environment', env.name, selectedStyle.name, settings, {
            aspectRatio: activeProject.aspectRatio,
            frameLayout: activeProject.frameLayout
          });
          updateProjectAsset('environment', env.id, { threeViewUrl: url });
        }
      }
      setWorkflowStep(2);
    } catch (error: any) {
      alert(`生成三视图失败: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateSceneImages = async () => {
    if (!activeProject) return;
    setIsProcessing(true);
    try {
      for (const scene of scenes) {
        if (!scene.imageUrl) {
          updateScene(scene.id, { status: 'image_generating' });
          const url = await generateImageForScene(scene, settings, {
            aspectRatio: activeProject.aspectRatio,
            frameLayout: activeProject.frameLayout
          });
          updateScene(scene.id, { imageUrl: url, status: 'awaiting_confirmation' });
        }
      }
      setWorkflowStep(3);
    } catch (error: any) {
      alert(`生成分镜图失败: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideos = async () => {
    if (!activeProject) return;
    setIsProcessing(true);
    try {
      let previousFrameUrl = '';
      for (const scene of scenes) {
        if (!scene.videoUrl) {
          updateScene(scene.id, { status: 'video_generating' });
          const { videoUrl, lastFrameUrl } = await generateVideoForScene(scene, settings, previousFrameUrl, {
            aspectRatio: activeProject.aspectRatio,
            frameLayout: activeProject.frameLayout
          });
          updateScene(scene.id, { videoUrl, lastFrameUrl, status: 'completed' });
          previousFrameUrl = lastFrameUrl;
        } else {
          previousFrameUrl = scene.lastFrameUrl || '';
        }
      }
      setWorkflowStep(4);
    } catch (error: any) {
      alert(`生成视频失败: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (workflowStep === 0) return null;

  return (
    <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 pb-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${workflowStep >= 1 ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-500'}`}>
            <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-zinc-900">1</span>
            解析与审核
          </div>
          <div className={`w-8 h-px ${workflowStep >= 2 ? 'bg-cyan-500/50' : 'bg-zinc-800'}`} />
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${workflowStep >= 2 ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-500'}`}>
            <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-zinc-900">2</span>
            三视图生成
          </div>
          <div className={`w-8 h-px ${workflowStep >= 3 ? 'bg-fuchsia-500/50' : 'bg-zinc-800'}`} />
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${workflowStep >= 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
            <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-zinc-900">3</span>
            分镜图生成
          </div>
          <div className={`w-8 h-px ${workflowStep >= 4 ? 'bg-orange-500/50' : 'bg-zinc-800'}`} />
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${workflowStep >= 4 ? 'bg-orange-500/20 text-orange-400' : 'bg-zinc-800 text-zinc-500'}`}>
            <span className="w-5 h-5 rounded-full bg-current flex items-center justify-center text-zinc-900">4</span>
            视频生成
          </div>
        </div>

        <div>
          {workflowStep === 1 && (
            <button
              onClick={handleGenerate3DViews}
              disabled={isProcessing}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-2 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing && <RefreshCcw className="animate-spin" size={16} />}
              确认无误，生成三视图
            </button>
          )}
          {workflowStep === 2 && (
            <button
              onClick={handleGenerateSceneImages}
              disabled={isProcessing}
              className="bg-purple-500 hover:bg-purple-400 text-zinc-950 px-6 py-2 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing && <RefreshCcw className="animate-spin" size={16} />}
              三视图已确认，生成分镜图
            </button>
          )}
          {workflowStep === 3 && (
            <button
              onClick={handleGenerateVideos}
              disabled={isProcessing}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-2 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing && <RefreshCcw className="animate-spin" size={16} />}
              分镜图已确认，生成视频
            </button>
          )}
          {workflowStep === 4 && (
            <div className="bg-orange-500/20 text-orange-400 px-6 py-2 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle2 size={18} />
              全流程已完成
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssetGallery: React.FC = () => {
  const { projectCharacters, projectEnvironments, projectName, deleteProjectAsset, currentProjectId, projects } = useStore();
  const activeProject = projects.find(p => p.id === currentProjectId);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string;
    type: 'character' | 'environment';
    item: CharacterAsset | EnvironmentAsset;
  } | null>(null);

  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  if (projectCharacters.length === 0 && projectEnvironments.length === 0) return null;

  const handleContextMenu = (e: React.MouseEvent, id: string, type: 'character' | 'environment', item: CharacterAsset | EnvironmentAsset) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, id, type, item });
  };

  const handleDeleteAsset = () => {
    if (contextMenu) {
      useStore.getState().deleteProjectAsset(contextMenu.type, contextMenu.id);
      setContextMenu(null);
    }
  };

  const handleRegenerateAsset = async () => {
    if (contextMenu && contextMenu.item && activeProject) {
      const { type, id, item } = contextMenu;
      const { selectedStyle, settings, updateProjectAsset } = useStore.getState();
      
      if (!selectedStyle) {
        alert("请先选择全局风格");
        return;
      }
      
      setIsRegenerating(true);
      try {
        updateProjectAsset(type, id, { threeViewUrl: '' });
        const url = await generateThreeViewImage(type, item.name, selectedStyle.name, settings, {
          aspectRatio: activeProject.aspectRatio,
          frameLayout: activeProject.frameLayout
        });
        updateProjectAsset(type, id, { threeViewUrl: url });
      } catch (error: any) {
        alert(`重新生成失败: ${error.message}`);
      } finally {
        setIsRegenerating(false);
        setContextMenu(null);
      }
    }
  };

  return (
    <div className="mb-8 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl relative">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <FolderKanban size={18} className="text-purple-400" /> 
        项目资产库：{projectName}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-1">
            <User size={14} /> 人物三视图参考
          </h4>
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {projectCharacters.map(char => (
              <div
                key={char.id}
                onContextMenu={(e) => handleContextMenu(e, char.id, 'character', char)}
                className="shrink-0 w-32 relative group rounded-lg overflow-hidden border border-zinc-700 cursor-context-menu hover:border-cyan-500/50 transition-colors bg-zinc-950 flex flex-col"
              >
                {char.threeViewUrl ? (
                  <img src={char.threeViewUrl} alt={char.name} className="w-full h-24 object-cover" />
                ) : (
                  <div className="w-full h-24 flex items-center justify-center text-zinc-600">
                    <User size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center pointer-events-none">
                  <span className="text-xs text-white font-medium">{char.name}</span>
                </div>
                <div className="bg-zinc-800 text-xs text-center py-1 text-zinc-300 truncate px-1 mt-auto">{char.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-1">
            <MapPin size={14} /> 场景三视图参考
          </h4>
          <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
            {projectEnvironments.map(env => (
              <div
                key={env.id}
                onContextMenu={(e) => handleContextMenu(e, env.id, 'environment', env)}
                className="shrink-0 w-32 relative group rounded-lg overflow-hidden border border-zinc-700 cursor-context-menu hover:border-cyan-500/50 transition-colors bg-zinc-950 flex flex-col"
              >
                {env.threeViewUrl ? (
                  <img src={env.threeViewUrl} alt={env.name} className="w-full h-24 object-cover" />
                ) : (
                  <div className="w-full h-24 flex items-center justify-center text-zinc-600">
                    <MapPin size={24} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center pointer-events-none">
                  <span className="text-xs text-white font-medium">{env.name}</span>
                </div>
                <div className="bg-zinc-800 text-xs text-center py-1 text-zinc-300 truncate px-1 mt-auto">{env.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl overflow-hidden py-1 min-w-[140px]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleRegenerateAsset}
              disabled={isRegenerating}
              className="w-full text-left px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCcw size={14} className={isRegenerating ? "animate-spin" : ""} />
              重新生成三视图
            </button>
            <button
              onClick={handleDeleteAsset}
              disabled={isRegenerating}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 size={14} />
              删除该{contextMenu.type === 'character' ? '人物' : '场景'}资产
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SceneCard: React.FC<{ scene: Scene; index: number }> = ({ scene, index }) => {
  const { updateScene, deleteScene, settings, currentProjectId, projects } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeProject = projects.find(p => p.id === currentProjectId);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };
  
  // Automatic pipeline removed. Image generation is now triggered by WorkflowToolbar or manual user action.
  const handleRegenerateImage = async () => {
    if (useStore.getState().workflowStep < 2) {
      alert("请先生成并确认三视图后，再生成分镜图片。");
      return;
    }
    if (!activeProject) return;
    try {
      setErrorMsg(null);
      updateScene(scene.id, { status: 'image_generating' });
      const imageUrl = await generateImageForScene(scene, settings, {
        aspectRatio: activeProject.aspectRatio,
        frameLayout: activeProject.frameLayout
      });
      updateScene(scene.id, { imageUrl, status: 'awaiting_confirmation' });
    } catch (error) {
      console.error('Image regeneration failed:', error);
      if (error instanceof ApiError) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('发生未知网络错误。');
      }
      updateScene(scene.id, { status: 'pending' });
    }
  };

  const handleConfirmAndGenerateVideo = async () => {
    if (useStore.getState().workflowStep < 3) {
      alert("请先生成并确认分镜图片后，再生成视频。");
      return;
    }
    if (!activeProject) return;
    try {
      setErrorMsg(null);
      updateScene(scene.id, { status: 'video_generating' });

      // Find previous frame URL if this scene is continuous
      let previousFrameUrl = '';
      if (scene.isContinuous && index > 0) {
        const prevScene = useStore.getState().scenes[index - 1];
        if (prevScene && prevScene.lastFrameUrl) {
          previousFrameUrl = prevScene.lastFrameUrl;
        }
      }

      // Video generation
      const { videoUrl, lastFrameUrl } = await generateVideoForScene(scene, settings, previousFrameUrl, {
        aspectRatio: activeProject.aspectRatio,
        frameLayout: activeProject.frameLayout
      });
      updateScene(scene.id, { videoUrl, lastFrameUrl, status: 'completed' });
    } catch (error) {
      console.error('Video generation failed:', error);
      if (error instanceof ApiError) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('发生未知网络错误。');
      }
      updateScene(scene.id, { status: 'awaiting_confirmation' });
    }
  };

  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(scene.optimizedPrompt);
  const [editedDialogue, setEditedDialogue] = useState(scene.dialogue || '');
  const [editedActions, setEditedActions] = useState(scene.actions.join('，'));

  const handleSaveEdits = () => {
    updateScene(scene.id, { 
      optimizedPrompt: editedPrompt,
      dialogue: editedDialogue,
      actions: editedActions.split('，').map(a => a.trim()).filter(Boolean)
    });
    setIsEditingPrompt(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onContextMenu={handleContextMenu}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row mb-6 relative"
    >
      <div className="w-full md:w-2/5 p-6 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Camera size={20} className="text-cyan-500" />
              {scene.sceneName}
            </h3>
            {scene.isContinuous && index > 0 && (
              <span className="flex items-center gap-1 text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                <LinkIcon size={12} />
                场景一致·沿用参考
              </span>
            )}
          </div>
          
          <p className="text-zinc-300 text-sm leading-relaxed mb-4 italic border-l-2 border-zinc-700 pl-3">
            "{scene.description}"
          </p>
          
          {isEditingPrompt ? (
            <div className="space-y-3 mb-4 bg-zinc-950 p-4 rounded-xl border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <div>
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mb-1">
                  <User size={12} /> 动作描述 (用逗号分隔)
                </label>
                <input 
                  value={editedActions}
                  onChange={(e) => setEditedActions(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mb-1">
                  <MessageSquare size={12} /> 角色对白
                </label>
                <textarea 
                  value={editedDialogue}
                  onChange={(e) => setEditedDialogue(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1 mb-1">
                  <Camera size={12} /> 视频生成画面提示词
                </label>
                <textarea 
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500 resize-none font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setIsEditingPrompt(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveEdits}
                  className="px-3 py-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium flex items-center gap-1"
                >
                  <CheckCircle2 size={14} /> 保存修改
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {scene.characters.map((c, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-zinc-800 text-cyan-300 rounded-md border border-zinc-700 flex items-center gap-1">
                    <User size={12} /> {c}
                  </span>
                ))}
                <span className="text-xs px-2 py-1 bg-zinc-800 text-emerald-300 rounded-md border border-zinc-700 flex items-center gap-1">
                  <MapPin size={12} /> {scene.environment}
                </span>
                {scene.actions.map((a, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-zinc-800 text-amber-300 rounded-md border border-zinc-700">
                    🎬 {a}
                  </span>
                ))}
              </div>

              {scene.dialogue && (
                <div className="mb-4 text-sm text-zinc-400 bg-zinc-800/30 p-2 rounded-lg border border-zinc-800 flex items-start gap-2">
                  <MessageSquare size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                  <span className="italic">「{scene.dialogue}」</span>
                </div>
              )}

              <div className="text-xs text-zinc-500 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50 break-words font-mono relative group">
                <span className="block text-zinc-400 font-bold mb-1">优化提示词:</span>
                {scene.optimizedPrompt}
                
                {scene.status === 'awaiting_confirmation' && (
                  <button 
                    onClick={() => {
                      setEditedPrompt(scene.optimizedPrompt);
                      setEditedDialogue(scene.dialogue || '');
                      setEditedActions(scene.actions.join('，'));
                      setIsEditingPrompt(true);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-zinc-800 text-zinc-400 rounded hover:text-cyan-400 hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
                    title="编辑提示词和描述"
                  >
                    <Edit2 size={14} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <span className="flex items-center gap-2 text-xs font-medium text-zinc-500">
            状态:
            {scene.status === 'pending' && <span className="text-zinc-400">等待处理</span>}
            {scene.status === 'image_generating' && <span className="text-blue-400 flex items-center gap-1"><RefreshCcw size={12} className="animate-spin" /> 基于三视图生成分镜图中...</span>}
            {scene.status === 'awaiting_confirmation' && <span className="text-amber-400 flex items-center gap-1"><AlertTriangle size={12} /> 待确认画面与提示词</span>}
            {scene.status === 'video_generating' && <span className="text-purple-400 flex items-center gap-1"><RefreshCcw size={12} className="animate-spin" /> 渲染连贯视频帧...</span>}
            {scene.status === 'completed' && <span className="text-emerald-400">✅ 创作完成</span>}
          </span>

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 flex items-start gap-2 mt-3"
              >
                <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-xs text-red-300 leading-relaxed">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2 mt-4">
            {scene.status !== 'pending' && scene.status !== 'image_generating' && (
              <button
                onClick={handleRegenerateImage}
                className="flex-1 bg-zinc-800 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold py-2 rounded-xl transition-all border border-zinc-700 hover:border-cyan-500/50 flex items-center justify-center gap-1"
              >
                <RefreshCcw size={12} /> 重新生成图片
              </button>
            )}
            
            {scene.status === 'completed' && (
              <button
                onClick={handleConfirmAndGenerateVideo}
                className="flex-1 bg-zinc-800 hover:bg-purple-500/20 text-purple-400 text-xs font-bold py-2 rounded-xl transition-all border border-zinc-700 hover:border-purple-500/50 flex items-center justify-center gap-1"
              >
                <RefreshCcw size={12} /> 重新生成视频
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 relative bg-black flex items-center justify-center min-h-[250px] overflow-hidden group">
        <AnimatePresence mode="wait">
          {scene.status === 'pending' && (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 z-10 bg-zinc-950">
              <Camera size={48} className="mb-4 opacity-50" />
              <p className="text-sm font-medium tracking-widest uppercase">等待生成分镜图</p>
            </motion.div>
          )}

          {scene.status === 'image_generating' && (
            <motion.div key="image_loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 z-10">
              <div className="w-16 h-16 border-4 border-zinc-800 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium tracking-widest uppercase">GENERATING VISUALS</p>
            </motion.div>
          )}
          
          {scene.status === 'video_generating' && scene.imageUrl && (
            <motion.div key="video_loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10">
              <img src={scene.imageUrl} alt={scene.sceneName} className="w-full h-full object-cover opacity-30 blur-sm" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
                <p className="text-sm font-medium tracking-widest uppercase text-purple-200 drop-shadow-md">RENDERING MOTION</p>
              </div>
            </motion.div>
          )}

          {(scene.status === 'completed' || scene.status === 'awaiting_confirmation') && scene.imageUrl && (
            <motion.div key="completed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10">
              <div 
                className="w-full h-full relative"
                onMouseEnter={() => videoRef.current?.play()}
                onMouseLeave={() => {
                  if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                  }
                }}
              >
                {scene.videoUrl ? (
                  <video 
                    ref={videoRef}
                    src={scene.videoUrl} 
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                    poster={scene.imageUrl}
                  />
                ) : (
                  <img src={scene.imageUrl} alt={scene.sceneName} className="w-full h-full object-cover" />
                )}
                
                {scene.status === 'completed' && scene.videoUrl && (
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                    <button 
                      onClick={() => {
                        if (videoRef.current) {
                          if (videoRef.current.paused) videoRef.current.play();
                          else videoRef.current.pause();
                        }
                      }}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all text-white"
                    >
                      <Play size={24} className="ml-1" />
                    </button>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors">
                    <Download size={16} />
                  </button>
                  <button className="p-2 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Placeholder background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 to-black opacity-50 pointer-events-none" />
      </div>

      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-xl overflow-hidden py-1 min-w-[140px]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                deleteScene(scene.id);
                setContextMenu(null);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center gap-2"
            >
              <Trash2 size={14} /> 
              删除该分镜
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const PreviewPanel: React.FC = () => {
  const { scenes, projectCharacters, projectEnvironments } = useStore();

  if (scenes.length === 0 && projectCharacters.length === 0 && projectEnvironments.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="w-24 h-24 mb-6 mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Camera size={40} className="text-zinc-600" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-300 mb-2">等待灵感注入</h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            在左侧工作台填写项目名、选择风格并提交文本。我们将自动为您提取项目专属的人物与场景三视图资产，并生成连贯的分镜视频。
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-zinc-950 overflow-y-auto custom-scrollbar p-6 md:p-10 relative">
      <div className="max-w-5xl mx-auto relative z-10">

        <WorkflowToolbar />

        <AssetGallery />

        {scenes.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="inline-block w-2 h-8 bg-cyan-500 rounded-full" />
                分镜序列生成面板
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-medium">当前时间线场景: <span className="text-white">{scenes.length}</span></span>
              </div>
            </div>

            <div className="space-y-2">
              {scenes.map((scene, index) => (
                <SceneCard key={scene.id} scene={scene} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};