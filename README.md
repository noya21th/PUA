# PUA了吗？| PUA Tetris

> 用俄罗斯方块消灭职场黑话和 PUA 话术！
> Destroy workplace buzzwords & PUA jargon with Tetris!

## 在线玩 | Play Online

👉 **https://noya21th.github.io/PUA/**

## 游戏截图 | Screenshot

<p align="center">
  <img src="screenshot.png" alt="PUA Tetris Screenshot" width="600">
</p>

## 玩法说明 | How to Play

### 中文

这是一款以职场黑话和 PUA 话术为主题的俄罗斯方块游戏。

- 每个掉落的方块都由一个职场黑话或 PUA 词汇组成（如"底层逻辑"、"灵魂拷问"、"毕业警告"等）
- 每个汉字占一格，词汇会组成不同的俄罗斯方块形状
- 填满一行即可消除，消除时会收到一句 **PUA 式夸奖**（越多行越毒）
- 共 **99 级**，前期升级快给你满足感，后期越来越难
- 高等级会出现更长的词汇和更刁钻的形状
- 达到 Lv.99 **PUA之王** 将获得马赛克风皇冠！

**操作方式：**

| 操作 | 键盘 | 手机 |
|------|------|------|
| 左移 | ← | 左按钮 / 左滑 |
| 右移 | → | 右按钮 / 右滑 |
| 旋转 | ↑ | 旋转按钮 / 点击 |
| 加速 | ↓ | 下按钮 |
| 直落 | 空格 | 落按钮 / 下滑 |
| 暂停 | P | — |

### English

A Tetris game themed around Chinese workplace buzzwords and PUA (manipulative) jargon.

- Each falling piece is made of a workplace buzzword or PUA phrase (e.g. "底层逻辑" = underlying logic, "灵魂拷问" = soul interrogation)
- Each Chinese character occupies one cell, forming various Tetris shapes
- Clear a row to destroy the PUA words — you'll receive a sarcastic **PUA-style compliment** (more rows = more toxic)
- **99 levels** total — early levels fly by for instant gratification, later levels get brutally fast
- Higher levels introduce longer words and trickier pentomino shapes
- Reach Lv.99 **PUA King** to earn the mosaic pixel crown!

**Controls:**

| Action | Keyboard | Mobile |
|--------|----------|--------|
| Move left | ← | Left button / Swipe left |
| Move right | → | Right button / Swipe right |
| Rotate | ↑ | Rotate button / Tap |
| Soft drop | ↓ | Down button |
| Hard drop | Space | Drop button / Swipe down |
| Pause | P | — |

## 特色 | Features

- 🎮 **99个等级** — 从"实习生"到"PUA之王" | 99 levels — from "Intern" to "PUA King"
- 💬 **PUA式夸奖** — 消行时收到讽刺性表扬 | Sarcastic PUA praise on line clears
- 🗣️ **90+ 职场黑话** — 互联网大厂黑话 + PUA话术一网打尽 | 90+ buzzwords covering corporate jargon & PUA tactics
- 🎵 **5首分关卡BGM** — 8-bit 风格，随等级切换 | 5 stage BGMs in 8-bit style
- 👑 **Lv.99 皇冠** — 马赛克风格PUA之冠 | Pixel-art PUA crown at max level
- 📱 **手机支持** — 虚拟按钮 + 触摸手势 | Mobile support with virtual buttons + touch gestures
- 🌐 **纯前端** — 无需服务器，浏览器直接玩 | Pure frontend, play in any browser

## PUA词汇来源 | PUA Vocabulary Sources

收录了 **90+个** 中文互联网经典职场黑话和 PUA 话术，涵盖：

- 🏢 互联网大厂黑话（底层逻辑、顶层设计、闭环、赛道、颗粒度…）
- 🐺 狼性文化 / PUA 用语（末位淘汰、毕业警告、优化名单…）
- 📊 职场管理术语（对齐目标、拉通资源、信息拉齐…）
- 🔥 绩效考核话术（灵魂拷问、绩效审视、温和失望…）

## 技术栈 | Tech Stack

- **Vite** + **TypeScript** — 现代前端工具链
- **Canvas API** — 游戏渲染
- **Web Audio API** — 8-bit 音效合成（零外部资源）
- **GitHub Pages** — 静态部署

## 本地开发 | Development

```bash
git clone https://github.com/noya21th/PUA.git
cd PUA
npm install
npm run dev     # 开发服务器 | Dev server
npm run build   # 构建（输出单文件 dist/index.html）| Build (single-file output)
```

## 部署到 GitHub Pages | Deploy to GitHub Pages

项目使用 `vite-plugin-singlefile` 将所有资源打包为单个 `index.html`，部署非常简单：

The project uses `vite-plugin-singlefile` to bundle everything into a single `index.html`.

```bash
# 1. 构建 | Build
npm run build

# 2. 部署到 gh-pages 分支 | Deploy to gh-pages branch
npx gh-pages -d dist
```

然后在 GitHub 仓库 → Settings → Pages 中，将 Source 设为 `gh-pages` 分支即可。

Go to your repo → Settings → Pages → set Source to `gh-pages` branch.

> 也可以直接把 `dist/index.html` 拖到任何静态托管服务（Vercel、Netlify、Cloudflare Pages 等），因为它是一个零依赖的单文件。
>
> You can also host `dist/index.html` on any static hosting (Vercel, Netlify, Cloudflare Pages, etc.) — it's a self-contained single file with zero dependencies.

## 许可 | License

MIT

---

<p align="center">Made by Blue Little Blue Whale 🐳</p>
