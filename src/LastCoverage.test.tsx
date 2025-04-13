import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// 模拟音频元素
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('最后覆盖率测试', () => {
  // 测试练习模式中的返回按钮
  test('练习模式返回按钮', async () => {
    render(<App />);
    
    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));
    
    // 检查返回按钮
    expect(screen.getByText('返回')).toBeInTheDocument();
    
    // 点击返回按钮
    fireEvent.click(screen.getByText('返回'));
    
    // 检查是否返回到主菜单
    expect(screen.getByText('小学生算术游戏')).toBeInTheDocument();
  });
  
  // 测试考试模式中的返回按钮
  test('考试模式返回按钮', async () => {
    render(<App />);
    
    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));
    
    // 检查返回按钮
    expect(screen.getByText('返回')).toBeInTheDocument();
    
    // 点击返回按钮
    fireEvent.click(screen.getByText('返回'));
    
    // 检查是否返回到主菜单
    expect(screen.getByText('小学生算术游戏')).toBeInTheDocument();
  });
  
  // 测试练习模式中的数字输入
  test('练习模式数字输入', async () => {
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
    
    // 输入数字
    fireEvent.change(inputElement, { target: { value: '5' } });
    
    // 提交答案
    fireEvent.click(screen.getByText('提交答案'));
    
    // 检查游戏界面是否仍然存在
    expect(screen.getByText(/关卡: 1/)).toBeInTheDocument();
  });
  
  // 测试考试模式中的数字输入
  test('考试模式数字输入', async () => {
    render(<App />);
    
    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));
    
    // 选择初级难度
    fireEvent.click(screen.getByText('初级 (10以内)'));
    
    // 点击开始考试按钮
    fireEvent.click(screen.getByText('开始考试'));
    
    // 等待考试界面加载
    await waitFor(() => {
      expect(screen.getByText(/题目: 1 \//)).toBeInTheDocument();
    });
    
    // 获取输入框
    const inputElement = screen.getByPlaceholderText(/输入数字|输入 \+ 或 -/);
    
    // 输入数字
    fireEvent.change(inputElement, { target: { value: '5' } });
    
    // 提交答案
    fireEvent.click(screen.getByText('提交答案'));
    
    // 检查考试界面是否仍然存在
    expect(screen.getByText(/题目:/)).toBeInTheDocument();
  });
});
