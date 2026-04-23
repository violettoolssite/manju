import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, Key, Link2, Cpu, Video, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useStore, AppSettings } from '../store/useStore';
import { fetchAvailableModels } from '../utils/apiService';

// Preset configurations for different providers
const PROVIDER_CONFIGS = {
  text: {
    openai: { url: 'https://api.openai.com/v1', model: 'gpt-4o' },
    anthropic: { url: 'https://api.anthropic.com/v1', model: 'claude-3-5-sonnet-20240620' },
    google: { url: 'https://generativelanguage.googleapis.com/v1beta', model: 'gemini-1.5-pro' },
    deepseek: { url: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
    zhipu: { url: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4' },
    baichuan: { url: 'https://api.baichuan-ai.com/v1', model: 'Baichuan4' },
    wenxin: { url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop', model: 'ERNIE-4.0-8K' },
    qwen: { url: 'https://dashscope.aliyuncs.com/api/v1', model: 'qwen-max' },
    minimax: { url: 'https://api.minimax.chat/v1', model: 'abab6.5-chat' },
    moonshot: { url: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' }, // 注意: 浏览器直连会有 CORS 问题
    doubao: { url: 'https://ark.cn-beijing.volces.com/api/v3', model: 'ep-xxx-xxx' }, // 豆包需要用户自己填 endpoint id
    custom: { url: '', model: '' }
  },
  image: {
    dalle: { url: 'https://api.openai.com/v1', model: 'dall-e-3' },
    midjourney: { url: 'https://api.midjourney.com/v1', model: 'mj-v6' },
    stablediffusion: { url: 'https://api.stability.ai/v1', model: 'sd3-core' },
    zhipu_cogview: { url: 'https://open.bigmodel.cn/api/paas/v4', model: 'cogview-3' },
    wenxin_ernie_vilg: { url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop', model: 'ernie-vilg-v2.0' },
    moonshot: { url: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' }, // 仅供占位，实际可能不支持原生图生
    doubao: { url: 'https://ark.cn-beijing.volces.com/api/v3', model: 'ep-xxx-xxx' },
    custom: { url: '', model: '' }
  },
  video: {
    runway: { url: 'https://api.runwayml.com/v1', model: 'gen3a-turbo' },
    pika: { url: 'https://api.pikalabs.com/v1', model: 'pika-v2' },
    sora: { url: 'https://api.openai.com/v1', model: 'sora-1.0' },
    kling: { url: 'https://api.klingai.com/v1', model: 'kling-v1' },
    zhipu_cogvideo: { url: 'https://open.bigmodel.cn/api/paas/v4', model: 'cogvideox' },
    shengshu_vidu: { url: 'https://api.shengshu-ai.com/v1', model: 'vidu-v1' },
    doubao: { url: 'https://ark.cn-beijing.volces.com/api/v3', model: 'ep-xxx-xxx' },
    custom: { url: '', model: '' }
  }
};

const CustomComboBox: React.FC<{
  value: string;
  onChange: (value: string) => void;
  models: string[];
  placeholder: string;
  focusClass: string;
  activeTextClass: string;
}> = ({ value, onChange, models, placeholder, focusClass, activeTextClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayValue = isOpen ? filter : value;
  const filteredModels = models.filter(m => m.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <input
        type="text"
        value={displayValue}
        onChange={(e) => {
          if (!isOpen) setIsOpen(true);
          setFilter(e.target.value);
          onChange(e.target.value);
        }}
        onFocus={() => {
          setIsOpen(true);
          setFilter(value);
        }}
        className={`w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none transition-colors font-mono ${focusClass}`}
        placeholder={placeholder}
      />
      <AnimatePresence>
        {isOpen && models.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-50 top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto custom-scrollbar bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl"
          >
            {filteredModels.length > 0 ? (
              filteredModels.map((m) => (
                <div
                  key={m}
                  onClick={() => {
                    onChange(m);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm font-mono cursor-pointer transition-colors hover:bg-zinc-700 ${m === value ? `${activeTextClass} bg-zinc-900/50 font-bold` : 'text-zinc-300'}`}
                >
                  {m}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-zinc-500">未找到匹配的模型</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setIsSettingsModalOpen, settings, updateSettings } = useStore();
  
  const [textModels, setTextModels] = useState<string[]>([]);
  const [isFetchingText, setIsFetchingText] = useState(false);
  const [imageModels, setImageModels] = useState<string[]>([]);
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [videoModels, setVideoModels] = useState<string[]>([]);
  const [isFetchingVideo, setIsFetchingVideo] = useState(false);

  if (!isSettingsModalOpen) return null;

  const handleFetchModels = async (type: 'text' | 'image' | 'video') => {
    try {
      let provider = '', baseUrl = '', apiKey = '';
      if (type === 'text') {
        provider = settings.textAnalysisProvider;
        baseUrl = settings.textAnalysisBaseUrl;
        apiKey = settings.textAnalysisApiKey;
        setIsFetchingText(true);
      } else if (type === 'image') {
        provider = settings.imageGenerationProvider;
        baseUrl = settings.imageGenerationBaseUrl;
        apiKey = settings.imageGenerationApiKey;
        setIsFetchingImage(true);
      } else if (type === 'video') {
        provider = settings.videoGenerationProvider;
        baseUrl = settings.videoGenerationBaseUrl;
        apiKey = settings.videoGenerationApiKey;
        setIsFetchingVideo(true);
      }

      if (!baseUrl || !apiKey) {
        alert('请先填写完整的 Base URL 和 API Key');
        return;
      }

      const models = await fetchAvailableModels(provider, baseUrl, apiKey);
      
      if (type === 'text') {
        setTextModels(models);
        if (models.length > 0 && !models.includes(settings.textAnalysisModelName)) {
          handleChange('textAnalysisModelName', models[0]);
        }
      } else if (type === 'image') {
        setImageModels(models);
        if (models.length > 0 && !models.includes(settings.imageGenerationModelName)) {
          handleChange('imageGenerationModelName', models[0]);
        }
      } else if (type === 'video') {
        setVideoModels(models);
        if (models.length > 0 && !models.includes(settings.videoGenerationModelName)) {
          handleChange('videoGenerationModelName', models[0]);
        }
      }

      // 提示成功
      alert(`成功获取 ${models.length} 个可用模型`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      if (type === 'text') setIsFetchingText(false);
      if (type === 'image') setIsFetchingImage(false);
      if (type === 'video') setIsFetchingVideo(false);
    }
  };

  const handleChange = (key: keyof AppSettings, value: string) => {
    const updates: Partial<AppSettings> = { [key]: value };
    
    // Auto-update base URL and model name when provider changes
    if (key === 'textAnalysisProvider') {
      const config = PROVIDER_CONFIGS.text[value as keyof typeof PROVIDER_CONFIGS.text];
      updates.textAnalysisBaseUrl = config.url;
      updates.textAnalysisModelName = config.model;
    } else if (key === 'imageGenerationProvider') {
      const config = PROVIDER_CONFIGS.image[value as keyof typeof PROVIDER_CONFIGS.image];
      updates.imageGenerationBaseUrl = config.url;
      updates.imageGenerationModelName = config.model;
    } else if (key === 'videoGenerationProvider') {
      const config = PROVIDER_CONFIGS.video[value as keyof typeof PROVIDER_CONFIGS.video];
      updates.videoGenerationBaseUrl = config.url;
      updates.videoGenerationModelName = config.model;
    }

    updateSettings(updates);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSettingsModalOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-cyan-400">
                <Settings2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">全局模型设置</h2>
                <p className="text-zinc-400 text-xs mt-1">配置用于文本分析、图片生成与视频生成的第三方 API 密钥</p>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-8">
            
            {/* Text Analysis Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Cpu size={16} className="text-emerald-400" />
                文本分析大模型 (LLM)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500">模型提供商</label>
                  <select 
                    value={settings.textAnalysisProvider}
                    onChange={(e) => handleChange('textAnalysisProvider', e.target.value)}
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="openai">OpenAI (ChatGPT)</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                    <option value="google">Google (Gemini)</option>
                    <option value="deepseek">DeepSeek</option>
                    <option value="zhipu">智谱 AI (ChatGLM)</option>
                    <option value="baichuan">百川智能</option>
                    <option value="wenxin">百度 (文心一言)</option>
                    <option value="qwen">阿里 (通义千问)</option>
                    <option value="minimax">MiniMax</option>
                    <option value="moonshot">月之暗面 (Kimi)</option>
                    <option value="doubao">字节跳动 (豆包 Doubao)</option>
                    <option value="custom">自定义 (Custom / Local)</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    <Cpu size={12} /> Model Name (调用标识)
                  </label>
                  <div className="flex items-center gap-2">
                    <CustomComboBox
                      value={settings.textAnalysisModelName || ''}
                      onChange={(val) => handleChange('textAnalysisModelName', val)}
                      models={textModels}
                      placeholder="gpt-3.5-turbo"
                      focusClass="focus:border-emerald-500"
                      activeTextClass="text-emerald-400"
                    />
                    <button
                      onClick={() => handleFetchModels('text')}
                      disabled={isFetchingText}
                      title="通过 API 获取可用模型列表"
                      className="w-10 h-10 flex shrink-0 items-center justify-center bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-emerald-400 hover:border-emerald-500 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={isFetchingText ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    <Link2 size={12} /> Base URL
                  </label>
                  <input 
                    type="text"
                    value={settings.textAnalysisBaseUrl || ''}
                    onChange={(e) => handleChange('textAnalysisBaseUrl', e.target.value)}
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="https://api.openai.com/v1"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    <Key size={12} /> API Key
                  </label>
                  <input 
                    type="password"
                    value={settings.textAnalysisApiKey || ''}
                    onChange={(e) => handleChange('textAnalysisApiKey', e.target.value)}
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    placeholder="sk-..."
                  />
                </div>
              </div>
            </div>

            {/* Image Generation Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
                <ImageIcon size={16} className="text-cyan-400" />
                图片生成模型 (Image AI)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500">模型提供商</label>
                  <select 
                    value={settings.imageGenerationProvider}
                    onChange={(e) => handleChange('imageGenerationProvider', e.target.value)}
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="dalle">OpenAI (DALL-E 3)</option>
                    <option value="midjourney">Midjourney (API)</option>
                    <option value="stablediffusion">Stable Diffusion</option>
                    <option value="zhipu_cogview">智谱 AI (CogView)</option>
                    <option value="wenxin_ernie_vilg">百度 (文心一格)</option>
                    <option value="moonshot">月之暗面 (Kimi)</option>
                    <option value="doubao">字节跳动 (豆包 Doubao)</option>
                    <option value="custom">自定义 (Custom / Flux)</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    <ImageIcon size={12} /> Model Name (调用标识)
                  </label>
                  <div className="flex items-center gap-2">
                    <CustomComboBox
                      value={settings.imageGenerationModelName || ''}
                      onChange={(val) => handleChange('imageGenerationModelName', val)}
                      models={imageModels}
                      placeholder="dall-e-3"
                      focusClass="focus:border-cyan-500"
                      activeTextClass="text-cyan-400"
                    />
                    <button
                      onClick={() => handleFetchModels('image')}
                      disabled={isFetchingImage}
                      title="通过 API 获取可用模型列表"
                      className="w-10 h-10 flex shrink-0 items-center justify-center bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-cyan-400 hover:border-cyan-500 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={isFetchingImage ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    <Link2 size={12} /> Base URL
                  </label>
                  <input 
                    type="text"
                    value={settings.imageGenerationBaseUrl || ''}
                    onChange={(e) => handleChange('imageGenerationBaseUrl', e.target.value)}
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="https://api.openai.com/v1"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    <Key size={12} /> API Key
                  </label>
                  <input 
                    type="password"
                    value={settings.imageGenerationApiKey || ''}
                    onChange={(e) => handleChange('imageGenerationApiKey', e.target.value)}
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                    placeholder="sk-..."
                  />
                </div>
              </div>
            </div>

            {/* Video Generation Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Video size={16} className="text-fuchsia-400" />
                视频生成模型 (Video AI)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500">模型提供商</label>
                  <select
                    value={settings.videoGenerationProvider}
                    onChange={(e) => handleChange('videoGenerationProvider', e.target.value)}
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none focus:border-fuchsia-500 transition-colors"
                  >
                    <option value="runway">Runway (Gen-2 / Gen-3)</option>
                    <option value="pika">Pika Labs</option>
                    <option value="sora">OpenAI (Sora)</option>
                    <option value="kling">快手 (可灵 Kling)</option>
                    <option value="zhipu_cogvideo">智谱 AI (CogVideo)</option>
                    <option value="shengshu_vidu">生数科技 (Vidu)</option>
                    <option value="doubao">字节跳动 (豆包 Doubao)</option>
                    <option value="custom">自定义 (Custom)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    <Video size={12} /> Model Name (调用标识)
                  </label>
                  <div className="flex items-center gap-2">
                    <CustomComboBox
                      value={settings.videoGenerationModelName || ''}
                      onChange={(val) => handleChange('videoGenerationModelName', val)}
                      models={videoModels}
                      placeholder="gen3a-turbo"
                      focusClass="focus:border-fuchsia-500"
                      activeTextClass="text-fuchsia-400"
                    />
                    <button
                      onClick={() => handleFetchModels('video')}
                      disabled={isFetchingVideo}
                      title="通过 API 获取可用模型列表"
                      className="w-10 h-10 flex shrink-0 items-center justify-center bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-fuchsia-400 hover:border-fuchsia-500 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={isFetchingVideo ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    <Link2 size={12} /> Base URL
                  </label>
                  <input
                    type="text"
                    value={settings.videoGenerationBaseUrl || ''}
                    onChange={(e) => handleChange('videoGenerationBaseUrl', e.target.value)}
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none focus:border-fuchsia-500 transition-colors"
                    placeholder="https://api.runwayml.com/v1"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                    <Key size={12} /> API Key
                  </label>
                  <input
                    type="password"
                    value={settings.videoGenerationApiKey || ''}
                    onChange={(e) => handleChange('videoGenerationApiKey', e.target.value)}
                    className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none focus:border-fuchsia-500 transition-colors font-mono"
                    placeholder="sk-..."
                  />
                </div>
              </div>
            </div>

          </div>
          
          <div className="p-6 border-t border-zinc-800 bg-zinc-900 flex justify-end shrink-0">
            <button
              onClick={() => setIsSettingsModalOpen(false)}
              className="bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              保存并关闭
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};