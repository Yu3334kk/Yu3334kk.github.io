# 余卓谚 · 个人介绍页

终端风格的自我介绍。Vite + React 19 + TypeScript + Tailwind v4，纯静态，没有后端、没有外部 CDN 依赖。

## 在线地址

| | 地址 |
| --- | --- |
| 主 | https://yuzhuoyan.netlify.app/ |
| 备用 | https://yu3334kk.github.io/ |

两个地址内容完全一致，都是同一个 `dist/` 构建产物。

## 本地跑起来

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 dist/
```

`vite.config.ts` 里 `base` 用的是相对路径，所以 `npm run build` 之后**直接双击 `dist/index.html` 就能离线打开**，不依赖任何服务器。

## 改内容

所有会变的文字集中在 `src/content.ts` 一个文件里。改介绍、加作品、换联系方式都只动这个文件，不需要碰任何组件。

## 部署

- **GitHub Pages**：push 到 `main` 后由 `.github/workflows/deploy.yml` 自动构建发布
- **Netlify**：站点名 `yuzhuoyan`，上传 `dist/` 目录内容

## 这个页面是怎么做出来的

不是一次写对的。几次真实的取舍和翻车记录在页面最后一个区块里，也可以在 commit 历史里逐步看到。
