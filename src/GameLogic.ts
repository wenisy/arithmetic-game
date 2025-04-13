import { DifficultyLevel, Question } from './types';

export const generateNewQuestion = (currentDifficulty: DifficultyLevel, level: number = 1, gameMode: string = 'practice'): Question => {
  // 根据难度和关卡调整数字范围
  let maxA, maxB, minA, minB;

  // 根据难度级别设置数字范围
  switch (currentDifficulty) {
    case DifficultyLevel.BEGINNER:
      // 10以内为主
      maxA = 10;
      maxB = 10;
      minA = 1;
      minB = 1;
      break;
    case DifficultyLevel.INTERMEDIATE:
      // 10-20混合
      maxA = 20;
      maxB = 10;
      minA = 5;
      minB = 1;
      break;
    case DifficultyLevel.ADVANCED:
      // 20以内为主
      maxA = 20;
      maxB = 20;
      minA = 10;
      minB = 5;
      break;
    default:
      maxA = 10;
      maxB = 10;
      minA = 1;
      minB = 1;
  }

  // 如果是练习模式，还要考虑关卡影响
  if (gameMode === 'practice' && level > 1) {
    // 关卡越高，数字范围越大
    const levelFactor = Math.min(level * 0.2, 1.5); // 限制关卡因子最大值
    maxA = Math.min(Math.floor(maxA * levelFactor), 100);
    maxB = Math.min(Math.floor(maxB * levelFactor), 100);
  }

  // 生成随机数
  let newA = Math.floor(Math.random() * (maxA - minA + 1)) + minA;
  let newB = Math.floor(Math.random() * (maxB - minB + 1)) + minB;

  // 确保减法结果为正数
  let newOperator = Math.random() > 0.5 ? '+' : '-';
  if (newOperator === '-' && newA < newB) {
    // 交换A和B，确保A >= B
    [newA, newB] = [newB, newA];
  }

  // 随机决定隐藏哪个数字
  const newHidden = Math.floor(Math.random() * 3);

  return {
    a: newA,
    b: newB,
    operator: newOperator,
    hidden: newHidden,
    userAnswer: '',
    isCorrect: null
  };
};

export const generateExamQuestions = (count: number, difficulty: DifficultyLevel): Question[] => {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    questions.push(generateNewQuestion(difficulty));
  }

  return questions;
};

export const getCorrectAnswer = (a: number, b: number, op: string): number => {
  return op === '+' ? a + b : a - b;
};