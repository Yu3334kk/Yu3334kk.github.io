// 这个页面所有会变的文字都集中在这里。改文案只动这个文件，不用碰组件。

export const content = {
  name: "余卓谚",
  tagline: "把想法快速变成能点的东西",
  school: "杭州电子科技大学 · 25 级 · 自动化",

  about: [
    "会 Python，正在学 vibe coding —— 用 AI 把想法直接做成能跑的东西。",
    "基础算不上扎实，所以我换了个顺序：先做出来，再回头搞懂为什么。",
    "形容自己会用两个词：追逐力和耐心。决定要做的事会一直追，做得慢也不中途放下。",
  ],

  focus: [
    { title: "中国电子杯", status: "备赛中", note: "第一次正经参赛，没什么基础，在实践中补" },
    { title: "Vibe AI Lab 社团", status: "考核中", note: "你现在看的这个页面就是考核作品" },
    {
      title: "做一个自己的游戏",
      status: "下一步",
      note: "从玩的人变成做的人，先从一个能玩的小东西开始",
    },
  ],

  skills: [
    { name: "Python", level: "在用", note: "课程作业和自己的小脚本" },
    { name: "vibe coding", level: "在学", note: "和 AI 协作，把想法快速变成实现" },
    { name: "AI 应用", level: "在了解", note: "大模型 / Agent / MCP / RAG" },
    { name: "网页前端", level: "这次现学", note: "这个页面本身就是学习记录" },
  ],

  interests: [
    { name: "游戏", note: "无畏契约 / Steam。玩的时候总忍不住想它是怎么做出来的" },
    { name: "羽毛球", note: "有空就打" },
    { name: "健身", note: "正在坚持" },
  ],

  contact: {
    wechat: "KimucoaLe_",
    github: "Yu3334kk", // 联系区和终端命令都会读这一行
  },

  repo: "Yu3334kk/Yu3334kk.github.io",

  // 这个页面开发过程中真实发生的取舍和翻车，不是事后编的漂亮话
  process: [
    {
      title: "先砍掉 3D 方案",
      note: "GitHub 上最炫的 3D 作品集要么停更两年，要么没有许可证，要么改一个技能名就得重开 3D 编辑器。考核只有三天，再好看也砍。",
    },
    {
      title: "文案全部抽进 content.ts",
      note: "改介绍永远不用碰组件。这个文件是我唯一需要长期维护的东西。",
    },
    {
      title: "中文对齐翻车",
      note: "等宽字体里汉字宽度是 ASCII 的两倍，用空格排的列全歪了。改成 · 分隔，放弃列对齐。",
    },
    {
      title: "终端把主角顶出屏幕",
      note: "内部滚动加固定高度，导致最关键的 $ whoami 第一眼看不见。去掉滚动，终端里只留短行。",
    },
    {
      title: "手机端输入框被裁",
      note: "flex 子项没设 min-w-0，w-full 和 flex-1 打架导致溢出。桌面端完全看不出来。",
    },
  ],
};
