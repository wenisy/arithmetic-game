import React, { useRef } from 'react';

// 导入音效
import correctSound from './sounds/correct.mp3';
import wrongSound from './sounds/wrong.mp3';

export const SoundManager: React.FC = () => {
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

  return (
    <>
      <audio ref={correctAudioRef} src={correctSound} preload="auto" />
      <audio ref={wrongAudioRef} src={wrongSound} preload="auto" />
    </>
  );
};

// 导出音效播放函数以便在其他组件中使用
export const useSound = () => {
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  const playCorrectSound = () => {
    if (correctAudioRef.current) {
      correctAudioRef.current.currentTime = 0;
      correctAudioRef.current.play();
    }
  };

  const playWrongSound = () => {
    if (wrongAudioRef.current) {
      wrongAudioRef.current.currentTime = 0;
      wrongAudioRef.current.play();
    }
  };

  return { playCorrectSound, playWrongSound, correctAudioRef, wrongAudioRef };
};