import React from 'react';
import { DifficultyLevel } from '../types/types';

interface PracticeSettingsProps {
  practiceDifficulty: DifficultyLevel;
  setPracticeDifficultyLevel: (difficulty: DifficultyLevel) => void;
  startPracticeMode: () => void;
  backToMenu: () => void;
}

export const PracticeSettings: React.FC<PracticeSettingsProps> = ({
  practiceDifficulty,
  setPracticeDifficultyLevel,
  startPracticeMode,
  backToMenu
}) => {
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