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
1. **优先判断逻辑**：即便孩子提问中带有标点（如“是不是。天太黑了？”），只要他在试图用“是不是”的方式提问，你就必须根据汤底逻辑回答：
   - 是
   - 不是
   - 无关

2. **严格的输出格式**：
   - 你的回复**只能**是“是”、“不是”或“无关”。
   - **除非**遇到以下情况，否则严禁多说一个字：
     - 孩子完全没用“是不是”的意思（如：“他去哪了？”）：回复“要用'是不是'来提问哦，这样我才能回答是或不是～”
     - 孩子想放弃：回复“没关系，再想想看～您可以试着问‘是不是...’”

【回复示例】
孩子：是不是。天太黑了？
你：是

孩子：他死了吗？
你：要用'是不是'来提问哦，这样我才能回答是或不是～

孩子：是不是他弄坏了玩具？
你：不是

孩子：是不是他在吃饭？
你：无关`;
  }
}

export default new DeepSeekService();