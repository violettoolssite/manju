import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CharacterAsset {
  id: string;
  name: string;
  description: string;
  threeViewUrl: string; // 人物三视图参考图片
}

export interface EnvironmentAsset {
  id: string;
  name: string;
  description: string;
  threeViewUrl: string; // 场景三视图参考图片
}

export interface Scene {
  id: string;
  sceneName: string;
  description: string;
  dialogue?: string; // 增加对话内容
  characters: string[]; 
  environment: string; 
  actions: string[];
  optimizedPrompt: string;
  isContinuous: boolean;
  imageUrl?: string;
  videoUrl?: string;
  lastFrameUrl?: string;
  currentVideoTaskId?: string; // Store task ID to allow cancellation
  status: 'pending' | 'image_generating' | 'awaiting_confirmation' | 'video_generating' | 'completed';
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export interface Episode {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  originalText: string;
  scenes: Scene[];
  workflowStep: number; // 0:草稿, 1:待确认三视图, 2:待确认分镜图, 3:待确认视频, 4:完成
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '21:9';
export type FrameLayout = 'single' | 'double';

export interface Project {
  id: string;
  name: string;
  coverImage?: string; // 项目封面图片
  aspectRatio: AspectRatio; // 画面比例
  frameLayout: FrameLayout; // 单图或双格图
  createdAt: number;
  updatedAt: number;
  selectedStyle: StyleOption | null;
  characters: CharacterAsset[]; // 项目级别的全局资产
  environments: EnvironmentAsset[]; // 项目级别的全局资产
  episodes: Episode[];
}

export interface AppSettings {
  textAnalysisProvider: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'zhipu' | 'baichuan' | 'wenxin' | 'qwen' | 'minimax' | 'moonshot' | 'doubao' | 'custom';
  textAnalysisApiKey: string;
  textAnalysisBaseUrl: string;
  textAnalysisModelName: string;
  imageGenerationProvider: 'dalle' | 'midjourney' | 'stablediffusion' | 'zhipu_cogview' | 'wenxin_ernie_vilg' | 'moonshot' | 'doubao' | 'custom';
  imageGenerationApiKey: string;
  imageGenerationBaseUrl: string;
  imageGenerationModelName: string;
  videoGenerationProvider: 'runway' | 'pika' | 'sora' | 'kling' | 'zhipu_cogvideo' | 'shengshu_vidu' | 'doubao' | 'custom';
  videoGenerationApiKey: string;
  videoGenerationBaseUrl: string;
  videoGenerationModelName: string;
}

interface AppState {
  viewMode: 'browser' | 'episodes' | 'workbench';
  setViewMode: (mode: 'browser' | 'episodes' | 'workbench') => void;
  
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (isOpen: boolean) => void;

  projects: Project[];
  currentProjectId: string | null;
  currentEpisodeId: string | null;
  
  // 项目管理
  createProject: (name: string, coverImage?: string, aspectRatio?: AspectRatio, frameLayout?: FrameLayout) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  openProject: (id: string) => void;
  deleteProject: (id: string) => void;
  renameProject: (id: string, newName: string) => void;
  closeProject: () => void;
  
  // 集数管理
  createEpisode: (projectId: string, name: string) => string;
  openEpisode: (projectId: string, episodeId: string) => void;
  deleteEpisode: (projectId: string, episodeId: string) => void;
  renameEpisode: (projectId: string, episodeId: string, newName: string) => void;
  closeEpisode: () => void;
  
  // 工作台使用的临时状态（当前编辑的集数与所属项目）
  projectName: string;
  setProjectName: (name: string) => void;
  episodeName: string;
  setEpisodeName: (name: string) => void;
  originalText: string;
  setOriginalText: (text: string) => void;
  
  selectedStyle: StyleOption | null;
  setSelectedStyle: (style: StyleOption | null) => void;
  isStyleSelectorOpen: boolean;
  setIsStyleSelectorOpen: (isOpen: boolean) => void;
  
  workflowStep: number;
  setWorkflowStep: (step: number) => void;
  status: 'idle' | 'parsing' | 'generating' | 'completed';
  setStatus: (status: 'idle' | 'parsing' | 'generating' | 'completed') => void;
  
  // 全局资产缓存
  projectCharacters: CharacterAsset[];
  projectEnvironments: EnvironmentAsset[];
  setProjectAssets: (characters: CharacterAsset[], environments: EnvironmentAsset[]) => void;
  updateProjectAsset: (type: 'character' | 'environment', id: string, updates: Partial<CharacterAsset | EnvironmentAsset>) => void;
  deleteProjectAsset: (type: 'character' | 'environment', id: string) => void;

  scenes: Scene[];
  setScenes: (scenes: Scene[]) => void;
  addScenes: (scenes: Scene[]) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  deleteScene: (id: string) => void;
  
  saveCurrentState: () => void;

  updateEpisode: (projectId: string, episodeId: string, updates: Partial<Episode>) => void;
  setEpisodeWorkflowStep: (projectId: string, episodeId: string, step: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      viewMode: 'browser',
      setViewMode: (mode) => set({ viewMode: mode }),
      
      settings: {
        textAnalysisProvider: 'openai',
        textAnalysisApiKey: '',
        textAnalysisBaseUrl: 'https://api.openai.com/v1',
        textAnalysisModelName: 'gpt-3.5-turbo',
        imageGenerationProvider: 'dalle',
        imageGenerationApiKey: '',
        imageGenerationBaseUrl: 'https://api.openai.com/v1',
        imageGenerationModelName: 'dall-e-3',
        videoGenerationProvider: 'runway',
        videoGenerationApiKey: '',
        videoGenerationBaseUrl: 'https://api.runwayml.com/v1',
        videoGenerationModelName: 'gen3a-turbo',
      },
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      
      isSettingsModalOpen: false,
      setIsSettingsModalOpen: (isOpen) => set({ isSettingsModalOpen: isOpen }),

      projects: [],
      currentProjectId: null,
      currentEpisodeId: null,
      
      createProject: (name, coverImage, aspectRatio = '16:9', frameLayout = 'single') => {
        const newProject: Project = {
          id: `proj-${Date.now()}`,
          name,
          coverImage,
          aspectRatio: aspectRatio as AspectRatio,
          frameLayout: frameLayout as FrameLayout,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          selectedStyle: null,
          characters: [],
          environments: [],
          episodes: []
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
        get().saveCurrentState();
        return newProject.id;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
          )
        }));
        get().saveCurrentState();
      },
      
