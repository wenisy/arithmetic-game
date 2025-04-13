import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// 导入音效
import correctSound from '../sounds/correct.mp3';
import wrongSound from '../sounds/wrong.mp3';

// 游戏模式枚举
enum GameMode {
  MENU = 'menu',
  PRACTICE = 'practice',
  EXAM = 'exam',
  EXAM_RESULT = 'exam_result'
}

// 难度级别枚举
enum DifficultyLevel {
  BEGINNER = 'beginner',   // 10以内为主
  INTERMEDIATE = 'intermediate', // 10-20混合
  ADVANCED = 'advanced'    // 20以内为主
}

// 题目类型
interface Question {
  a: number;
  b: number;
  operator: string;
  hidden: number; // 0, 1, 2 分别表示隐藏A, 运算符, 结果
  userAnswer: string;
  isCorrect: boolean | null; // null表示未回答
}

const App: React.FC = () => {
  // 音效引用
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  // 播放正确答案音效
  const playCorrectSound = () => {
    if (correctAudioRef.current) {
      correctAudioRef.current.currentTime = 0;
      correctAudioRef.current.play();
    }
  };

  // 播放错误答案音效
  const playWrongSound = () => {
    if (wrongAudioRef.current) {
      wrongAudioRef.current.currentTime = 0;
      wrongAudioRef.current.play();
    }
  };
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

  // 生成新题目的函数
  const generateNewQuestion = (currentDifficulty: DifficultyLevel = difficultyLevel) => {
    // 根据难度和关卡调整数字范围
    let maxA, maxB, minA, minB;

    // 根据难度级别设置数字范围
    const difficulty = gameMode === GameMode.PRACTICE ? practiceDifficulty : currentDifficulty;

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

    // 如果是练习模式，还要考虑关卡影响
    if (gameMode === GameMode.PRACTICE && level > 1) {
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

    if (gameMode === GameMode.PRACTICE) {
      setA(newA);
      setB(newB);
      setOperator(newOperator);
      setHidden(newHidden);
      setUserAnswer('');
      setFeedback('');
    }

    return {
      a: newA,
      b: newB,
      operator: newOperator,
      hidden: newHidden,
      userAnswer: '',
      isCorrect: null
    };
  };

  // 生成考试题目
  const generateExamQuestions = (count: number, difficulty: DifficultyLevel) => {
    const questions: Question[] = [];

    for (let i = 0; i < count; i++) {
      questions.push(generateNewQuestion(difficulty));
    }

    return questions;
  };

  // 初始化游戏
  useEffect(() => {
    // 默认进入菜单模式
    setGameMode(GameMode.MENU);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当游戏模式改变时初始化
  useEffect(() => {
    if (gameMode === GameMode.PRACTICE && level > 0) {
      // 练习模式初始化（只有当level>0时才初始化，表示用户已经选择了难度并开始练习）
      generateNewQuestion();
      // 停止考试计时器
      setExamTimerActive(false);
    } else if (gameMode === GameMode.EXAM) {
      // 考试模式初始化
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
    } else {
      // 其他模式停止计时器
      setExamTimerActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameMode]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // 计算正确答案
  const getCorrectAnswer = (a: number, b: number, op: string): number => {
    return op === '+' ? a + b : a - b;
  };

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
        generateNewQuestion();
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
          generateNewQuestion();
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

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnswer();
    }
  };

  // 显示算术题目
  const displayQuestion = () => {
    if (hidden === 0) {
      return (
        <div className="equation">
          <div className="box hidden">?</div>
          <div className="operator">{operator}</div>
          <div className="box">{b}</div>
          <div className="operator">=</div>
          <div className="box">{correctAnswer}</div>
        </div>
      );
    } else if (hidden === 1) {
      return (
        <div className="equation">
          <div className="box">{a}</div>
          <div className="operator hidden">?</div>
          <div className="box">{b}</div>
          <div className="operator">=</div>
          <div className="box">{correctAnswer}</div>
        </div>
      );
    } else {
      return (
        <div className="equation">
          <div className="box">{a}</div>
          <div className="operator">{operator}</div>
          <div className="box">{b}</div>
          <div className="operator">=</div>
          <div className="box hidden">?</div>
        </div>
      );
    }
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
    generateNewQuestion();
  };

  // 设置练习难度
  const setPracticeDifficultyLevel = (difficulty: DifficultyLevel) => {
    setPracticeDifficulty(difficulty);
  };

  // 开始考试模式
  const startExamMode = () => {
    setGameMode(GameMode.EXAM);
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

  // 游戏菜单界面
  const renderMenu = () => {
    return (
      <div className="menu-container">
        <h1>小学生算术游戏</h1>
        <div className="menu-buttons">
          <button className="menu-button" onClick={handlePracticeButtonClick}>练习模式</button>
          <button className="menu-button" onClick={handleExamButtonClick}>考试模式</button>
        </div>
      </div>
    );
  };

  // 练习模式设置界面
  const renderPracticeSettings = () => {
    return (
      <div className="practice-settings">
        <h1>练习模式设置</h1>

        <div className="setting-group">
          <h2>选择难度级别</h2>
          <div className="difficulty-buttons">
            <button
              className={`difficulty-button ${practiceDifficulty === DifficultyLevel.BEGINNER ? 'active' : ''}`}
              onClick={() => setPracticeDifficultyLevel(DifficultyLevel.BEGINNER)}
            >
              初级 (10以内)
            </button>
            <button
              className={`difficulty-button ${practiceDifficulty === DifficultyLevel.INTERMEDIATE ? 'active' : ''}`}
              onClick={() => setPracticeDifficultyLevel(DifficultyLevel.INTERMEDIATE)}
            >
              中级 (10-20混合)
            </button>
            <button
              className={`difficulty-button ${practiceDifficulty === DifficultyLevel.ADVANCED ? 'active' : ''}`}
              onClick={() => setPracticeDifficultyLevel(DifficultyLevel.ADVANCED)}
            >
              高级 (20以内)
            </button>
          </div>
        </div>

        <div className="practice-buttons">
          <button className="back-button" onClick={backToMenu}>返回</button>
          <button className="start-button" onClick={startPracticeMode}>开始练习</button>
        </div>
      </div>
    );
  };

  // 考试设置界面
  const renderExamSettings = () => {
    return (
      <div className="exam-settings">
        <h1>考试设置</h1>

        <div className="setting-group">
          <h2>选择难度级别</h2>
          <div className="difficulty-buttons">
            <button
              className={`difficulty-button ${difficultyLevel === DifficultyLevel.BEGINNER ? 'active' : ''}`}
              onClick={() => setExamDifficulty(DifficultyLevel.BEGINNER)}
            >
              初级 (10以内)
            </button>
            <button
              className={`difficulty-button ${difficultyLevel === DifficultyLevel.INTERMEDIATE ? 'active' : ''}`}
              onClick={() => setExamDifficulty(DifficultyLevel.INTERMEDIATE)}
            >
              中级 (10-20混合)
            </button>
            <button
              className={`difficulty-button ${difficultyLevel === DifficultyLevel.ADVANCED ? 'active' : ''}`}
              onClick={() => setExamDifficulty(DifficultyLevel.ADVANCED)}
            >
              高级 (20以内)
            </button>
          </div>
        </div>

        <div className="setting-group">
          <h2>选择题目数量</h2>
          <select
            value={examQuestionCount}
            onChange={handleQuestionCountChange}
            className="question-count-select"
          >
            <option value="5">5题</option>
            <option value="10">10题</option>
            <option value="15">15题</option>
            <option value="20">20题</option>
          </select>
        </div>

        <div className="exam-buttons">
          <button className="back-button" onClick={backToMenu}>返回</button>
          <button className="start-button" onClick={startExamMode}>开始考试</button>
        </div>
      </div>
    );
  };

  // 练习模式界面
  const renderPracticeMode = () => {
    return (
      <div>
        <header className="game-header">
          <h1>小学生算术游戏 - 练习模式</h1>
          <div className="level-indicator">
            <span>关卡: {level}</span>
            <div className="progress-bar">
              <div
                className="progress"
                style={{width: `${(streak % 5) * 20}%`}}
              ></div>
            </div>
          </div>
          <button className="back-button small" onClick={backToMenu}>返回菜单</button>
        </header>

        <div className="game-container">
          <div className="score-board">
            <div className="score">得分: {score}</div>
            <div className="streak">连续答对: {streak}</div>
          </div>

          <div className="question-container">
            {displayQuestion()}
          </div>

          <div className="input-container">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hidden === 1 ? "输入 + 或 -" : "输入数字"}
              className="answer-input"
              autoFocus
            />
            <div className="button-group">
              <button onClick={handleAnswer} className="submit-button">
                提交答案
              </button>
              <button onClick={handleShowAnswer} className="show-answer-button">
                显示答案
              </button>
            </div>
          </div>

          {feedback && (
            <div className={`feedback ${feedbackClass}`}>
              {feedback}
            </div>
          )}
        </div>

        {showCelebration && (
          <div className="celebration">
            <h2>恭喜！你升级了！</h2>
            <p>现在是第 {level} 关</p>
          </div>
        )}
      </div>
    );
  };

  // 考试模式界面
  const renderExamMode = () => {
    return (
      <div>
        <header className="game-header">
          <h1>小学生算术游戏 - 考试模式</h1>
          <div className="exam-info">
            <div className="exam-progress">
              <span>题目: {currentQuestionIndex + 1} / {examQuestions.length}</span>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{width: `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%`}}
                ></div>
              </div>
            </div>
            <div className="exam-timer">
              <span>剩余时间: {formatTime(examTimeLeft)}</span>
            </div>
          </div>
          <div className="exam-controls">
            <button className="back-button small" onClick={backToMenu}>退出考试</button>
            <button className="submit-exam-button" onClick={handleSubmitExam}>提前交卷</button>
          </div>
        </header>

        <div className="game-container">
          <div className="question-container">
            {displayQuestion()}
          </div>

          <div className="input-container">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hidden === 1 ? "输入 + 或 -" : "输入数字"}
              className="answer-input"
              autoFocus
            />
            <div className="button-group">
              <button onClick={handleAnswer} className="submit-button">
                提交答案
              </button>
              <button onClick={handleShowAnswer} className="show-answer-button">
                显示答案
              </button>
            </div>
          </div>

          {feedback && (
            <div className={`feedback ${feedbackClass}`}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 考试结果界面
  const renderExamResult = () => {
    const correctCount = examQuestions.filter(q => q.isCorrect).length;
    const totalCount = examQuestions.length;
    const percentage = Math.round((correctCount / totalCount) * 100);

    let resultMessage = '';
    if (percentage >= 90) {
      resultMessage = '太棒了！你的数学非常好！';
    } else if (percentage >= 70) {
      resultMessage = '做得很好！继续努力！';
    } else if (percentage >= 60) {
      resultMessage = '及格了，还需要多练习！';
    } else {
      resultMessage = '需要多努力哦，再试一次吧！';
    }

    return (
      <div className="exam-result">
        <h1>考试结果</h1>

        <div className="result-summary">
          <div className="result-score">
            <span className="score-number">{correctCount}</span>
            <span className="score-divider">/</span>
            <span className="score-total">{totalCount}</span>
          </div>

          <div className="result-percentage">{percentage}%</div>

          <div className="result-message">{resultMessage}</div>
        </div>

        <div className="result-details">
          <h2>题目详情</h2>
          <div className="question-list">
            {examQuestions.map((q, index) => {
              const qCorrectAnswer = getCorrectAnswer(q.a, q.b, q.operator);
              let correctAnswerText = '';

              if (q.hidden === 0) { // A 被隐藏
                correctAnswerText = q.operator === '+' ? `${qCorrectAnswer - q.b}` : `${qCorrectAnswer + q.b}`;
              } else if (q.hidden === 1) { // 运算符被隐藏
                correctAnswerText = q.a + q.b === qCorrectAnswer ? '+' : '-';
              } else { // 结果被隐藏
                correctAnswerText = `${qCorrectAnswer}`;
              }

              let questionText = '';
              if (q.hidden === 0) {
                questionText = `? ${q.operator} ${q.b} = ${qCorrectAnswer}`;
              } else if (q.hidden === 1) {
                questionText = `${q.a} ? ${q.b} = ${qCorrectAnswer}`;
              } else {
                questionText = `${q.a} ${q.operator} ${q.b} = ?`;
              }

              return (
                <div key={index} className={`question-item ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="question-number">{index + 1}</div>
                  <div className="question-text">{questionText}</div>
                  <div className="question-answer">
                    <div>你的答案: {q.userAnswer || '未作答'}</div>
                    <div>正确答案: {correctAnswerText}</div>
                  </div>
                  <div className="question-result">
                    {q.isCorrect ? '✔️' : '✖️'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="result-buttons">
          <button className="menu-button" onClick={backToMenu}>返回菜单</button>
          <button className="retry-button" onClick={restartExam}>再次考试</button>
        </div>
      </div>
    );
  };

  // 根据游戏模式渲染不同界面
  const renderGameContent = () => {
    switch (gameMode) {
      case GameMode.MENU:
        return renderMenu();
      case GameMode.PRACTICE:
        // 如果关卡为0，表示还没有开始练习，显示设置界面
        if (level === 0) {
          return renderPracticeSettings();
        }
        return renderPracticeMode();
      case GameMode.EXAM:
        // 如果考试题目为空，则显示设置界面
        if (examQuestions.length === 0) {
          return renderExamSettings();
        }
        return renderExamMode();
      case GameMode.EXAM_RESULT:
        return renderExamResult();
      default:
        return renderMenu();
    }
  };

  // 点击考试模式按钮
  const handleExamButtonClick = () => {
    // 清空考试题目，这样会显示设置界面
    setExamQuestions([]);
    setGameMode(GameMode.EXAM);
  };

  return (
    <div className="App">
      {renderGameContent()}

      <footer className="game-footer">
        <p>小朋友加油！学好数学很重要哦！</p>
      </footer>

      {/* 音效元素 */}
      <audio ref={correctAudioRef} src={correctSound} preload="auto" />
      <audio ref={wrongAudioRef} src={wrongSound} preload="auto" />
    </div>
  );
};

export default App;
