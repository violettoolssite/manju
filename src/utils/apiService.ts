import { Scene, StyleOption, CharacterAsset, EnvironmentAsset, AppSettings } from '../store/useStore';

export const MOCK_STYLES: StyleOption[] = [
  // 1. 写实/摄影风格
  {
    id: 'cinematic',
    name: '写实电影 (Cinematic)',
    description: '好莱坞大片质感，8K超高清，真实物理光影，浅景深虚化背景，色彩偏冷峻严肃的叙事风格。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cinematic%20shot%20movie%20scene%208k%20realistic&image_size=landscape_16_9',
  },
  {
    id: 'photography_portrait',
    name: '人像摄影 (Portrait Photo)',
    description: '专业影棚打光，85mm镜头特写，极高的人物细节，真实的皮肤纹理，柔和的背景虚化。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20portrait%20photography%2085mm%20lens%20studio%20lighting&image_size=landscape_16_9',
  },
  {
    id: 'documentary',
    name: '纪实纪实 (Documentary)',
    description: '真实、粗糙的质感，颗粒感强，自然光线，偏向人文纪实的胶片摄影风格。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=documentary%20photography%20street%20raw%20film%20grain&image_size=landscape_16_9',
  },
  {
    id: 'polaroid',
    name: '胶片复古 (Polaroid/Film)',
    description: '浓郁的复古色调，轻微的漏光和暗角，色彩偏暖，具有老式拍立得或胶片相机的怀旧感。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=polaroid%20vintage%20film%20photography%20light%20leaks%20warm%20tones&image_size=landscape_16_9',
  },
  {
    id: 'macro',
    name: '微距特写 (Macro)',
    description: '极端的微距视角，放大微小细节，极浅的景深，适合展示昆虫、植物或精细物品的纹理。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=extreme%20macro%20photography%20tiny%20details%20shallow%20depth%20of%20field&image_size=landscape_16_9',
  },

  // 2. 动画/二次元风格
  {
    id: 'ghibli',
    name: '吉卜力动画 (Ghibli)',
    description: '清新自然的手绘水彩风格，宫崎骏电影质感。明亮的蓝天白云，丰富的自然光，生动活泼的色彩表现。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=studio%20ghibli%20anime%20beautiful%20landscape%20sky&image_size=landscape_16_9',
  },
  {
    id: 'makoto_shinkai',
    name: '新海诚风 (Makoto Shinkai)',
    description: '极其绚丽的天空，精细的光影折射，唯美且带有一丝忧郁的现代都市或自然风景。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=makoto%20shinkai%20style%20anime%20beautiful%20sky%20clouds%20lighting&image_size=landscape_16_9',
  },
  {
    id: 'retro_anime',
    name: '90年代复古动画 (90s Anime)',
    description: '经典的赛璐璐手绘质感，色彩饱和度略低，具有复古电视扫描线效果，经典的日式角色设计。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=1990s%20retro%20anime%20style%20cel%20shading%20vintage%20vhs&image_size=landscape_16_9',
  },
  {
    id: 'spiderverse',
    name: '蜘蛛侠平行宇宙风 (Spider-Verse)',
    description: '结合了3D与2D漫画网点效果，高饱和度色彩，带有半调网点、错位印刷和强烈的街头涂鸦感。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=spider-verse%20style%20comic%20book%20halftone%20dots%20vibrant%20colors%20graffiti&image_size=landscape_16_9',
  },
  {
    id: 'pixar',
    name: '皮克斯3D动画 (Pixar 3D)',
    description: '圆润可爱的人物设计，极佳的材质表现（如毛发、布料），色彩明快，适合家庭向故事。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=pixar%20style%203d%20animation%20cute%20characters%20vibrant%20lighting&image_size=landscape_16_9',
  },
  {
    id: 'arcane',
    name: '双城之战风 (Arcane/League)',
    description: '厚涂油画质感的3D，边缘锐利，光影戏剧化，带有蒸汽朋克与魔法结合的废土美学。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=arcane%20league%20of%20legends%20style%20painterly%203d%20dramatic%20lighting&image_size=landscape_16_9',
  },

  // 3. 国风/东方美学
  {
    id: 'ink',
    name: '东方水墨 (Ink Wash)',
    description: '中国传统水墨画风格，黑白灰为主色调，注重留白和意境，线条飘逸，带有一丝禅意和神秘感。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traditional%20chinese%20ink%20wash%20painting%20landscape&image_size=landscape_16_9',
  },
  {
    id: 'gongbi',
    name: '工笔画 (Gongbi)',
    description: '线条细腻严谨，色彩清丽典雅，注重细节刻画，常用于表现花鸟或古代仕女。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=chinese%20gongbi%20painting%20meticulous%20brush%20technique%20elegant%20colors&image_size=landscape_16_9',
  },
  {
    id: 'dunhuang',
    name: '敦煌壁画风 (Dunhuang)',
    description: '浓郁的矿物颜料色彩（石绿、朱砂、土黄），线条飞动，带有强烈的西域异域风情和佛教神话色彩。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dunhuang%20murals%20style%20buddhist%20art%20mineral%20pigments%20flying%20apsaras&image_size=landscape_16_9',
  },
  {
    id: 'wuxia',
    name: '新中式武侠 (Wuxia Fantasy)',
    description: '结合现代CG技术的仙侠/武侠风，衣袂飘飘，光效华丽，场景多为竹林、雪山或宏伟的古代宫殿。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=wuxia%20xianxia%20fantasy%20chinese%20martial%20arts%20epic%20scenery%20cg&image_size=landscape_16_9',
  },
  {
    id: 'national_tide',
    name: '国潮插画 (National Tide)',
    description: '将传统中国元素与现代波普、街头艺术结合，色彩对比强烈，常用红绿撞色，极具视觉冲击力。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=chinese%20guochao%20national%20tide%20illustration%20pop%20art%20vibrant%20colors&image_size=landscape_16_9',
  },

  // 4. 科幻/奇幻/特摄
  {
    id: 'cyberpunk',
    name: '赛博朋克 (Cyberpunk)',
    description: '霓虹闪烁的未来都市，雨夜，高对比度色彩，强烈的科技与衰败对比。光影丰富，具有全息投影质感。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cyberpunk%20city%20neon%20rain%20futuristic&image_size=landscape_16_9',
  },
  {
    id: 'steampunk',
    name: '蒸汽朋克 (Steampunk)',
    description: '维多利亚时代背景，大量黄铜、齿轮、蒸汽机械元素，色调偏复古棕黄，充满工业革命的浪漫想象。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=steampunk%20victorian%20era%20brass%20gears%20steam%20machinery%20sepia&image_size=landscape_16_9',
  },
  {
    id: 'space_opera',
    name: '太空歌剧 (Space Opera)',
    description: '宏大的宇宙场景，巨大的星舰，异星地貌，绚丽的星云与极光，史诗般的科幻视觉。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=space%20opera%20epic%20sci-fi%20massive%20spaceships%20nebula%20alien%20planet&image_size=landscape_16_9',
  },
  {
    id: 'dark_fantasy',
    name: '暗黑奇幻 (Dark Fantasy)',
    description: '哥特式建筑，阴冷暗淡的色调，恐怖与奇幻交织，怪物设计扭曲猎奇，类似《黑暗之魂》的美学。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dark%20fantasy%20gothic%20gloomy%20monsters%20bloodborne%20style&image_size=landscape_16_9',
  },
  {
    id: 'tokusatsu',
    name: '特摄皮套风 (Tokusatsu)',
    description: '经典的日式特摄质感，皮套怪兽，微缩模型城市，爆炸火花真实，类似奥特曼或假面骑士的视觉效果。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=tokusatsu%20kaiju%20miniature%20city%20practical%20effects%20sparks%20ultraman%20style&image_size=landscape_16_9',
  },

  // 5. 艺术绘画流派
  {
    id: 'oil_painting',
    name: '古典油画 (Classic Oil)',
    description: '文艺复兴或巴洛克时期的油画质感，笔触厚重，光影柔和（伦勃朗光），充满历史沉淀感。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=classical%20oil%20painting%20renaissance%20rembrandt%20lighting%20brushstrokes&image_size=landscape_16_9',
  },
  {
    id: 'impressionism',
    name: '印象派 (Impressionism)',
    description: '强调光线和色彩的变化，笔触细碎且明显，不注重清晰的轮廓，如莫奈或梵高的画风。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=impressionism%20painting%20monet%20style%20visible%20brushstrokes%20light%20and%20color&image_size=landscape_16_9',
  },
  {
    id: 'watercolor',
    name: '清新水彩 (Watercolor)',
    description: '透明感强，色彩边缘有水渍晕染效果，画面明快轻盈，适合治愈系或童话故事。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=beautiful%20watercolor%20painting%20translucent%20washes%20soft%20edges&image_size=landscape_16_9',
  },
  {
    id: 'ukiyo_e',
    name: '浮世绘 (Ukiyo-e)',
    description: '日本江户时代的木版画风格，色彩平涂，线条流畅，常包含海浪、富士山、歌舞伎等元素。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=japanese%20ukiyo-e%20woodblock%20print%20great%20wave%20flat%20colors&image_size=landscape_16_9',
  },
  {
    id: 'pop_art',
    name: '波普艺术 (Pop Art)',
    description: '高度饱和的纯色块，粗黑的轮廓线，半调网点背景，类似安迪·沃霍尔的波普风格。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=pop%20art%20andy%20warhol%20style%20vibrant%20colors%20halftone%20patterns%20bold%20lines&image_size=landscape_16_9',
  },

  // 6. 现代设计与特殊视觉
  {
    id: 'low_poly',
    name: '低多边形 (Low Poly)',
    description: '使用少量的多边形块面构建的3D模型风格，几何感极强，色彩明亮，带有可爱的独立游戏质感。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=low%20poly%203d%20isometric%20cute%20geometric%20flat%20colors&image_size=landscape_16_9',
  },
  {
    id: 'voxel',
    name: '体素风 (Voxel Art)',
    description: '由3D像素块（如《我的世界》）堆砌而成的场景，复古又具有立体感，适合沙盒游戏主题。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=voxel%20art%203d%20pixel%20blocks%20minecraft%20style%20cute%20diorama&image_size=landscape_16_9',
  },
  {
    id: 'paper_cut',
    name: '剪纸层叠 (Paper Cutout)',
    description: '多层纸张叠加形成的空间感，带有剪纸边缘和柔和的投影，充满童话和手工艺的温馨气息。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=layered%20paper%20cutout%20art%203d%20shadows%20craft%20fairytale&image_size=landscape_16_9',
  },
  {
    id: 'synthwave',
    name: '合成器波 (Synthwave/Outrun)',
    description: '80年代复古未来主义，紫红色和青色的霓虹网格，落日，跑车，极具动感和电子音乐氛围。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=synthwave%20outrun%2080s%20retro%20neon%20grid%20sunset%20purple%20cyan&image_size=landscape_16_9',
  },
  {
    id: 'claymation',
    name: '黏土动画 (Claymation)',
    description: '逼真的橡皮泥或黏土材质，带有手工捏塑的指纹痕迹，光影真实，类似《超级无敌掌门狗》的风格。',
    thumbnail: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=claymation%20stop%20motion%20animation%20plasticine%20realistic%20materials%20fingerprints&image_size=landscape_16_9',
  }
];

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ==============
// Text Analysis (LLM)
// ==============
export const fetchAvailableModels = async (provider: string, baseUrl: string, apiKey: string): Promise<string[]> => {
  if (!baseUrl || !apiKey) throw new ApiError("需要配置 Base URL 和 API Key 才能获取模型列表。");
  try {
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const url = normalizedBaseUrl.endsWith('/chat/completions')
      ? normalizedBaseUrl.replace('/chat/completions', '/models')
      : `${normalizedBaseUrl}/models`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (provider === 'anthropic') {
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new ApiError(`获取模型失败: ${res.status} ${errData.error?.message || res.statusText}`);
    }

    const data = await res.json();
    if (data && Array.isArray(data.data)) {
      return data.data.map((m: any) => m.id);
    }
    if (data && Array.isArray(data)) {
      return data.map((m: any) => m.id || m);
    }
    return [];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`网络错误: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const parseTextToScenes = async (
  text: string,
  style: StyleOption,
  existingCharacters: CharacterAsset[],
  existingEnvironments: EnvironmentAsset[],
  startIndex: number,
  settings: AppSettings,
  projectSettings: { aspectRatio: string; frameLayout: string }
): Promise<{ scenes: Scene[], characters: CharacterAsset[], environments: EnvironmentAsset[] }> => {
  if (!settings.textAnalysisApiKey) {
    throw new ApiError("请先在设置中配置文本分析大模型的 API Key。");
  }

  const prompt = `
你是一个专业的影视分镜师和AI提示词专家。请将以下文本解析为视频分镜脚本。
当前全局视觉风格为: ${style.name} (${style.description})
全局画面要求: 
- 比例: ${projectSettings.aspectRatio}
- 画面排版: ${projectSettings.frameLayout === 'double' ? '双格图（上下/左右分屏对照）' : '单格图（常规满屏）'}
已有的角色列表：${existingCharacters.map(c => c.name).join(', ') || '无'}
已有的场景列表：${existingEnvironments.map(e => e.name).join(', ') || '无'}

要求：
1. 提取所有出场人物，包含名称和详细的外貌特征描述。如果人物在已有的角色列表中已存在，请保持名字完全一致。
2. 提取所有场景/环境，包含名称和详细描述。如果在已有的场景列表中已存在，请保持名字完全一致。
3. 将文本划分为连续的场景(Scene)。
4. 为每个场景生成 optimizedPrompt（用于AI图像生成），该提示词必须是**纯英文**，不仅要包含人物长相、衣着、动作、环境光影、摄像机镜头，还必须包含以下强约束：
   "NO text, NO subtitles, NO watermarks. Layout: ${projectSettings.frameLayout === 'double' ? 'split-screen double frame' : 'single frame'}. Character features and clothing state MUST perfectly match the reference and remain strictly consistent. Do not change clothing state unless explicitly specified."
5. 必须返回标准的JSON格式，不要包含任何markdown标记（如 \`\`\`json ），不要包含任何其他解释性文字。直接输出从 { 开始的合法 JSON 字符串。

JSON格式如下：
{
  "characters": [{ "name": "角色名", "description": "简短描述特征，若为已有角色则无需提取" }],
  "environments": [{ "name": "场景名", "description": "简短描述特征，若为已有场景则无需提取" }],
  "scenes": [
    {
      "sceneName": "分镜 1",
      "description": "该分镜的画面描述",
      "dialogue": "角色说话的内容（如果没有则为空字符串）",
      "characterName": "画面主要角色名",
      "environmentName": "画面场景名",
      "actions": ["动作1", "动作2"],
      "optimizedPrompt": "英文，结合风格、比例、布局和防崩坏约束的详细Midjourney/DALL-E提示词"
    }
  ]
}

原文本：
${text}
  `;

  try {
    let responseText = '';

    if (settings.textAnalysisProvider === 'anthropic') {
      // Anthropic format
      const res = await fetch(`${settings.textAnalysisBaseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': settings.textAnalysisApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: settings.textAnalysisModelName || 'claude-3-haiku-20240307',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new ApiError(`文本分析请求失败: ${res.status} ${errData.error?.message || res.statusText}`);
      }

      const data = await res.json();
      responseText = data.content[0].text;
    } else {
      // General OpenAI compatible format for most providers (OpenAI, DeepSeek, Zhipu, Kimi, Doubao, Minimax, etc.)
      const res = await fetch(`${settings.textAnalysisBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.textAnalysisApiKey}`
        },
        body: JSON.stringify({
          model: settings.textAnalysisModelName || 'gpt-3.5-turbo', // Many providers accept this generic identifier or will default
          messages: [{ role: 'user', content: prompt }]
        })
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new ApiError(`文本分析请求失败: ${res.status} ${errData.error?.message || res.statusText}`);
      }
      
      const data = await res.json();
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        responseText = data.choices[0].message.content;
      } else {
        throw new ApiError(`接口返回成功，但找不到 choices[0].message.content，原始返回数据: ${JSON.stringify(data)}`);
      }
    }

    // Attempt to extract JSON from response safely
    let result;
    try {
      // 兼容一些模型可能会包裹在 markdown 里
      let cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonStrMatch = cleanText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonStrMatch ? jsonStrMatch[0] : cleanText;
      
      console.log("=== 大模型原始返回内容 ===");
      console.log(responseText);
      console.log("=== 尝试解析的 JSON 字符串 ===");
      console.log(jsonStr);
      
      result = JSON.parse(jsonStr);
    } catch (e) {
      console.error("JSON 解析失败的原文:", responseText);
      throw new SyntaxError(`模型返回的数据格式无法解析，请检查控制台日志获取模型原文。`);
    }

    const currentCharacters = [...existingCharacters];
    const currentEnvironments = [...existingEnvironments];

    // Append new characters without 3D views initially
    for (const char of result.characters || []) {
      if (!currentCharacters.find(c => c.name === char.name)) {
        currentCharacters.push({
          id: `char-${Date.now()}-${Math.random()}`,
          name: char.name,
          description: char.description,
          threeViewUrl: ''
        });
      }
    }

    // Append new environments without 3D views initially
    for (const env of result.environments || []) {
      if (!currentEnvironments.find(e => e.name === env.name)) {
        currentEnvironments.push({
          id: `env-${Date.now()}-${Math.random()}`,
          name: env.name,
          description: env.description,
          threeViewUrl: ''
        });
      }
    }

    const scenes: Scene[] = result.scenes.map((s: any, i: number) => {
      const isContinuous = i > 0 && result.scenes[i - 1]?.environmentName === s.environmentName;
      return {
        id: `scene-${startIndex + i + 1}-${Date.now()}`,
        sceneName: s.sceneName || `分镜 ${startIndex + i + 1}`,
        description: s.description,
        dialogue: s.dialogue || '',
        characters: s.characterName ? [s.characterName] : [],
        environment: s.environmentName || '未知场景',
        actions: s.actions || [],
        optimizedPrompt: s.optimizedPrompt,
        isContinuous,
        status: 'pending',
      };
    });

    return { scenes, characters: currentCharacters, environments: currentEnvironments };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof SyntaxError) throw new ApiError("模型返回的数据格式无法解析，请重试。");
    throw new ApiError(`网络或未知错误: ${error instanceof Error ? error.message : String(error)}`);
  }
};


// ==============
// Image Generation
// ==============
export const regeneratePromptForScene = async (
  scene: Scene,
  style: StyleOption,
  settings: AppSettings,
  projectSettings: { aspectRatio: string; frameLayout: string }
): Promise<string> => {
  if (!settings.textAnalysisApiKey) {
    throw new ApiError("请先在设置中配置文本分析大模型的 API Key。");
  }

  const prompt = `
你是一个专业的影视分镜师和AI提示词专家。请为以下场景重新生成一段纯英文的AI图像生成提示词（optimizedPrompt）。
当前全局视觉风格为: ${style.name} (${style.description})
全局画面要求:
- 比例: ${projectSettings.aspectRatio}
- 画面排版: ${projectSettings.frameLayout === 'double' ? '双格图（上下/左右分屏对照）' : '单格图（常规满屏）'}

当前场景信息：
- 场景名：${scene.sceneName}
- 场景描述：${scene.description}
- 动作：${scene.actions.join(', ')}
- 对白：${scene.dialogue || '无'}

要求：
1. 提示词必须是**纯英文**。
2. 必须包含人物长相、衣着、动作、环境光影、摄像机镜头。
3. 必须包含以下强约束：
   "NO text, NO subtitles, NO watermarks. Layout: ${projectSettings.frameLayout === 'double' ? 'split-screen double frame' : 'single frame'}. Character features and clothing state MUST perfectly match the reference and remain strictly consistent. Do not change clothing state unless explicitly specified."
4. 请直接输出纯文本的提示词，不要包含任何前缀、解释性文字、或引号包裹。不要输出JSON格式。
`;

  try {
    let url = `${settings.textAnalysisBaseUrl}/chat/completions`;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.textAnalysisApiKey}`
    };

    let body: any = {
      model: settings.textAnalysisModelName,
      messages: [{ role: 'user', content: prompt }]
    };

    if (settings.textAnalysisProvider === 'anthropic') {
      url = `${settings.textAnalysisBaseUrl}/messages`;
      headers = {
        'Content-Type': 'application/json',
        'x-api-key': settings.textAnalysisApiKey,
        'anthropic-version': '2023-06-01'
      };
      body = {
        model: settings.textAnalysisModelName,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new ApiError(`大模型提示词重新生成失败: ${errData.error?.message || res.statusText}`);
    }

    const data = await res.json();
    let newPrompt = '';

    if (settings.textAnalysisProvider === 'anthropic') {
      newPrompt = data.content[0].text;
    } else {
      newPrompt = data.choices[0].message.content;
    }

    return newPrompt.trim();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`网络请求失败: ${error.message}`);
  }
};

// NOTE: Since the user specifically requested no mocking, but standard OpenAI/Anthropic APIs don't do native 3D views or consistent video easily without very specific paid endpoints (like Midjourney/Runway),
// We will still use a direct HTTP call for image generation if a generic image generation is needed. 
// For safety, we'll try to use standard OpenAI DALL-E 3 if the text provider is OpenAI, otherwise fallback to the built-in demo URL generator but wrapped in a try/catch.
// However, the prompt specifically said "All data should not be mocked, if there is an error, optimize to a friendly error prompt".

export const generateThreeViewImage = async (type: 'character' | 'environment', name: string, styleName: string, settings: AppSettings, projectSettings: { aspectRatio: string; frameLayout: string }): Promise<string> => {
  if (!settings.imageGenerationApiKey) {
     throw new ApiError("请配置图片生成模型的 API Key 以生成三视图。");
  }

  const prompt = `(Style: ${styleName}) multiple views, orthographic projection, front side back view of ${type} ${name}, concept art, reference sheet, masterpiece`;
  
  try {
      // 大多数主流生图API（豆包、智谱、Moonshot等）都兼容 OpenAI 的 /images/generations 端点格式
        const requestBody: any = {
          model: settings.imageGenerationModelName || "doubao-seedream-5-0-260128",
          prompt: prompt,
          size: "1024x1024"
        };
        
        // 豆包 API 不支持 size 参数的某些特殊组合或某些情况下会报错
        if (settings.imageGenerationProvider === 'doubao') {
          delete requestBody.size;
        }

        const res = await fetch(`${settings.imageGenerationBaseUrl}/images/generations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${settings.imageGenerationApiKey}`
            },
            body: JSON.stringify(requestBody)
          });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new ApiError(`三视图生成失败: ${errData.error?.message || errData.message || res.statusText}`);
      }

      const data = await res.json();
      return data.data[0].url;
    } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`图片生成网络错误: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const generateImageForScene = async (scene: Scene, settings: AppSettings, projectSettings: { aspectRatio: string; frameLayout: string }): Promise<string> => {
  if (!settings.imageGenerationApiKey) {
    throw new ApiError("请先在设置中配置图片生成大模型的 API Key。");
  }

  // Inject negative constraints and specific layout requirements to image prompt
  const safetyPrompt = `NO text, NO subtitles, NO watermarks, NO typography. Frame layout: ${projectSettings.frameLayout === 'double' ? 'split-screen double frame' : 'single frame'}. Character features and clothing state MUST perfectly match the reference and remain strictly consistent.`;
  const finalPrompt = `${scene.optimizedPrompt}, ${safetyPrompt}`;

  // Map Aspect Ratio for Doubao (they support standard string sizes)
    let mappedSize = "1024x1024";
    if (projectSettings.aspectRatio === '16:9') mappedSize = "1920x1080";
    else if (projectSettings.aspectRatio === '9:16') mappedSize = "1080x1920";

    try {
        const requestBody: any = {
          model: settings.imageGenerationModelName || "doubao-seedream-5-0-260128",
          prompt: finalPrompt,
          size: mappedSize
        };

        if (settings.imageGenerationProvider === 'doubao') {
          delete requestBody.size;
        }

        const res = await fetch(`${settings.imageGenerationBaseUrl}/images/generations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${settings.imageGenerationApiKey}`
            },
            body: JSON.stringify(requestBody)
          });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new ApiError(`分镜图生成失败: ${errData.error?.message || errData.message || res.statusText}`);
      }

      const data = await res.json();
      return data.data[0].url;
    } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`分镜图生成网络错误: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// ==============
