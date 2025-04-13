import React from 'react';
import { Question } from '../types/types';
import { getCorrectAnswer } from '../utils/GameLogic';

interface ExamResultProps {
  examQuestions: Question[];
  backToMenu: () => void;
  restartExam: () => void;
}

export const ExamResult: React.FC<ExamResultProps> = ({ examQuestions, backToMenu, restartExam }) => {
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