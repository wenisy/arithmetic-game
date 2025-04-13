import React from 'react';
import './App.css';

// 导入组件和逻辑
import { GameMode } from './types';
import { useGameState, getCorrectAnswer } from './utils';
import { generateNewQuestion } from './utils/GameLogic';
import { useSound } from './hooks';
import {
  Menu,
  PracticeSettings,
  ExamSettings,
  PracticeMode,
  ExamMode,
  ExamResult
} from './components';

const App: React.FC = () => {
  const {
    gameMode,
    setGameMode,
    difficultyLevel,
    examQuestionCount,
    level,
    score,
    streak,
    practiceDifficulty,
    a,
    b,
    operator,
    hidden,
    userAnswer,
    feedback,
    feedbackClass,
    showCelebration,
    examQuestions,
    currentQuestionIndex,
    examScore,
    examTimeLeft,
    setUserAnswer,
    setFeedback,
    setFeedbackClass,
    setScore,
    setStreak,
    setLevel,
    setExamScore,
    setExamQuestions,
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
    handleNextQuestion,
    // 添加缺失的函数
    setA,
    setB,
    setOperator,
    setHidden,
    setShowCelebration
  } = useGameState();

  const { playCorrectSound, playWrongSound } = useSound();

  const correctAnswer = getCorrectAnswer(a, b, operator);

  // 显示答案按钮处理
  const handleShowAnswer = () => {
    // 显示正确答案
    let answer = '';

    if (hidden === 0) { // A 被隐藏
      answer = operator === '+' ? `${correctAnswer - b}` : `${correctAnswer + b}`;
    } else if (hidden === 1) { // 运算符被隐藏
      answer = a + b === correctAnswer ? '+' : '-';
    } else { // 结果被隐藏
      answer = `${correctAnswer}`;
    }

    setFeedback(`正确答案是: ${answer}`);
    setFeedbackClass('info');
    playWrongSound(); // 播放错误音效，因为显示答案计为错误

    // 计为错误并生成新题目
    if (gameMode === GameMode.PRACTICE) {
      setStreak(0);
      setTimeout(() => {
        const newQuestion = generateNewQuestion(practiceDifficulty, level, 'practice');
        setA(newQuestion.a);
        setB(newQuestion.b);
        setOperator(newQuestion.operator);
        setHidden(newQuestion.hidden);
        setUserAnswer('');
        setFeedback('');
      }, 2000);
    } else if (gameMode === GameMode.EXAM) {
      // 在考试模式下标记当前题目为错误
      const updatedQuestions = [...examQuestions];
      updatedQuestions[currentQuestionIndex].isCorrect = false;
      setExamQuestions(updatedQuestions);

      // 如果还有下一题，跳到下一题
      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    }
  };

  // 处理用户提交答案
  const handleAnswer = () => {
    let isCorrect = false;

    if (hidden === 1) { // 运算符被隐藏
      // 检查用户输入的是否为加号或减号
      const isPlus = userAnswer === '+' || userAnswer === '1';
      const isMinus = userAnswer === '-' || userAnswer === '2';

      if (!isPlus && !isMinus) {
        setFeedback('请输入 + 或 - （或者1或2）');
        setFeedbackClass('error');
        return;
      }

      isCorrect = (isPlus && operator === '+') || (isMinus && operator === '-');
    } else {
      // 处理数字输入（A或结果被隐藏）
      const userNum = parseInt(userAnswer);

      if (isNaN(userNum)) {
        setFeedback('请输入一个数字！');
        setFeedbackClass('error');
        return;
      }

      if (hidden === 0) { // A 被隐藏
        isCorrect = (operator === '+' && userNum + b === correctAnswer) ||
                   (operator === '-' && userNum - b === correctAnswer);
      } else { // 结果被隐藏 (hidden === 2)
        isCorrect = userNum === correctAnswer;
      }
    }

    if (gameMode === GameMode.PRACTICE) {
      // 练习模式下的处理
      if (isCorrect) {
        // 正确答案处理
        setScore(score + 1);
        setStreak(streak + 1);
        setFeedback('答对了！真棒！');
        setFeedbackClass('success');
        playCorrectSound(); // 播放正确音效

        // 每答对5题升一级
        if (streak % 5 === 4) {
          setLevel(level + 1);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }

        // 生成新题目
        setTimeout(() => {
          const newQuestion = generateNewQuestion(practiceDifficulty, level, 'practice');
          setA(newQuestion.a);
          setB(newQuestion.b);
          setOperator(newQuestion.operator);
          setHidden(newQuestion.hidden);
          setUserAnswer('');
          setFeedback('');
        }, 1000);
      } else {
        // 错误答案处理
        setStreak(0);
        setFeedback('再试一次！');
        setFeedbackClass('error');
        playWrongSound(); // 播放错误音效
      }
    } else if (gameMode === GameMode.EXAM) {
      // 考试模式下的处理
      const updatedQuestions = [...examQuestions];
      updatedQuestions[currentQuestionIndex].userAnswer = userAnswer;
      updatedQuestions[currentQuestionIndex].isCorrect = isCorrect;

      if (isCorrect) {
        setExamScore(examScore + 1);
        setFeedback('答对了！');
        setFeedbackClass('success');
        playCorrectSound(); // 播放正确音效
      } else {
        setFeedback('答错了！');
        setFeedbackClass('error');
        playWrongSound(); // 播放错误音效
      }

      setExamQuestions(updatedQuestions);

      // 延迟一会再跳到下一题
      setTimeout(() => {
        handleNextQuestion();
      }, 1000);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnswer();
    }
  };

  // 点击考试模式按钮
  const handleExamButtonClick = () => {
    // 清空考试题目，这样会显示设置界面
    setExamQuestions([]);
    setGameMode(GameMode.EXAM);
  };

  // 根据游戏模式渲染不同界面
  const renderGameContent = () => {
    switch (gameMode) {
      case GameMode.MENU:
        return (
          <Menu
            setGameMode={setGameMode}
            handlePracticeButtonClick={handlePracticeButtonClick}
            handleExamButtonClick={handleExamButtonClick}
          />
        );
      case GameMode.PRACTICE:
        // 如果关卡为0，表示还没有开始练习，显示设置界面
        if (level === 0) {
          return (
            <PracticeSettings
              practiceDifficulty={practiceDifficulty}
              setPracticeDifficultyLevel={setPracticeDifficultyLevel}
              startPracticeMode={startPracticeMode}
              backToMenu={backToMenu}
            />
          );
        }
        return (
          <PracticeMode
            level={level}
            score={score}
            streak={streak}
            a={a}
            b={b}
            operator={operator}
            hidden={hidden}
            userAnswer={userAnswer}
            feedback={feedback}
            feedbackClass={feedbackClass}
            showCelebration={showCelebration}
            setUserAnswer={setUserAnswer}
            handleAnswer={handleAnswer}
            handleShowAnswer={handleShowAnswer}
            handleKeyDown={handleKeyDown}
            backToMenu={backToMenu}
            correctAnswer={correctAnswer}
          />
        );
      case GameMode.EXAM:
        // 如果考试题目为空，则显示设置界面
        if (examQuestions.length === 0) {
          return (
            <ExamSettings
              difficultyLevel={difficultyLevel}
              examQuestionCount={examQuestionCount}
              setExamDifficulty={setExamDifficulty}
              handleQuestionCountChange={handleQuestionCountChange}
              startExamMode={startExamMode}
              backToMenu={backToMenu}
            />
          );
        }
        return (
          <ExamMode
            a={a}
            b={b}
            operator={operator}
            hidden={hidden}
            userAnswer={userAnswer}
            feedback={feedback}
            feedbackClass={feedbackClass}
            currentQuestionIndex={currentQuestionIndex}
            examQuestions={examQuestions}
            examTimeLeft={examTimeLeft}
            setUserAnswer={setUserAnswer}
            handleAnswer={handleAnswer}
            handleShowAnswer={handleShowAnswer}
            handleKeyDown={handleKeyDown}
            handleSubmitExam={handleSubmitExam}
            backToMenu={backToMenu}
            formatTime={formatTime}
            correctAnswer={correctAnswer}
          />
        );
      case GameMode.EXAM_RESULT:
        return (
          <ExamResult
            examQuestions={examQuestions}
            backToMenu={backToMenu}
            restartExam={restartExam}
          />
        );
      default:
        return (
          <Menu
            setGameMode={setGameMode}
            handlePracticeButtonClick={handlePracticeButtonClick}
            handleExamButtonClick={handleExamButtonClick}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderGameContent()}

      <footer className="game-footer">
        <p>小朋友加油！学好数学很重要哦！</p>
      </footer>
    </div>
  );
};



export default App;
