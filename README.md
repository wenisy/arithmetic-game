# 小学生算术游戏

一个帮助小学生练习加减法的互动游戏，支持练习模式和考试模式。

## 功能特点

- **练习模式**：随机生成加减法题目，难度随关卡提升
- **考试模式**：可选择难度级别和题目数量
- **多种题型**：随机隐藏算式中的一个数字（A、运算符或结果）
- **显示答案**：提供显示答案按钮（计为错误）
- **成绩统计**：考试结束后显示详细成绩报告

## 技术栈

- React
- TypeScript
- CSS3

## 项目结构

```
src/
├── assets/         # 静态资源
│   └── sounds/     # 音效文件
├── components/     # UI 组件
├── contexts/       # React 上下文
├── hooks/          # 自定义 hooks
├── tests/          # 测试文件
├── types/          # 类型定义
├── utils/          # 工具函数
├── App.tsx         # 应用程序主组件
├── App.css         # 应用程序样式
├── index.tsx       # 应用程序入口
└── index.css       # 全局样式
```

## 开始使用

在项目目录中，你可以运行：

### `npm start`

在开发模式下运行应用程序。\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
