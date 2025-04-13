import React from 'react';
import { Question } from './types';

interface ExamModeProps {
  a: number;
  b: number;
  operator: string;
  hidden: number;
  userAnswer: string;
  feedback: string;
  feedbackClass: string;
  currentQuestionIndex: number;
  examQuestions: Question[];
  examTimeLeft: number;
  setUserAnswer: (answer: string) => void;
  handleAnswer: () => void;
  handleShowAnswer: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSubmitExam: () => void;
  backToMenu: () => void;
  formatTime: (seconds: number) => string;
  correctAnswer: number;
}

export const ExamMode: React.FC<ExamModeProps> = ({
  a,
  b,
  operator,
  hidden,
  userAnswer,
  feedback,
  feedbackClass,
  currentQuestionIndex,
  examQuestions,
  examTimeLeft,
  setUserAnswer,
  handleAnswer,
  handleShowAnswer,
  handleKeyDown,
  handleSubmitExam,
  backToMenu,
  formatTime,
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