// Video Generation
// ==============
export const generateVideoForScene = async (scene: Scene, settings: AppSettings, previousFrameUrl: string, projectSettings: { aspectRatio: string; frameLayout: string }): Promise<{ videoUrl: string, lastFrameUrl: string }> => {
  if (!settings.videoGenerationApiKey) {
    throw new ApiError("请配置视频生成模型的 API Key。");
  }

  // Inject strict video negative constraints
  const videoConstraints = `CRITICAL REQUIREMENTS: NO text, NO subtitles, NO watermarks. NO clipping or mesh intersection. NO flickering. NO sudden appearance or disappearance of characters. Character features and clothing state MUST remain strictly consistent throughout the entire video sequence. Smooth transitions only.`;
  const finalPrompt = `${scene.optimizedPrompt}. ${videoConstraints}`;

  try {
      if (settings.videoGenerationProvider === 'doubao') {
        const res = await fetch(`${settings.videoGenerationBaseUrl}/contents/generations/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.videoGenerationApiKey}`
          },
          body: JSON.stringify({
            model: settings.videoGenerationModelName || "ep-20260423082019-m5h7z",
            content: [
              {
                type: "text",
                text: finalPrompt
              },
              {
                type: "image_url",
                image_url: {
                  url: scene.imageUrl
                }
              }
            ],
            ratio: projectSettings.aspectRatio,
            duration: 5,
            watermark: true,
            camerafixed: false
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new ApiError(`火山引擎视频生成请求失败: ${res.status} ${errData.error?.message || errData.message || res.statusText}`);
        }

        const data = await res.json();
          const taskId = data.id || data.task_id || data.data?.id;

          if (!taskId) {
            throw new ApiError(`任务创建成功，但未能获取到 taskId。原始返回: ${JSON.stringify(data)}`);
          }

          // Polling loop
          let attempts = 0;
          const maxAttempts = 60; // 30 mins max if 30s per poll
          while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds delay
            
            const getRes = await fetch(`${settings.videoGenerationBaseUrl}/contents/generations/tasks/${taskId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${settings.videoGenerationApiKey}`
              }
            });

            if (!getRes.ok) {
              const errData = await getRes.json().catch(() => ({}));
              throw new ApiError(`查询视频状态失败: ${errData.error?.message || getRes.statusText}`);
            }

            const getResult = await getRes.json();
            const status = getResult.status || getResult.data?.status;

            if (status === 'succeeded' || status === 'SUCCEEDED') {
              // Different API versions might return the video URL in different paths
              const videoUrl = getResult.content?.video_url || getResult.video_url || getResult.data?.video_url || getResult.content?.[0]?.video_url?.url;
              if (!videoUrl) {
                throw new ApiError(`任务显示成功，但找不到视频链接。返回数据: ${JSON.stringify(getResult)}`);
              }
              return {
                videoUrl: videoUrl,
                lastFrameUrl: scene.imageUrl || ''
              };
            } else if (status === 'failed' || status === 'FAILED') {
              throw new ApiError(`视频生成任务失败: ${getResult.error?.message || getResult.message || '未知错误'}`);
            }
            
            attempts++;
          }

          throw new ApiError("火山引擎视频生成任务超时 (超过 30 分钟)。请稍后在控制台查看。");
      } else {
        const res = await fetch(`${settings.videoGenerationBaseUrl}/videos/generations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.videoGenerationApiKey}`
          },
          body: JSON.stringify({
            model: settings.videoGenerationModelName || 'gen3a-turbo',
            promptText: finalPrompt,
            promptImage: scene.imageUrl,
            seedImage: scene.isContinuous ? previousFrameUrl : undefined, // Frame continuity
            aspect_ratio: projectSettings.aspectRatio
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new ApiError(`视频生成请求失败: ${res.status} ${errData.error?.message || errData.message || res.statusText}。可能是由于未正确配置第三方 API 路由或密钥无效。`);
        }

        const data = await res.json();

        // Most video APIs require polling. For the sake of this synchronous structure, we expect a direct URL back or we throw an error.
        if (!data.videoUrl && !data.output) {
          throw new ApiError("视频API返回成功，但未包含有效的视频链接 (videoUrl)。这通常是因为该模型接口需要轮询获取结果。");
        }

        return {
          videoUrl: data.videoUrl || data.output,
          lastFrameUrl: data.lastFrameUrl || scene.imageUrl || '',
        };
      }
    } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(`视频生成网络异常: ${error instanceof Error ? error.message : String(error)}。请检查您的 Base URL 和网络环境。`);
  }
};