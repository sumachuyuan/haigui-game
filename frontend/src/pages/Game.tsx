import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import { stories, TStory } from '../stories';
import { askAI } from '../api';

const Game: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<TStory | null>(null);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; playerNumber?: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [childNumber, setChildNumber] = useState('');
  const childNumberRef = React.useRef('');
  const [questionCount, setQuestionCount] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'ended'>('playing');

  // 同步 Ref
  useEffect(() => {
    childNumberRef.current = childNumber;
  }, [childNumber]);

  useEffect(() => {
    if (id) {
      const foundStory = stories.find(s => s.id === id);
      setStory(foundStory || null);
      if (foundStory) {
        setMessages([
          {
            role: 'assistant',
            content: `欢迎来到海龟汤游戏！\n\n汤面：${foundStory.surface}\n\n你可以开始提问，我会回答是/不是/无关。`
          }
        ]);
      }
    }
  }, [id]);

  const handleSend = async (message: string) => {
    if (gameStatus === 'ended') return;

    // 【深度扫描模式】查找页面上所有的输入框和选择框，确保捕捉到下拉菜单的值
    const allElements = Array.from(document.querySelectorAll('input, select'));
    console.log(`[DEBUG] Total input/select elements found: ${allElements.length}`);

    let capturedValue = '';

    allElements.forEach((el, index) => {
      const input = el as HTMLInputElement | HTMLSelectElement;
      console.log(`[SCAN] Element #${index}: tag="${input.tagName}", id="${input.id}", value="${input.value}"`);

      // 匹配下拉框或输入框
      if (input.id === 'final-child-number-id' && input.value) {
        capturedValue = input.value.trim();
      }
    });

    console.log('[DEBUG] Final Captured Value:', capturedValue);

    const currentPlayerNumber = capturedValue || childNumber || '?';

    setMessages(prev => [...prev, { role: 'user', content: message, playerNumber: currentPlayerNumber }]);
    setQuestionCount(prev => prev + 1);
    setIsLoading(true);

    try {
      if (!story) throw new Error('故事不存在');
      const answer = await askAI(message, story);

      // 检测是否揭开真相
      if (answer === '真相大白') {
        setGameStatus('ended');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '🎉 恭喜你！你已经揭开了真相！太棒了！'
        }]);

        // 延迟跳转
        setTimeout(() => {
          setMessages(currentMessages => {
            navigate('/result', { state: { story, messages: currentMessages, isSuccess: true } });
            return currentMessages;
          });
        }, 2000);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
      }
    } catch (error) {
      console.error('调用 askAI 错误:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我现在有点忙，稍后再回答你吧！' }]);
    } finally {
      setIsLoading(false);
    }
  };
  // 修复：跳转到 /result，传递 story 和 messages
  const handleShowBottom = () => {
    if (story) {
      setGameStatus('ended');
      navigate('/result', { state: { story, messages, isSuccess: false } });
    }
  };

  const handleEndGame = () => {
    if (window.confirm('确定要结束游戏吗？')) {
      setGameStatus('ended');
      navigate('/');
    }
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold font-['Comic_Sans_MS',_cursive] text-blue-800 mb-4">故事未找到</h1>
          <p className="text-blue-700 mb-6">抱歉，你访问的故事不存在。</p>
          <button onClick={() => navigate('/')} className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-['Comic_Sans_MS',_cursive] font-bold hover:bg-blue-600">返回首页</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col h-[90vh]">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold font-['Comic_Sans_MS',_cursive] text-blue-800">{story.title}</h1>
            <div className="flex items-center gap-2">
              <label className="text-blue-700 font-['Comic_Sans_MS',_cursive]">编号：</label>
              <select
                id="final-child-number-id"
                value={childNumber}
                onChange={(e) => setChildNumber(e.target.value)}
                className="w-20 px-3 py-2 rounded-xl border border-gray-300 bg-white"
              >
                <option value="">-</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-white bg-opacity-80 rounded-2xl p-4 mb-4">
            <h2 className="text-lg font-bold font-['Comic_Sans_MS',_cursive] text-blue-800 mb-2">汤面</h2>
            <p className="font-['Comic_Sans_MS',_cursive] text-gray-700">{story.surface}</p>
          </div>
          <div className="text-right text-blue-700 font-['Comic_Sans_MS',_cursive]">第 {questionCount} 个问题</div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          <ChatBox messages={messages} onSend={handleSend} isLoading={isLoading} disabled={gameStatus === 'ended'} />
        </div>

        <div className="flex gap-4">
          <button onClick={handleShowBottom} className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600">查看汤底</button>
          <button onClick={handleEndGame} className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-600">结束游戏</button>
        </div>
      </div>
    </div>
  );
};

export default Game;