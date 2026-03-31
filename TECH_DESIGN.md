# AI海龟汤游戏技术设计

## 技术栈
- 前端：React + TypeScript + Vite
- 样式：Tailwind CSS
- 状态管理：React Hooks（useState, useContext）
- 路由：React Router
- 后端：前期不搭后端，前端直接调用DeepSeek API
- AI API：DeepSeek（已充值10元，注意保护API Key）

> 注：前端直接调API时，Key会暴露在网页代码中。目前自己用没问题，未来要给别人玩时再加后端保护。

## 项目结构src/
├── components/
│ ├── StartScreen.tsx # 品牌启动页（第一个屏）
│ ├── StoryPage.tsx # 汤面故事页
│ ├── ChatBox.tsx # 聊天框（含编号输入）
│ ├── Message.tsx # 单条消息
│ ├── VideoRecorder.tsx # 录像组件（记录互动过程）
│ └── ResultPage.tsx # 汤底揭晓+复盘页
├── pages/ # 页面（简化，无游戏大厅）
│ ├── Game.tsx # 主游戏页面
│ └── Result.tsx # 结果页面
├── data/
│ └── stories.ts # 海龟汤故事数据
├── App.tsx
└── main.tsx
## 数据模型

### Story（海龟汤故事）
```typescript
interface Story {
  id: string;
  title: string;
  theme: string;              // 主题字段（如"恐龙世界"、"海洋谜案"）
  difficulty: 'easy' | 'medium' | 'hard';  // 简单/一般/困难
  surface: string;            // 汤面故事
  bottom: string;             // 汤底真相
}
interface Message {
  id: string;
  playerNumber: number;       // 孩子编号（1,2,3...）
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
你是一个海龟汤游戏的主持人，你的听众是幼儿园到小学低年级的孩子。

当前故事的汤面是：{surface}
故事的汤底是：{bottom}

规则：
1. 玩家提问后，你只能根据汤底判断，回答“是”、“否”或“与故事无关”
2. 回答要简短、有趣、用孩子能听懂的语言
3. 语气要温柔、鼓励，像老师一样亲切

特殊情况：
- 如果玩家问的问题和故事完全不沾边，不要只说“无关”
- 改成温柔引导：“这个问题好像和故事没关系哦，要不要换个角度试试？”
- 可以给孩子一点小提示，比如：“你可以问问这件事发生在哪里？或者主角做了什么？”

玩家问：{question}
请回答：