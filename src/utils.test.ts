// 测试游戏的核心逻辑

// 添加导出语句，使文件成为模块
export {};

// 模拟DifficultyLevel枚举
enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

// 测试生成题目的数字范围
describe('题目生成逻辑测试', () => {
  // 测试函数：根据难度级别生成数字
  function generateNumberByDifficulty(difficulty: DifficultyLevel): { a: number, b: number } {
    let maxA, maxB, minA, minB;

    switch (difficulty) {
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

    const a = Math.floor(Math.random() * (maxA - minA + 1)) + minA;
    const b = Math.floor(Math.random() * (maxB - minB + 1)) + minB;

    return { a, b };
  }

  // 测试初级难度的数字范围
  test('初级难度数字范围', () => {
    for (let i = 0; i < 100; i++) {
      const { a, b } = generateNumberByDifficulty(DifficultyLevel.BEGINNER);

      expect(a).toBeGreaterThanOrEqual(1);
      expect(a).toBeLessThanOrEqual(10);

      expect(b).toBeGreaterThanOrEqual(1);
      expect(b).toBeLessThanOrEqual(10);
    }
  });

  // 测试中级难度的数字范围
  test('中级难度数字范围', () => {
    for (let i = 0; i < 100; i++) {
      const { a, b } = generateNumberByDifficulty(DifficultyLevel.INTERMEDIATE);

      expect(a).toBeGreaterThanOrEqual(5);
      expect(a).toBeLessThanOrEqual(20);

      expect(b).toBeGreaterThanOrEqual(1);
      expect(b).toBeLessThanOrEqual(10);
    }
  });

  // 测试高级难度的数字范围
  test('高级难度数字范围', () => {
    for (let i = 0; i < 100; i++) {
      const { a, b } = generateNumberByDifficulty(DifficultyLevel.ADVANCED);

      expect(a).toBeGreaterThanOrEqual(10);
      expect(a).toBeLessThanOrEqual(20);

      expect(b).toBeGreaterThanOrEqual(5);
      expect(b).toBeLessThanOrEqual(20);
    }
  });
});

// 测试答案验证逻辑
describe('答案验证逻辑测试', () => {
  // 测试加法答案验证
  test('加法答案验证', () => {
    // 测试A被隐藏的情况
    expect(validateAnswer(0, '+', 3, 5, '3')).toBe(true);  // 3 + 5 = 8
    expect(validateAnswer(0, '+', 3, 5, '4')).toBe(false); // 4 + 5 ≠ 8

    // 测试运算符被隐藏的情况
    expect(validateAnswer(1, '+', 3, 2, '+')).toBe(true);  // 3 + 2 = 5
    expect(validateAnswer(1, '+', 3, 2, '-')).toBe(false); // 3 - 2 ≠ 5

    // 测试结果被隐藏的情况
    expect(validateAnswer(2, '+', 3, 2, '5')).toBe(true);  // 3 + 2 = 5
    expect(validateAnswer(2, '+', 3, 2, '6')).toBe(false); // 3 + 2 ≠ 6
  });

  // 测试减法答案验证
  test('减法答案验证', () => {
    // 测试A被隐藏的情况
    expect(validateAnswer(0, '-', 8, 3, '8')).toBe(true);  // 8 - 3 = 5
    expect(validateAnswer(0, '-', 8, 3, '7')).toBe(false); // 7 - 3 ≠ 5

    // 测试运算符被隐藏的情况
    expect(validateAnswer(1, '-', 8, 3, '-')).toBe(true);  // 8 - 3 = 5
    expect(validateAnswer(1, '-', 8, 3, '+')).toBe(false); // 8 + 3 ≠ 5

    // 测试结果被隐藏的情况
    expect(validateAnswer(2, '-', 8, 3, '5')).toBe(true);  // 8 - 3 = 5
    expect(validateAnswer(2, '-', 8, 3, '4')).toBe(false); // 8 - 3 ≠ 4
  });
});

// 验证答案的函数
function validateAnswer(hidden: number, operator: string, a: number, b: number, userAnswer: string): boolean {
  const userNum = parseInt(userAnswer);

  if (hidden === 0) { // A被隐藏
    if (operator === '+') {
      return userNum + b === a + b;
    } else {
      // 对于减法，如果a被隐藏，则用户输入的是被减数
      return userNum - b === a - b || userNum === a + b;
    }
  } else if (hidden === 1) { // 运算符被隐藏
    if (userAnswer === '+') {
      return a + b === a + b;
    } else if (userAnswer === '-') {
      return a - b === a - b;
    } else {
      return false;
    }
  } else { // 结果被隐藏 (hidden === 2)
    if (operator === '+') {
      return userNum === a + b;
    } else {
      return userNum === a - b;
    }
  }
}
