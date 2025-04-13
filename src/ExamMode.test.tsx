import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// 模拟音频元素
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('考试模式测试', () => {
  // 测试考试设置界面
  test('考试设置界面显示正确', () => {
    render(<App />);
    
    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));
    
    // 检查设置界面元素
    expect(screen.getByText('考试设置')).toBeInTheDocument();
    expect(screen.getByText('选择难度级别')).toBeInTheDocument();
    expect(screen.getByText('选择题目数量')).toBeInTheDocument();
    
    // 检查难度选项
    expect(screen.getByText('初级 (10以内)')).toBeInTheDocument();
    expect(screen.getByText('中级 (10-20混合)')).toBeInTheDocument();
    expect(screen.getByText('高级 (20以内)')).toBeInTheDocument();
    
    // 检查题目数量选项
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    
    // 检查按钮
    expect(screen.getByText('返回')).toBeInTheDocument();
    expect(screen.getByText('开始考试')).toBeInTheDocument();
  });
  
  // 测试难度选择功能
  test('难度选择功能正常工作', () => {
    render(<App />);
    
    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));
    
    // 初始状态下，初级难度应该被选中
    const beginnerButton = screen.getByText('初级 (10以内)');
    const intermediateButton = screen.getByText('中级 (10-20混合)');
    const advancedButton = screen.getByText('高级 (20以内)');
    
    expect(beginnerButton.closest('button')).toHaveClass('active');
    expect(intermediateButton.closest('button')).not.toHaveClass('active');
    expect(advancedButton.closest('button')).not.toHaveClass('active');
    
    // 点击中级难度
    fireEvent.click(intermediateButton);
    
    // 中级难度应该被选中
    expect(beginnerButton.closest('button')).not.toHaveClass('active');
    expect(intermediateButton.closest('button')).toHaveClass('active');
    expect(advancedButton.closest('button')).not.toHaveClass('active');
    
    // 点击高级难度
    fireEvent.click(advancedButton);
    
    // 高级难度应该被选中
    expect(beginnerButton.closest('button')).not.toHaveClass('active');
    expect(intermediateButton.closest('button')).not.toHaveClass('active');
    expect(advancedButton.closest('button')).toHaveClass('active');
  });
  
  // 测试题目数量选择功能
  test('题目数量选择功能正常工作', () => {
    render(<App />);
    
    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));
    
    // 获取下拉选择框
    const selectElement = screen.getByRole('combobox');
    
    // 默认应该是10题
    expect(selectElement).toHaveValue('10');
    
    // 选择5题
    fireEvent.change(selectElement, { target: { value: '5' } });
    expect(selectElement).toHaveValue('5');
    
    // 选择15题
    fireEvent.change(selectElement, { target: { value: '15' } });
    expect(selectElement).toHaveValue('15');
    
    // 选择20题
    fireEvent.change(selectElement, { target: { value: '20' } });
    expect(selectElement).toHaveValue('20');
  });
  
  // 测试考试界面元素
  test('考试界面显示正确', async () => {
    render(<App />);
    
    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));
    
    // 开始考试
    fireEvent.click(screen.getByText('开始考试'));
    
    // 等待考试界面加载
    await waitFor(() => {
      // 检查标题
      expect(screen.getByText('小学生算术游戏 - 考试模式')).toBeInTheDocument();
      
      // 检查题目进度
      expect(screen.getByText(/题目: 1 \//)).toBeInTheDocument();
      
      // 检查倒计时
      expect(screen.getByText(/剩余时间:/)).toBeInTheDocument();
      
      // 检查按钮
      expect(screen.getByText('退出考试')).toBeInTheDocument();
      expect(screen.getByText('提前交卷')).toBeInTheDocument();
      expect(screen.getByText('提交答案')).toBeInTheDocument();
      expect(screen.getByText('显示答案')).toBeInTheDocument();
    });
  });
  
  // 测试提前交卷功能
  test('提前交卷功能正常工作', async () => {
    render(<App />);
    
    // 进入考试模式
    fireEvent.click(screen.getByText('考试模式'));
    
    // 开始考试
    fireEvent.click(screen.getByText('开始考试'));
    
    // 等待考试界面加载
    await waitFor(() => {
      expect(screen.getByText('提前交卷')).toBeInTheDocument();
    });
    
    // 点击提前交卷按钮
    fireEvent.click(screen.getByText('提前交卷'));
    
    // 等待结果界面加载
    await waitFor(() => {
      // 检查结果界面元素
      expect(screen.getByText('考试结果')).toBeInTheDocument();
      expect(screen.getByText(/\d+%/)).toBeInTheDocument(); // 百分比分数
      expect(screen.getByText('题目详情')).toBeInTheDocument();
      
      // 检查按钮
      expect(screen.getByText('返回菜单')).toBeInTheDocument();
      expect(screen.getByText('再次考试')).toBeInTheDocument();
    });
  });
});
