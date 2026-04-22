import { Scene, StyleOption, CharacterAsset, EnvironmentAsset } from '../store/useStore';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const MOCK_STYLES: StyleOption[] = [
  {
    id: 'cyberpunk',
    name: '赛博朋克 (Cyberpunk)',
    description: '霓虹闪烁的未来都市，雨夜，高对比度色彩，强烈的科技与衰败对比。光影丰富，具有全息投影质感。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cyberpunk%20city%20neon%20rain%20futuristic&image_size=landscape_16_9',
  },
  {
    id: 'ghibli',
    name: '吉卜力动画风 (Ghibli)',
    description: '清新自然的手绘水彩风格，宫崎骏电影质感。明亮的蓝天白云，丰富的自然光，生动活泼的色彩表现。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=studio%20ghibli%20anime%20beautiful%20landscape%20sky&image_size=landscape_16_9',
  },
  {
    id: 'cinematic',
    name: '写实电影 (Cinematic)',
    description: '好莱坞大片质感，8K超高清，真实物理光影，浅景深虚化背景，色彩偏冷峻严肃的叙事风格。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cinematic%20shot%20movie%20scene%208k%20realistic&image_size=landscape_16_9',
  },
  {
    id: 'ink',
    name: '东方水墨 (Ink Wash)',
    description: '中国传统水墨画风格，黑白灰为主色调，注重留白和意境，线条飘逸，带有一丝禅意和神秘感。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traditional%20chinese%20ink%20wash%20painting%20landscape&image_size=landscape_16_9',
  }
];

export const generateThreeViewImage = async (type: 'character' | 'environment', name: string, styleName: string): Promise<string> => {
  await delay(1500); // Simulate API call for 3D view generation
  const encodedPrompt = encodeURIComponent(`(Style: ${styleName}) multiple views, orthographic projection, front side back view of ${type} ${name}, concept art, reference sheet, masterpiece`);
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=landscape_16_9`;
};

export const parseTextToScenes = async (
  text: string, 
  style: StyleOption, 
  existingCharacters: CharacterAsset[], 
  existingEnvironments: EnvironmentAsset[],
  startIndex: number = 0
): Promise<{ scenes: Scene[], characters: CharacterAsset[], environments: EnvironmentAsset[] }> => {
  await delay(2000); // Simulate AI parsing delay

  const segments = text.split(/[\n。！？]/).filter(s => s.trim().length > 5);
  const scenes: Scene[] = [];
  
  // Clone existing assets to mutate and return
  const currentCharacters = [...existingCharacters];
  const currentEnvironments = [...existingEnvironments];

  for (let i = 0; i < Math.min(segments.length, 4); i++) {
    const segment = segments[i];
    
    // Mock parsing logic: extract character and environment
    let charName = segment.includes('她') || segment.includes('女孩') ? '神秘少女' : '男主角';
    let envName = segment.includes('房间') || segment.includes('内') ? '室内基地' : '赛博街道';

    // Check if character exists, else create new
    let character = currentCharacters.find(c => c.name === charName);
    if (!character) {
      const threeViewUrl = await generateThreeViewImage('character', charName, style.name);
      character = {
        id: `char-${Date.now()}-${Math.random()}`,
        name: charName,
        description: `自动提取的特征：${charName}。关联文本：${segment.substring(0, 10)}...`,
        threeViewUrl
      };
      currentCharacters.push(character);
    }

    // Check if environment exists, else create new
    let environment = currentEnvironments.find(e => e.name === envName);
    if (!environment) {
      const threeViewUrl = await generateThreeViewImage('environment', envName, style.name);
      environment = {
        id: `env-${Date.now()}-${Math.random()}`,
        name: envName,
        description: `自动提取的场景：${envName}。关联文本：${segment.substring(0, 10)}...`,
        threeViewUrl
      };
      currentEnvironments.push(environment);
    }

    const isContinuous = i > 0 && scenes[i - 1]?.environment === envName; // Use environment logic for continuity

    scenes.push({
      id: `scene-${startIndex + i + 1}-${Date.now()}`,
      sceneName: `分镜 ${startIndex + i + 1}`,
      description: segment.substring(0, 50) + (segment.length > 50 ? '...' : ''),
      characters: [character.name],
      environment: environment.name,
      actions: ['观察', '交互'],
      optimizedPrompt: `(Style: ${style.name}) [Character: ${character.name}] in [Environment: ${environment.name}], ${segment.substring(0, 30)} - detailed, masterpiece, highly detailed`,
      isContinuous,
      status: 'pending',
    });
  }

  return { scenes, characters: currentCharacters, environments: currentEnvironments };
};

export const generateImageForScene = async (scene: Scene): Promise<string> => {
  await delay(2000); // Simulate image generation
  const encodedPrompt = encodeURIComponent(scene.optimizedPrompt);
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=landscape_16_9`;
};

export const generateVideoForScene = async (scene: Scene, previousFrameUrl?: string): Promise<{ videoUrl: string, lastFrameUrl: string }> => {
  await delay(3000); // Simulate video generation
  // Mock video URL: using a reliable demo video URL from W3C
  const mockVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
  return {
    videoUrl: mockVideoUrl,
    lastFrameUrl: scene.imageUrl || '',
  };
};