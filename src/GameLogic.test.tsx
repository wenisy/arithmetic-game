import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// 模拟音频元素
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('游戏逻辑测试', () => {
  // 测试难度选择功能
  test('练习模式难度选择', () => {
    render(<App />);

    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));

    // 检查难度选项
    const beginnerButton = screen.getByText('初级 (10以内)');
    const intermediateButton = screen.getByText('中级 (10-20混合)');
    const advancedButton = screen.getByText('高级 (20以内)');

    expect(beginnerButton).toBeInTheDocument();
    expect(intermediateButton).toBeInTheDocument();
    expect(advancedButton).toBeInTheDocument();
  });

  // 测试考试模式难度选择
  test('考试模式难度选择', () => {
    render(<App />);

    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));

    // 检查难度选项
    const beginnerButton = screen.getByText('初级 (10以内)');
    const intermediateButton = screen.getByText('中级 (10-20混合)');
    const advancedButton = screen.getByText('高级 (20以内)');

    expect(beginnerButton).toBeInTheDocument();
    expect(intermediateButton).toBeInTheDocument();
    expect(advancedButton).toBeInTheDocument();

    // 检查题目数量选择
    expect(screen.getByText('选择题目数量')).toBeInTheDocument();
  });

  // 测试练习模式开始游戏
  test('练习模式开始游戏', async () => {
    render(<App />);

    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));

    // 点击开始练习按钮
    fireEvent.click(screen.getByText('开始练习'));

    // 等待游戏界面加载
    await waitFor(() => {
      expect(screen.getByText(/关卡: 1/)).toBeInTheDocument();
    });

    // 检查游戏界面元素
    expect(screen.getByText(/得分: 0/)).toBeInTheDocument();
    expect(screen.getByText(/连续答对: 0/)).toBeInTheDocument();
    expect(screen.getByText('显示答案')).toBeInTheDocument();
  });

  // 测试显示答案功能
  test('显示答案功能', async () => {
    render(<App />);

    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));

    // 点击开始练习按钮
    fireEvent.click(screen.getByText('开始练习'));

    // 等待游戏界面加载
    await waitFor(() => {
      expect(screen.getByText(/关卡: 1/)).toBeInTheDocument();
    });

    // 点击显示答案按钮
    fireEvent.click(screen.getByText('显示答案'));

    // 检查是否显示了答案
    await waitFor(() => {
      expect(screen.getByText(/正确答案是:/)).toBeInTheDocument();
    });
  });
});
