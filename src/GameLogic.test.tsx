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

    // 点击不同的难度级别
    fireEvent.click(intermediateButton);
    expect(intermediateButton.closest('button')).toHaveClass('active');

    fireEvent.click(advancedButton);
    expect(advancedButton.closest('button')).toHaveClass('active');

    fireEvent.click(beginnerButton);
    expect(beginnerButton.closest('button')).toHaveClass('active');
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

    // 选择不同的难度级别
    fireEvent.click(intermediateButton);
    expect(intermediateButton.closest('button')).toHaveClass('active');

    fireEvent.click(advancedButton);
    expect(advancedButton.closest('button')).toHaveClass('active');

    // 选择不同的题目数量
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: '5' } });
    expect(selectElement).toHaveValue('5');

    fireEvent.change(selectElement, { target: { value: '15' } });
    expect(selectElement).toHaveValue('15');
  });

  // 测试练习模式开始游戏
  test('练习模式开始游戏', async () => {
    render(<App />);

    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));

    // 选择高级难度
    fireEvent.click(screen.getByText('高级 (20以内)'));

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

    // 测试返回菜单按钮
    fireEvent.click(screen.getByText('返回菜单'));
    expect(screen.getByText('小学生算术游戏')).toBeInTheDocument();
    expect(screen.getByText('练习模式')).toBeInTheDocument();
    expect(screen.getByText('考试模式')).toBeInTheDocument();
  });

  // 测试考试模式开始游戏
  test('考试模式开始游戏', async () => {
    render(<App />);

    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));

    // 选择中级难度
    fireEvent.click(screen.getByText('中级 (10-20混合)'));

    // 选择5题
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: '5' } });

    // 点击开始考试按钮
    fireEvent.click(screen.getByText('开始考试'));

    // 等待考试界面加载
    await waitFor(() => {
      expect(screen.getByText(/题目: 1 \//)).toBeInTheDocument();
    });

    // 检查考试界面元素
    expect(screen.getByText(/剩余时间:/)).toBeInTheDocument();
    expect(screen.getByText('退出考试')).toBeInTheDocument();
    expect(screen.getByText('提前交卷')).toBeInTheDocument();

    // 测试退出考试按钮
    fireEvent.click(screen.getByText('退出考试'));
    expect(screen.getByText('小学生算术游戏')).toBeInTheDocument();
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

    // 等待新题目生成
    await waitFor(() => {
      // 检查反馈信息是否消失
      expect(screen.queryByText(/正确答案是:/)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // 测试提交答案功能
  test('提交答案功能', async () => {
    render(<App />);

    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));

    // 点击开始练习按钮
    fireEvent.click(screen.getByText('开始练习'));

    // 等待游戏界面加载
    await waitFor(() => {
      expect(screen.getByText(/关卡: 1/)).toBeInTheDocument();
    });

    // 获取输入框
    const inputElement = screen.getByPlaceholderText(/输入数字|输入 \+ 或 -/);

    // 输入错误答案
    fireEvent.change(inputElement, { target: { value: 'abc' } });
    fireEvent.click(screen.getByText('提交答案'));

    // 检查错误提示
    // 根据隐藏的元素不同，错误提示也不同
    const errorFeedback = screen.queryByText(/请输入一个数字/) || screen.queryByText(/请输入 \+ 或 -/);
    expect(errorFeedback).toBeInTheDocument();
  });

  // 测试考试模式提前交卷
  test('考试模式提前交卷', async () => {
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

    // 检查结果界面元素
    expect(screen.getByText(/\d+%/)).toBeInTheDocument(); // 百分比分数
    expect(screen.getByText('题目详情')).toBeInTheDocument();
    expect(screen.getByText('返回菜单')).toBeInTheDocument();
    expect(screen.getByText('再次考试')).toBeInTheDocument();
  });
});
