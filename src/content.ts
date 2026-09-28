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

  // 这个页面里人和 AI 各自负责什么
  division: [
    {
      who: "我定方向",
      items: [
        "砍掉 3D 模板：最炫的几个要么停更两年，要么没有许可证，要么改一个字得重开 3D 编辑器",
        "首屏只留一个交互点，不做多效果叠加",
      ],
    },
    {
      who: "我验效果",
      items: [
        "手机走流量打开：同一个网络能开，不代表评审能开",
        "390px 下量布局：连点 7 条命令会把页面撑到 3900px",
        "粒子跟不住光标：量出画布 469px、视口 517px",
      ],
    },
    {
      who: "AI 写实现",
      items: [
        "组件、CSS、构建与部署脚本",
        "定位根因：canvas 是替换元素，inset-0 不会把它拉伸",
        "把全部文案抽进单个 content.ts",
      ],
    },
  ],

  // 真实 commit（短哈希 + 精简过的说明），完整信息在仓库里
  commits: [
    { hash: "31fa14a", text: "fix: 粒子偏移，画布 469px ≠ 视口 517px" },
    { hash: "94ad39c", text: "ci: push 后自动同步 Netlify" },
    { hash: "e833734", text: "fix: 手机端输出封顶、卡片改横滑" },
    { hash: "c0a209a", text: "fix: 窄屏输入框溢出、文字糊成一行" },
    { hash: "417262b", text: "feat: 开发过程模块 + log 命令" },
    { hash: "dfe6bfa", text: "feat: 终端风格个人介绍页" },
    { hash: "247caf2", text: "上一版：一个浅色卡片占位页" },
  ],
};
