import React from 'react';

interface PracticeModeProps {
  level: number;
  score: number;
  streak: number;
  a: number;
  b: number;
  operator: string;
  hidden: number;
  userAnswer: string;
  feedback: string;
  feedbackClass: string;
  showCelebration: boolean;
  setUserAnswer: (answer: string) => void;
  handleAnswer: () => void;
  handleShowAnswer: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  backToMenu: () => void;
  correctAnswer: number;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  level,
  score,
  streak,
  a,
  b,
  operator,
  hidden,
  userAnswer,
  feedback,
  feedbackClass,
  showCelebration,
  setUserAnswer,
  handleAnswer,
  handleShowAnswer,
  handleKeyDown,
  backToMenu,
  correctAnswer
}) => {
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