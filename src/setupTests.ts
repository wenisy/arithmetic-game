// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// 模拟 Audio 对象，因为 JSDOM 不支持音频播放
class MockAudio {
  src: string;
  currentTime: number = 0;

  constructor(src: string) {
    this.src = src;
  }

  play() {
    // 返回一个空的已解决的 Promise
    return Promise.resolve();
  }

  pause() {}
}

// 全局替换 Audio 对象
global.Audio = MockAudio as any;

// 模拟 HTMLMediaElement
window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = jest.fn();
