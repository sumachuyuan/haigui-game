import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';

interface ChatBoxProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSend, isLoading, disabled = false }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 当消息列表变化时，滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 处理发送消息
  const handleSend = () => {
    if (input.trim() && !disabled) {
      console.log('ChatBox 准备发送:', input.trim());
      onSend(input.trim());
      setInput('');
    }
  };

  // 处理回车发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 mb-4 space-y-4">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        
        {/* 加载动画 */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end flex-row gap-2">
              <div className="text-2xl">🐼</div>
              <div className="bg-yellow-100 text-gray-800 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                <p className="font-['Comic_Sans_MS',_cursive] animate-pulse">思考中...</p>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题，AI 会回答是/不是/无关"
            disabled={disabled}
            className={`flex-1 px-4 py-3 rounded-2xl border font-['Comic_Sans_MS',_cursive] ${disabled ? 'border-gray-300 bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
          />
          <button
            onClick={handleSend}
            disabled={disabled}
            className={`px-6 py-3 rounded-2xl font-['Comic_Sans_MS',_cursive] font-bold transition-colors ${disabled ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;