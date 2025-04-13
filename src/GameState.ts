import { useState, useEffect } from 'react';
import { GameMode, DifficultyLevel, Question } from './types';
import { generateNewQuestion, generateExamQuestions } from './GameLogic';

export const useGameState = () => {
  // 游戏状态
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.MENU);
  const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevel>(DifficultyLevel.BEGINNER);
  const [examQuestionCount, setExamQuestionCount] = useState<number>(10);

  // 练习模式状态
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [practiceDifficulty, setPracticeDifficulty] = useState<DifficultyLevel>(DifficultyLevel.BEGINNER);

  // 当前题目状态
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [operator, setOperator] = useState('+');
  const [hidden, setHidden] = useState(0);  // 0, 1, or 2 for A, operator, or result
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackClass, setFeedbackClass] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);

  // 考试模式状态
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [examScore, setExamScore] = useState(0);
  const [examTimeLeft, setExamTimeLeft] = useState(0); // 考试剩余时间（秒）
  const [examTimerActive, setExamTimerActive] = useState(false); // 考试计时器是否激活

  // 初始化游戏
  useEffect(() => {
    // 默认进入菜单模式
    setGameMode(GameMode.MENU);
  }, []);

  // 当游戏模式改变时初始化
  useEffect(() => {
    if (gameMode === GameMode.PRACTICE && level > 0) {
      // 练习模式初始化（只有当level>0时才初始化，表示用户已经选择了难度并开始练习）
      const newQuestion = generateNewQuestion(practiceDifficulty, level, 'practice');
      setA(newQuestion.a);
      setB(newQuestion.b);
      setOperator(newQuestion.operator);
      setHidden(newQuestion.hidden);
      setUserAnswer('');
      setFeedback('');
      // 停止考试计时器
      setExamTimerActive(false);
    } else if (gameMode !== GameMode.EXAM) {
      // 其他模式停止计时器
      setExamTimerActive(false);
    }
  }, [gameMode, level, practiceDifficulty]);

  // 考试计时器
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (examTimerActive && examTimeLeft > 0) {
      timer = setInterval(() => {
        setExamTimeLeft(prevTime => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            // 时间用完了，自动交卷
            handleSubmitExam();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [examTimerActive, examTimeLeft]);

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // 提前交卷
  const handleSubmitExam = () => {
    setExamTimerActive(false);
    setGameMode(GameMode.EXAM_RESULT);
  };

  // 开始练习模式设置
  const handlePracticeButtonClick = () => {
    setGameMode(GameMode.PRACTICE);
    // 清空当前题目，这样会显示设置界面
    setScore(0);
    setStreak(0);
    setLevel(0); // 设置为0表示还没有开始练习
  };

  // 开始练习模式
  const startPracticeMode = () => {
    setLevel(1);
    setScore(0);
    setStreak(0);
    const newQuestion = generateNewQuestion(practiceDifficulty, 1, 'practice');
    setA(newQuestion.a);
    setB(newQuestion.b);
    setOperator(newQuestion.operator);
    setHidden(newQuestion.hidden);
    setUserAnswer('');
    setFeedback('');
  };

  // 设置练习难度
  const setPracticeDifficultyLevel = (difficulty: DifficultyLevel) => {
    setPracticeDifficulty(difficulty);
  };

  // 开始考试模式
  const startExamMode = () => {
    // 生成考试题目
    setCurrentQuestionIndex(0);
    setExamScore(0);
    const newQuestions = generateExamQuestions(examQuestionCount, difficultyLevel);
    setExamQuestions(newQuestions);

    // 设置当前题目
    if (newQuestions.length > 0) {
      const currentQ = newQuestions[0];
      setA(currentQ.a);
      setB(currentQ.b);
      setOperator(currentQ.operator);
      setHidden(currentQ.hidden);
      setUserAnswer('');
      setFeedback('');

      // 设置考试时间（每题30秒）
      setExamTimeLeft(newQuestions.length * 30);
      setExamTimerActive(true);
    }
  };

  // 返回主菜单
  const backToMenu = () => {
    setGameMode(GameMode.MENU);
  };

  // 设置考试难度
  const setExamDifficulty = (difficulty: DifficultyLevel) => {
    setDifficultyLevel(difficulty);
  };

  // 设置考试题目数量
  const handleQuestionCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExamQuestionCount(parseInt(e.target.value));
  };

  // 重新考试
  const restartExam = () => {
    setGameMode(GameMode.EXAM);
  };

  // 处理考试模式下的下一题
  const handleNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      // 还有下一题
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      // 设置下一题的状态
      const nextQuestion = examQuestions[nextIndex];
      setA(nextQuestion.a);
      setB(nextQuestion.b);
      setOperator(nextQuestion.operator);
      setHidden(nextQuestion.hidden);
      setUserAnswer('');
      setFeedback('');
    } else {
      // 所有题目已答完，显示结果
      setExamTimerActive(false); // 停止计时器
      setGameMode(GameMode.EXAM_RESULT);
    }
  };

  return {
    gameMode,
    setGameMode,
    difficultyLevel,
    setDifficultyLevel,
    examQuestionCount,
    setExamQuestionCount,
    level,
    setLevel,
    score,
    setScore,
    streak,
    setStreak,
    practiceDifficulty,
    setPracticeDifficulty,
    a,
    setA,
    b,
    setB,
    operator,
    setOperator,
    hidden,
    setHidden,
    userAnswer,
    setUserAnswer,
    feedback,
    setFeedback,
    feedbackClass,
    setFeedbackClass,
    showCelebration,
    setShowCelebration,
    examQuestions,
    setExamQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    examScore,
    setExamScore,
    examTimeLeft,
    setExamTimeLeft,
    examTimerActive,
    setExamTimerActive,
    formatTime,
    handleSubmitExam,
    handlePracticeButtonClick,
    startPracticeMode,
    setPracticeDifficultyLevel,
    startExamMode,
    backToMenu,
    setExamDifficulty,
    handleQuestionCountChange,
    restartExam,
    handleNextQuestion
  };
};