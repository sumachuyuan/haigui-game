import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import cors from 'cors';
import deepSeekService from './services/deepseekService.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: '后端服务正常' });
});

app.post('/api/chat', async (req, res) => {
  const { question, story } = req.body;
  console.log('Received question:', question);
  console.log('Story surface:', story.surface);

  try {
    const result = await deepSeekService.chat(question, story);
    console.log('AI result:', result);
    if (result.success) {
      res.json({ answer: result.answer });
    } else {
      res.status(500).json({ error: 'AI 服务调用失败' });
    }
  } catch (err) {
    console.error('Error in /api/chat:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
