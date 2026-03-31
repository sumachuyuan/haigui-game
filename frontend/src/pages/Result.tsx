import { useLocation, useNavigate } from 'react-router-dom';
import { TStory } from '../stories';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  playerNumber?: string;
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { story, messages, isSuccess } = location.state as { story: TStory; messages: Message[]; isSuccess: boolean };

  if (!story) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            {isSuccess ? '🏆 恭喜！挑战成功 🏆' : '📖 故事真相'}
          </h1>
          <p className="text-gray-600">{story.title}</p>
        </div>

        <div className="bg-amber-50 rounded-2xl p-6 mb-8 shadow-lg border border-amber-200 animate-slide-up">
          <h2 className="text-xl font-bold text-amber-700 mb-3">📖 故事真相</h2>
          <p className="text-gray-800 leading-relaxed text-lg">{story.bottom}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4">💬 推理过程</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-700 rounded-bl-none'
                }`}>
                  <p className="text-sm">
                    {msg.role === 'user' 
                      ? `${msg.playerNumber || ''}号：${msg.content}` 
                      : `AI：${msg.content}`
                    }
                  </p>
                </div>
              </div>
            ))}
            {messages.length === 0 && <p className="text-gray-400 text-center">还没有提问记录</p>}
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-blue-500 text-white rounded-full py-4 font-medium text-lg hover:bg-blue-600 transition transform hover:scale-105"
        >
          🎮 再来一局
        </button>
      </div>
    </div>
  );
}