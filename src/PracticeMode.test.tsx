import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// 模拟音频元素
window.HTMLMediaElement.prototype.play = jest.fn();
window.HTMLMediaElement.prototype.pause = jest.fn();

describe('练习模式测试', () => {
  // 测试练习设置界面
  test('练习设置界面显示正确', () => {
    render(<App />);
    
    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));
    
    // 检查设置界面元素
    expect(screen.getByText('练习模式设置')).toBeInTheDocument();
    expect(screen.getByText('选择难度级别')).toBeInTheDocument();
    
    // 检查难度选项
    expect(screen.getByText('初级 (10以内)')).toBeInTheDocument();
    expect(screen.getByText('中级 (10-20混合)')).toBeInTheDocument();
    expect(screen.getByText('高级 (20以内)')).toBeInTheDocument();
    
    // 检查按钮
    expect(screen.getByText('返回')).toBeInTheDocument();
    expect(screen.getByText('开始练习')).toBeInTheDocument();
  });
  
  // 测试难度选择功能
  test('难度选择功能正常工作', () => {
    render(<App />);
    
    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));
    
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
  
  // 测试练习界面元素
  test('练习界面显示正确', async () => {
    render(<App />);
    
    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));
    
    // 开始练习
    fireEvent.click(screen.getByText('开始练习'));
    
    // 等待练习界面加载
    await waitFor(() => {
      // 检查标题
      expect(screen.getByText('小学生算术游戏 - 练习模式')).toBeInTheDocument();
      
      // 检查关卡和分数
      expect(screen.getByText(/关卡: 1/)).toBeInTheDocument();
      expect(screen.getByText(/得分: 0/)).toBeInTheDocument();
      expect(screen.getByText(/连续答对: 0/)).toBeInTheDocument();
      
      // 检查按钮
      expect(screen.getByText('返回菜单')).toBeInTheDocument();
      expect(screen.getByText('提交答案')).toBeInTheDocument();
      expect(screen.getByText('显示答案')).toBeInTheDocument();
    });
  });
  
  // 测试显示答案功能
  test('显示答案功能正常工作', async () => {
    render(<App />);
    
    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));
    
    // 开始练习
    fireEvent.click(screen.getByText('开始练习'));
    
    // 等待练习界面加载
    await waitFor(() => {
      expect(screen.getByText('显示答案')).toBeInTheDocument();
    });
    
    // 点击显示答案按钮
    fireEvent.click(screen.getByText('显示答案'));
    
    // 检查是否显示了答案
    await waitFor(() => {
      expect(screen.getByText(/正确答案是:/)).toBeInTheDocument();
    });
  });
  
  // 测试返回菜单功能
  test('返回菜单功能正常工作', async () => {
    render(<App />);
    
    // 进入练习模式
    fireEvent.click(screen.getByText('练习模式'));
    
    // 开始练习
    fireEvent.click(screen.getByText('开始练习'));
    
    // 等待练习界面加载
    await waitFor(() => {
      expect(screen.getByText('返回菜单')).toBeInTheDocument();
    });
    
    // 点击返回菜单按钮
    fireEvent.click(screen.getByText('返回菜单'));
    
    // 检查是否返回到主菜单
    await waitFor(() => {
      expect(screen.getByText('小学生算术游戏')).toBeInTheDocument();
      expect(screen.getByText('练习模式')).toBeInTheDocument();
      expect(screen.getByText('考试模式')).toBeInTheDocument();
    });
  });
});
