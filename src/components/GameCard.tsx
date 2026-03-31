import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TStory } from '../stories';

interface GameCardProps {
  story: TStory;
}

const GameCard: React.FC<GameCardProps> = ({ story }) => {
  const navigate = useNavigate();

  // 根据难度获取对应的颜色类
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'hard':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 处理卡片点击，跳转到游戏页面
  const handleClick = () => {
    navigate(`/game/${story.id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold font-['Comic_Sans_MS',_cursive] text-gray-800">
            {story.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(story.difficulty)}`}>
            {story.difficulty === 'easy' ? '简单' : story.difficulty === 'medium' ? '中等' : '困难'}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          {story.surface.length > 100 ? story.surface.substring(0, 100) + '...' : story.surface}
        </p>
        <div className="flex justify-end">
          <span className="text-blue-500 text-sm font-medium">开始游戏 →</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;