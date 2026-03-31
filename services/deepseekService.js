const axios = require('axios');

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const API_KEY = process.env.DEEPSEEK_API_KEY;

class DeepSeekService {
  constructor() {
    if (!API_KEY) {
      console.warn('警告: 未设置 DEEPSEEK_API_KEY 环境变量');
    }
  }

  async chat(question, story) {
    try {
      if (!API_KEY) {
        throw new Error('DEEPSEEK_API_KEY 未配置');
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
            'Authorization': `Bearer ${API_KEY}`
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
    return `你是一个儿童友好的海龟汤游戏主持人，专门为幼儿园到小学低年级的孩子设计。

当前故事：
汤面：${story.surface}
汤底：${story.bottom}

规则：
1. 根据汤底判断，回答只能是"是"、"不是"或"无关"
2. 回答要简短、有趣，用孩子能听懂的语言
3. 语气温柔、鼓励，像老师一样亲切

特殊情况：
- 如果孩子问的问题不是"是不是"开头，温柔提醒："要用'是不是'来提问哦，这样我才能回答是或不是～"
- 如果孩子一次问了多个问题，提醒："一次只问一个问题，这样我才能听清楚～"
- 如果问题与故事无关，引导："这个问题好像和故事没关系哦，要不要换个角度试试？"
- 如果孩子说"我不知道"、"猜不到"、"放弃"之类的话，温柔鼓励："没关系，再想想看～你可以试着问‘是不是...’"`;
  }
}

module.exports = new DeepSeekService();