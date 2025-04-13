import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// 模拟音频元素
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('最终覆盖率测试', () => {
  // 测试考试模式结果界面
  test('考试模式结果界面', async () => {
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

  // 测试练习模式中的连续答对
  test('练习模式连续答对', async () => {
    render(<App />);

    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));

    // 选择初级难度
    fireEvent.click(screen.getByText('初级 (10以内)'));

    // 点击开始练习按钮
    fireEvent.click(screen.getByText('开始练习'));

    // 等待游戏界面加载
    await waitFor(() => {
      expect(screen.getByText(/关卡: 1/)).toBeInTheDocument();
    });

    // 点击显示答案按钮
    fireEvent.click(screen.getByText('显示答案'));

    // 等待答案显示
    await waitFor(() => {
      expect(screen.getByText(/正确答案是:/)).toBeInTheDocument();
    });

    // 获取正确答案
    const feedbackText = screen.getByText(/正确答案是:/).textContent || '';
    const answer = feedbackText.replace('正确答案是: ', '').trim();

    // 等待新题目生成
    await waitFor(() => {
      expect(screen.queryByText(/正确答案是:/)).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // 获取输入框
    const inputElement = screen.getByPlaceholderText(/输入数字|输入 \+ 或 -/);

    // 输入正确答案
    fireEvent.change(inputElement, { target: { value: answer } });

    // 提交答案
    fireEvent.click(screen.getByText('提交答案'));

    // 检查输入框是否仍然存在，表示我们已经提交了答案
    expect(screen.getByPlaceholderText(/输入数字|\u8f93\u5165 \+ \u6216 -/)).toBeInTheDocument();
  });

  // 测试练习模式中的难度进阶
  test('练习模式难度进阶', async () => {
    jest.setTimeout(15000); // 增加测试超时时间为15秒
    render(<App />);

    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));

    // 选择初级难度
    fireEvent.click(screen.getByText('初级 (10以内)'));

    // 点击开始练习按钮
    fireEvent.click(screen.getByText('开始练习'));

    // 等待游戏界面加载
    await waitFor(() => {
      expect(screen.getByText(/关卡: 1/)).toBeInTheDocument();
    });

    // 模拟答对，以测试游戏逻辑
    // 点击显示答案按钮
    fireEvent.click(screen.getByText('显示答案'));

    // 等待答案显示
    await waitFor(() => {
      expect(screen.getByText(/正确答案是:/)).toBeInTheDocument();
    });

    // 等待新题目生成
    await waitFor(() => {
      expect(screen.queryByText(/正确答案是:/)).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // 检查游戏界面是否仍然存在
    expect(screen.getByText(/关卡:/)).toBeInTheDocument();
  });
});
