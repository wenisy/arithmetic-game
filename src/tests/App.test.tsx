import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// 模拟音频元素
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('算术游戏测试', () => {
  // 测试主菜单渲染
  test('渲染主菜单', () => {
    render(<App />);

    // 检查标题是否存在
    expect(screen.getByText('小学生算术游戏')).toBeInTheDocument();

    // 检查菜单按钮是否存在
    expect(screen.getByText('练习模式')).toBeInTheDocument();
    expect(screen.getByText('考试模式')).toBeInTheDocument();
  });
});

