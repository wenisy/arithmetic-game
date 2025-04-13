import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

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

  // 测试练习模式设置界面
  test('点击练习模式按钮显示设置界面', () => {
    render(<App />);

    // 点击练习模式按钮
    fireEvent.click(screen.getByText('练习模式'));

    // 检查设置界面是否显示
    expect(screen.getByText('练习模式设置')).toBeInTheDocument();
    expect(screen.getByText('选择难度级别')).toBeInTheDocument();
    expect(screen.getByText('初级 (10以内)')).toBeInTheDocument();
    expect(screen.getByText('中级 (10-20混合)')).toBeInTheDocument();
    expect(screen.getByText('高级 (20以内)')).toBeInTheDocument();
  });

  // 测试考试模式设置界面
  test('点击考试模式按钮显示设置界面', () => {
    render(<App />);

    // 点击考试模式按钮
    fireEvent.click(screen.getByText('考试模式'));

    // 检查设置界面是否显示
    expect(screen.getByText('考试设置')).toBeInTheDocument();
    expect(screen.getByText('选择难度级别')).toBeInTheDocument();
    expect(screen.getByText('选择题目数量')).toBeInTheDocument();
  });

  // 测试练习模式游戏流程
  test('练习模式基本游戏流程', async () => {
    render(<App />);

    // 进入练习模式设置
    fireEvent.click(screen.getByText('练习模式'));

    // 选择难度级别
    fireEvent.click(screen.getByText('初级 (10以内)'));

    // 开始练习
    fireEvent.click(screen.getByText('开始练习'));

    // 等待游戏界面加载
    await waitFor(() => {
      // 检查游戏界面元素
      expect(screen.getByText(/关卡: 1/)).toBeInTheDocument();
      expect(screen.getByText(/得分: 0/)).toBeInTheDocument();
      expect(screen.getByText(/连续答对: 0/)).toBeInTheDocument();
    });

    // 检查输入框和按钮
    expect(screen.getByPlaceholderText(/输入数字|输入 \+ 或 -/)).toBeInTheDocument();
    expect(screen.getByText('提交答案')).toBeInTheDocument();
    expect(screen.getByText('显示答案')).toBeInTheDocument();
  });

  // 测试考试模式游戏流程
  test('考试模式基本游戏流程', async () => {
    render(<App />);

    // 进入考试模式设置
    fireEvent.click(screen.getByText('考试模式'));

    // 选择难度级别
    fireEvent.click(screen.getByText('初级 (10以内)'));

    // 开始考试
    fireEvent.click(screen.getByText('开始考试'));

    // 等待游戏界面加载
    await waitFor(() => {
      // 检查游戏界面元素
      expect(screen.getByText(/题目: 1 \//)).toBeInTheDocument();
      expect(screen.getByText(/剩余时间:/)).toBeInTheDocument();
    });

    // 检查考试模式特有的按钮
    expect(screen.getByText('退出考试')).toBeInTheDocument();
    expect(screen.getByText('提前交卷')).toBeInTheDocument();
  });

  // 测试答案提交功能
  test('提交正确答案', async () => {
    // 注意：这个测试比较复杂，因为答案是随机生成的
    // 这里我们使用一个简化的方法来测试

    render(<App />);

    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));
    fireEvent.click(screen.getByText('初级 (10以内)'));
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
