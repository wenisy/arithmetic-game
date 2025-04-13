import React from 'react';
import { GameMode } from './types';

interface MenuProps {
  setGameMode: (mode: GameMode) => void;
  handlePracticeButtonClick: () => void;
  handleExamButtonClick: () => void;
}

export const Menu: React.FC<MenuProps> = ({ setGameMode, handlePracticeButtonClick, handleExamButtonClick }) => {
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