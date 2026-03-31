import React from 'react';

interface MessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    playerNumber?: string;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-end ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
        {/* 头像 */}
        <div className="flex flex-col items-center">
          <div className="text-2xl">
            {isUser ? '👧' : '🐼'}
          </div>
          {isUser && message.playerNumber && message.playerNumber !== '?' && (
            <span className="text-[10px] text-blue-600 font-black mt-0.5 leading-none">
              {message.playerNumber}号
            </span>
          )}
        </div>
        
        {/* 消息气泡 */}
        <div 
          className={`max-w-[80%] p-4 rounded-2xl ${isUser 
            ? 'bg-blue-100 text-blue-800 rounded-tr-none' 
            : 'bg-yellow-100 text-gray-800 rounded-tl-none'
          }`}
        >
          <p className="font-['Comic_Sans_MS',_cursive]">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;