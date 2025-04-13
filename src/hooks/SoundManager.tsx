import React, { useRef } from 'react';

// 导入音效
import correctSound from '../assets/sounds/correct.mp3';
import wrongSound from '../assets/sounds/wrong.mp3';

/**
 * 音效组件，用于预加载音效文件
 */
export const SoundManager: React.FC = () => {
  // 音效引用
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <>
      <audio ref={correctAudioRef} src={correctSound} preload="auto" />
      <audio ref={wrongAudioRef} src={wrongSound} preload="auto" />
    </>
  );
};

// 导出音效播放函数以便在其他组件中使用
export const useSound = () => {
  // 直接创建音频对象
  const correctAudio = new Audio(correctSound);
  const wrongAudio = new Audio(wrongSound);

  const playCorrectSound = () => {
    correctAudio.currentTime = 0;
    correctAudio.play().catch(err => console.error('Error playing correct sound:', err));
  };

  const playWrongSound = () => {
    wrongAudio.currentTime = 0;
    wrongAudio.play().catch(err => console.error('Error playing wrong sound:', err));
  };

  return { playCorrectSound, playWrongSound };
};