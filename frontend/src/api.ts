import { TStory } from './stories';

// AI 调用函数
export const askAI = async (question: string, story: TStory): Promise<string> => {
  try {
    console.log('开始调用后端:', 'http://localhost:3000/api/chat', { question, story });

    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        story
      }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败：${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('后端返回:', data);
    const answer = data.answer.trim();

    // 检查回答是否符合规范
    const validAnswers = ['是', '不是', '无关', '真相大白'];
    const guidePhrases = [
      "要用'是不是'来提问哦，这样我才能回答是或不是～",
      "一次只问一个问题，这样我才能听清楚～",
      "这个问题好像和故事没关系哦，要不要换个角度试试？",
      "🎉 恭喜你！你已经揭开了真相！太棒了！"
    ];

    if (validAnswers.includes(answer) || guidePhrases.some(phrase => answer.includes(phrase))) {
      return answer;
    } else {
      return '抱歉，我没听明白，你可以再问一次吗？';
    }
  } catch (error) {
    console.error('AI 调用错误：', error);
    return '抱歉，我现在有点忙，稍后再回答你吧！';
  }
};