require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: '后端服务正常' });
});

app.post('/api/chat', async (req, res) => {
  const { question, story } = req.body;
  const apiKey = 'sk-4770f6c1de144c909ce0b93f1dd48da2';

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key 未配置' });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `你是儿童友好的海龟汤主持人，回答只能是"是"、"不是"或"无关"。`
          },
          {
            role: 'user',
            content: `故事汤面：${story.surface}\n汤底：${story.bottom}\n问题：${question}`
          }
        ],
      }),
    });

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || '抱歉，没听清';
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
