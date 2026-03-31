import React from 'react';
import GameCard from '../components/GameCard';
import { stories } from '../stories';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-['Comic_Sans_MS',_cursive] text-blue-800 mb-4">
            🐼 提问大冒险
          </h1>
          <p className="text-lg text-blue-700 font-['Comic_Sans_MS',_cursive]">
            用提问揭开真相，一起进入推理的奇妙世界！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <GameCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;