      openProject: (id) => {
        const project = get().projects.find(p => p.id === id);
        if (project) {
          set({
            currentProjectId: id,
            projectName: project.name,
            selectedStyle: project.selectedStyle,
            projectCharacters: project.characters || [],
            projectEnvironments: project.environments || [],
            viewMode: 'episodes',
            currentEpisodeId: null,
          });
        }
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== id),
          ...(state.currentProjectId === id ? { 
            currentProjectId: null, 
            currentEpisodeId: null,
            viewMode: 'browser' 
          } : {})
        }));
      },
      
      renameProject: (id, newName) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === id ? { ...p, name: newName, updatedAt: Date.now() } : p
          ),
          ...(state.currentProjectId === id ? { projectName: newName } : {})
        }));
      },
      
      closeProject: () => {
        const state = get();
        if (state.currentProjectId || state.currentEpisodeId) {
          state.saveCurrentState();
        }
        set({ currentProjectId: null, currentEpisodeId: null, viewMode: 'browser' });
      },

      createEpisode: (projectId, name) => {
        const newEpisode: Episode = {
          id: `ep-${Date.now()}`,
          name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          originalText: '',
          scenes: [],
          workflowStep: 0,
        };
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId ? { ...p, episodes: [...(p.episodes || []), newEpisode], updatedAt: Date.now() } : p
          )
        }));
        return newEpisode.id;
      },

      openEpisode: (projectId, episodeId) => {
        const project = get().projects.find(p => p.id === projectId);
        if (!project) return;
        const episode = project.episodes?.find(e => e.id === episodeId);
        if (!episode) return;

        set({
          currentProjectId: projectId,
          currentEpisodeId: episodeId,
          projectName: project.name,
          episodeName: episode.name,
          originalText: episode.originalText || '',
          selectedStyle: project.selectedStyle,
          projectCharacters: project.characters || [],
          projectEnvironments: project.environments || [],
          scenes: episode.scenes || [],
          viewMode: 'workbench',
          workflowStep: episode.workflowStep || 0,
          status: 'idle',
          isStyleSelectorOpen: false,
        });
      },

      deleteEpisode: (projectId, episodeId) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId ? { ...p, episodes: p.episodes.filter(e => e.id !== episodeId), updatedAt: Date.now() } : p
          ),
          ...(state.currentEpisodeId === episodeId ? { 
            currentEpisodeId: null, 
            viewMode: 'episodes' 
          } : {})
        }));
      },

      renameEpisode: (projectId, episodeId, newName) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId ? { 
              ...p, 
              episodes: p.episodes.map(e => e.id === episodeId ? { ...e, name: newName, updatedAt: Date.now() } : e),
              updatedAt: Date.now() 
            } : p
          ),
          ...(state.currentEpisodeId === episodeId ? { episodeName: newName } : {})
        }));
      },

      closeEpisode: () => {
        const state = get();
        if (state.currentEpisodeId) {
          state.saveCurrentState();
        }
        set({ currentEpisodeId: null, viewMode: 'episodes' });
      },

      projectName: '',
      setProjectName: (name) => {
        set({ projectName: name });
        get().saveCurrentState();
      },

      episodeName: '',
      setEpisodeName: (name) => {
        set({ episodeName: name });
        get().saveCurrentState();
      },
      
      originalText: '',
      setOriginalText: (text) => set({ originalText: text }),
      
      selectedStyle: null,
      setSelectedStyle: (style) => {
        set({ selectedStyle: style });
        get().saveCurrentState();
      },
      
      isStyleSelectorOpen: false,
      setIsStyleSelectorOpen: (isOpen) => set({ isStyleSelectorOpen: isOpen }),
      
      workflowStep: 0,
      setWorkflowStep: (step) => {
        set({ workflowStep: step });
        get().saveCurrentState();
      },

      status: 'idle',
      setStatus: (status) => set({ status }),
      
      projectCharacters: [],
      projectEnvironments: [],
      setProjectAssets: (characters, environments) => {
        set({ projectCharacters: characters, projectEnvironments: environments });
        get().saveCurrentState();
      },

      updateProjectAsset: (type, id, updates) => {
        set((state) => {
          if (type === 'character') {
            return {
              projectCharacters: state.projectCharacters.map(c => c.id === id ? { ...c, ...updates } : c)
            };
          } else {
            return {
              projectEnvironments: state.projectEnvironments.map(e => e.id === id ? { ...e, ...updates } : e)
            };
          }
        });
        get().saveCurrentState();
      },

      deleteProjectAsset: (type, id) => {
        set((state) => {
          if (type === 'character') {
            return { projectCharacters: state.projectCharacters.filter(c => c.id !== id) };
          } else {
            return { projectEnvironments: state.projectEnvironments.filter(e => e.id !== id) };
          }
        });
        get().saveCurrentState();
      },

      scenes: [],
      setScenes: (scenes) => {
        set({ scenes });
        get().saveCurrentState();
      },
      addScenes: (newScenes) => {
        set((state) => ({ scenes: [...state.scenes, ...newScenes] }));
        get().saveCurrentState();
      },
      updateScene: (id, updates) => {
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === id ? { ...scene, ...updates } : scene
          ),
        }));
        get().saveCurrentState();
      },
      deleteScene: (id) => {
        set((state) => ({
          scenes: state.scenes.filter(scene => scene.id !== id),
        }));
        get().saveCurrentState();
      },
      
      updateEpisode: (projectId, episodeId, updates) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId ? {
            ...p,
            episodes: p.episodes.map(e => 
              e.id === episodeId ? { ...e, ...updates, updatedAt: Date.now() } : e
            )
          } : p
        )
      })),

      setEpisodeWorkflowStep: (projectId, episodeId, step) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === projectId ? {
            ...p,
            episodes: p.episodes.map(e => 
              e.id === episodeId ? { ...e, workflowStep: step, updatedAt: Date.now() } : e
            )
          } : p
        )
      })),

      saveCurrentState: () => {
        const state = get();
        if (!state.currentProjectId) return;
        
        set((s) => ({
          projects: s.projects.map(p => {
            if (p.id === s.currentProjectId) {
              // Update Project level
              const updatedProject = {
                ...p,
                name: s.projectName,
                selectedStyle: s.selectedStyle,
                characters: s.projectCharacters,
                environments: s.projectEnvironments,
                updatedAt: Date.now(),
              };

              // Update Episode level if in workbench
              if (s.currentEpisodeId && updatedProject.episodes) {
                updatedProject.episodes = updatedProject.episodes.map(e => 
                  e.id === s.currentEpisodeId ? {
                    ...e,
                    name: s.episodeName,
                    originalText: s.originalText,
                    scenes: s.scenes,
                    workflowStep: s.workflowStep,
                    updatedAt: Date.now()
                  } : e
                );
              }
              return updatedProject;
            }
            return p;
          })
        }));
      }
    }),
    {
      name: 'ai-creator-storage',
      partialize: (state) => ({ 
        projects: state.projects, 
        viewMode: state.viewMode,
        currentProjectId: state.currentProjectId,
        currentEpisodeId: state.currentEpisodeId,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setTimeout(() => {
            const store = useStore.getState();
            if (state.viewMode === 'episodes' && state.currentProjectId) {
              store.openProject(state.currentProjectId);
            } else if (state.viewMode === 'workbench' && state.currentProjectId && state.currentEpisodeId) {
              store.openEpisode(state.currentProjectId, state.currentEpisodeId);
            }
          }, 0);
        }
      }
    }
  )
);
