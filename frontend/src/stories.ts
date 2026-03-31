// 故事类型定义
export interface TStory {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: string;
  surface: string; // 表面故事
  bottom: string; // 汤底（答案）
}

// 海龟汤故事数据
export const stories: TStory[] = [
  {
    id: 'dinosaur-sky',
    title: '恐龙世界：变暗的天空',
    difficulty: 'easy',
    theme: '恐龙世界',
    surface: '在一个阳光明媚的恐龙世界里，天空突然变得昏暗起来，所有恐龙都显得很紧张。过了一会儿，天空又恢复了明亮，恐龙们又开心地玩耍起来。',
    bottom: '原来是一只巨大的翼龙飞过，挡住了太阳，所以天空变暗了。当翼龙飞走后，天空又恢复了明亮。'
  },
  {
    id: 'ocean-whale',
    title: '海洋探险：会飞的鲸鱼',
    difficulty: 'medium',
    theme: '海洋探险',
    surface: '小明在海边看到一只鲸鱼从海面上腾空而起，像是在飞翔一样，然后又落回了海里。这是怎么回事呢？',
    bottom: '这是鲸鱼在跃出水面玩耍，它们经常会跳出水面，看起来就像是在飞翔一样。'
  },
  {
    id: 'magic-story',
    title: '魔法学校：不见了的故事',
    difficulty: 'easy',
    theme: '魔法学校',
    surface: '在魔法学校里，小红写了一个精彩的故事，但是第二天早上故事突然不见了。小红很着急，后来发现故事又回到了她的桌子上。',
    bottom: '原来是魔法学校的会移动的书整理精灵，它把小红的故事收起来整理了一下，然后又放回了她的桌子上。'
  },
  {
    id: 'forest-friends',
    title: '森林王国：会说话的花朵',
    difficulty: 'medium',
    theme: '森林王国',
    surface: '小松鼠在森林里听到花朵在说话，它们好像在讨论着什么有趣的事情。小松鼠凑近一听，却什么声音都没有了。',
    bottom: '其实是蜜蜂在花朵间飞来飞去采蜜，翅膀振动的声音听起来像是花朵在说话。当小松鼠凑近时，蜜蜂被吓跑了，所以声音就消失了。'
  },
  {
    id: 'space-adventure',
    title: '太空冒险：闪烁的星星',
    difficulty: 'hard',
    theme: '太空冒险',
    surface: '宇航员在太空看到一颗星星在不停地闪烁，有时候亮有时候暗，就像是在和他们打招呼一样。',
    bottom: '这颗星星其实是一颗变星，它的亮度会周期性地变化，所以看起来像是在闪烁和打招呼。'
  }
];
