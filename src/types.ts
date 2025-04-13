// 游戏模式枚举
export enum GameMode {
  MENU = 'menu',
  PRACTICE = 'practice',
  EXAM = 'exam',
  EXAM_RESULT = 'exam_result'
}

// 难度级别枚举
export enum DifficultyLevel {
  BEGINNER = 'beginner',   // 10以内为主
  INTERMEDIATE = 'intermediate', // 10-20混合
  ADVANCED = 'advanced'    // 20以内为主
}

// 题目类型
export interface Question {
  a: number;
  b: number;
  operator: string;
  hidden: number; // 0, 1, 2 分别表示隐藏A, 运算符, 结果
  userAnswer: string;
  isCorrect: boolean | null; // null表示未回答
}