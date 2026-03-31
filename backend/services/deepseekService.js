import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

class DeepSeekService {
  constructor() {}

  getApiKey() {
    return process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY;
  }

  async chat(question, story) {
    const apiKey = this.getApiKey();
    try {
      if (!apiKey) {
        throw new Error('API Key 未配置');
      }

      if (!question || typeof question !== 'string') {
        throw new Error('问题参数不能为空');
      }

      const systemPrompt = this.buildSystemPrompt(story);
      
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: question
            }
          ],
          temperature: 0.7,
          max_tokens: 100
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          timeout: 30000
        }
      );

      if (response.data && response.data.choices && response.data.choices[0]) {
        return {
          success: true,
          answer: response.data.choices[0].message.content,
          usage: response.data.usage
        };
      } else {
        throw new Error('API 返回数据格式异常');
      }
    } catch (error) {
      console.error('DeepSeek API 调用失败:', error.message);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error?.message || '未知错误';
        
        if (status === 401) {
          throw new Error('API Key 无效或已过期');
        } else if (status === 429) {
          throw new Error('请求过于频繁，请稍后再试');
        } else if (status >= 500) {
          throw new Error('DeepSeek 服务暂时不可用');
        } else {
          throw new Error(`API 错误: ${message}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('请求超时，请检查网络连接');
      } else {
        throw error;
      }
    }
  }

  buildSystemPrompt(story) {
    return `你是一个儿童海龟汤游戏的主持人。你的任务是根据“汤底”判断孩子的提问。

【当前故事】
汤面：${story.surface}
汤底：${story.bottom}

【核心任务】
1. **真相判定（最高优先级）**：只要孩子表达的内容触及了“汤底”最核心的真相，请直接回复“真相大白”。

2. **核心逻辑（高容错性）**：
   - **如果消息中包含“是不是”、“是吗”、“是吗”、“是不是。”或任何试图寻求是非判断的行为**：即使语序乱、带标点（如“是不是。天黑”），也**必须且只能**根据汤底逻辑回答：
     - 是
     - 不是
     - 无关

3. **严格的输出限制**：
   - 正常回复时，**只能且必须**输出“是”、“不是”、“无关”或“真相大白”这四个词中的其中一个。
   - **只有当孩子完全在说废话**（如“你好”、“你叫什么”、“哈哈”）且完全没在提问时，才允许回复引导语：“要用'是不是'来提问哦，这样我才能回答是或不是～”

【判定逻辑速记】
- 有“是不是”意图 ➔ 是/不是/无关/真相大白（严禁多说）
- 无提问意图 ➔ 引导语（仅此一种情况可多说）
`;
  }
}

export default new DeepSeekService();