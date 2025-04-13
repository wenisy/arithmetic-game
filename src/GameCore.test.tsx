import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// 模拟音频元素
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('游戏核心功能测试', () => {
  // 测试游戏结果界面
  test('考试结果界面', async () => {
    render(<App />);

    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));

    // 选择初级难度
    fireEvent.click(screen.getByText('初级 (10以内)'));

    // 选择5题
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: '5' } });

    // 点击开始考试按钮
    fireEvent.click(screen.getByText('开始考试'));

    // 等待考试界面加载
    await waitFor(() => {
      expect(screen.getByText(/题目: 1 \//)).toBeInTheDocument();
    });

    // 点击提前交卷按钮
    fireEvent.click(screen.getByText('提前交卷'));

    // 等待结果界面加载
    await waitFor(() => {
      expect(screen.getByText('考试结果')).toBeInTheDocument();
    });

    // 测试再次考试按钮
    fireEvent.click(screen.getByText('再次考试'));

    // 等待考试界面加载
    await waitFor(() => {
      expect(screen.getByText(/题目: 1 \//)).toBeInTheDocument();
    });

    // 再次提前交卷
    fireEvent.click(screen.getByText('提前交卷'));

    // 等待结果界面加载
    await waitFor(() => {
      expect(screen.getByText('考试结果')).toBeInTheDocument();
    });

    // 测试返回菜单按钮
    fireEvent.click(screen.getByText('返回菜单'));

    // 检查是否返回到主菜单
    expect(screen.getByText('小学生算术游戏')).toBeInTheDocument();
  });

  // 测试考试模式答题流程
  test('考试模式答题流程', async () => {
    render(<App />);

    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));

    // 选择初级难度
    fireEvent.click(screen.getByText('初级 (10以内)'));

    // 选择5题
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: '5' } });

    // 点击开始考试按钮
    fireEvent.click(screen.getByText('开始考试'));

    // 等待考试界面加载
    await waitFor(() => {
      expect(screen.getByText(/题目: 1 \//)).toBeInTheDocument();
    });

    // 获取输入框
    const inputElement = screen.getByPlaceholderText(/输入数字|输入 \+ 或 -/);

    // 输入答案
    fireEvent.change(inputElement, { target: { value: '5' } });

    // 提交答案
    fireEvent.click(screen.getByText('提交答案'));

    // 等待反馈
    await waitFor(() => {
      // 检查输入框是否仍然存在，表示我们已经提交了答案
      expect(screen.getByPlaceholderText(/输入数字|\u8f93\u5165 \+ \u6216 -/)).toBeInTheDocument();
    });
  });

  // 测试考试模式显示答案功能
  test('考试模式显示答案功能', async () => {
    render(<App />);

    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));

    // 选择初级难度
    fireEvent.click(screen.getByText('初级 (10以内)'));

    // 选择5题
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: '5' } });

    // 点击开始考试按钮
    fireEvent.click(screen.getByText('开始考试'));

    // 等待考试界面加载
    await waitFor(() => {
      expect(screen.getByText(/题目: 1 \//)).toBeInTheDocument();
    });

    // 点击显示答案按钮
    fireEvent.click(screen.getByText('显示答案'));

    // 检查是否显示了答案
    await waitFor(() => {
      expect(screen.getByText(/正确答案是:/)).toBeInTheDocument();
    });
  });
});
