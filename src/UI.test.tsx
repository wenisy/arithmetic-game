import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// 模拟音频元素
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('UI组件测试', () => {
  // 测试主菜单UI
  test('主菜单UI', () => {
    render(<App />);
    
    // 检查标题
    expect(screen.getByText('小学生算术游戏')).toBeInTheDocument();
    
    // 检查按钮
    expect(screen.getByText('练习模式')).toBeInTheDocument();
    expect(screen.getByText('考试模式')).toBeInTheDocument();
    
    // 检查页脚
    expect(screen.getByText(/小朋友加油/)).toBeInTheDocument();
  });
  
  // 测试练习模式UI
  test('练习模式UI', async () => {
    render(<App />);
    
    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));
    
    // 检查设置界面
    expect(screen.getByText('练习模式设置')).toBeInTheDocument();
    expect(screen.getByText('选择难度级别')).toBeInTheDocument();
    expect(screen.getByText('返回')).toBeInTheDocument();
    expect(screen.getByText('开始练习')).toBeInTheDocument();
    
    // 点击开始练习
    fireEvent.click(screen.getByText('开始练习'));
    
    // 等待游戏界面加载
    await waitFor(() => {
      expect(screen.getByText(/关卡: 1/)).toBeInTheDocument();
    });
    
    // 检查游戏界面元素
    expect(screen.getByText(/得分: 0/)).toBeInTheDocument();
    expect(screen.getByText(/连续答对: 0/)).toBeInTheDocument();
    expect(screen.getByText('提交答案')).toBeInTheDocument();
    expect(screen.getByText('显示答案')).toBeInTheDocument();
    expect(screen.getByText('返回菜单')).toBeInTheDocument();
    
    // 检查输入框
    expect(screen.getByPlaceholderText(/输入数字|输入 \+ 或 -/)).toBeInTheDocument();
  });
  
  // 测试考试模式UI
  test('考试模式UI', async () => {
    render(<App />);
    
    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));
    
    // 检查设置界面
    expect(screen.getByText('考试设置')).toBeInTheDocument();
    expect(screen.getByText('选择难度级别')).toBeInTheDocument();
    expect(screen.getByText('选择题目数量')).toBeInTheDocument();
    expect(screen.getByText('返回')).toBeInTheDocument();
    expect(screen.getByText('开始考试')).toBeInTheDocument();
    
    // 点击开始考试
    fireEvent.click(screen.getByText('开始考试'));
    
    // 等待考试界面加载
    await waitFor(() => {
      expect(screen.getByText(/题目: 1 \//)).toBeInTheDocument();
    });
    
    // 检查考试界面元素
    expect(screen.getByText(/剩余时间:/)).toBeInTheDocument();
    expect(screen.getByText('提交答案')).toBeInTheDocument();
    expect(screen.getByText('显示答案')).toBeInTheDocument();
    expect(screen.getByText('退出考试')).toBeInTheDocument();
    expect(screen.getByText('提前交卷')).toBeInTheDocument();
    
    // 检查输入框
    expect(screen.getByPlaceholderText(/输入数字|输入 \+ 或 -/)).toBeInTheDocument();
  });
  
  // 测试考试结果UI
  test('考试结果UI', async () => {
    render(<App />);
    
    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));
    
    // 点击开始考试
    fireEvent.click(screen.getByText('开始考试'));
    
    // 等待考试界面加载
    await waitFor(() => {
      expect(screen.getByText(/题目: 1 \//)).toBeInTheDocument();
    });
    
    // 点击提前交卷
    fireEvent.click(screen.getByText('提前交卷'));
    
    // 等待结果界面加载
    await waitFor(() => {
      expect(screen.getByText('考试结果')).toBeInTheDocument();
    });
    
    // 检查结果界面元素
    expect(screen.getByText(/\d+%/)).toBeInTheDocument();
    expect(screen.getByText('题目详情')).toBeInTheDocument();
    expect(screen.getByText('返回菜单')).toBeInTheDocument();
    expect(screen.getByText('再次考试')).toBeInTheDocument();
  });
});
