import React from 'react';
import { DifficultyLevel } from '../types/types';

interface ExamSettingsProps {
  difficultyLevel: DifficultyLevel;
  examQuestionCount: number;
  setExamDifficulty: (difficulty: DifficultyLevel) => void;
  handleQuestionCountChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  startExamMode: () => void;
  backToMenu: () => void;
}

export const ExamSettings: React.FC<ExamSettingsProps> = ({
  difficultyLevel,
  examQuestionCount,
  setExamDifficulty,
  handleQuestionCountChange,
  startExamMode,
  backToMenu
}) => {
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