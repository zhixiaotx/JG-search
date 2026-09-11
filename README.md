# 极光快搜 (Aurora QuickSearch) 🚀

> **聚合搜索引擎与极速探索平台** —— 致敬重部落经典架构，集成上百款主流及垂直搜索引擎，支持左侧多级直达导航、内嵌全屏无缝切换、AI 深度智搜、全网实时热搜榜、自定义搜索引擎与多设备极速自适应。

---

## 📖 目录

- [🌟 核心特性](#-核心特性)
- [🛠️ 技术栈](#️-技术栈)
- [📁 项目目录结构与文件深度详解](#-项目目录结构与文件深度详解)
- [📱 移动端与多设备适配优化](#-移动端与多设备适配优化)
- [⚠️ 编程遇见的坑与避坑指南 (必读)](#️-编程遇见的坑与避坑指南-必读)
- [🚀 零门槛保姆级部署指南](#-零门槛保姆级部署指南)
  - [方案一：GitHub Pages 自动化工作流部署 (推荐)](#方案一github-pages-自动化工作流部署-推荐)
  - [方案二：Cloudflare Pages 部署](#方案二cloudflare-pages-部署)
  - [方案三：Vercel 部署](#方案三vercel-部署)
  - [方案四：Netlify 部署](#方案四netlify-部署)
  - [方案五：全栈运行 (Docker / VPS / Cloud Run)](#方案五全栈运行-docker--vps--cloud-run)
- [💡 本地开发与调试](#-本地开发与调试)

---

## 🌟 核心特性

1. **左侧极速导航与领域分类**：
   - 致敬重部落经典 `LeftNav` 架构，收录网页、图片、以图搜图、地图、翻译、学术、影视、音乐、网盘、社交、开发者工具等上百个垂直引擎。
   - 导航项严格左对齐对齐基准，支持以图搜图、地图等复杂折叠子菜单。
2. **顶底联动与即时搜索**：
   - 顶部搜索框与当前引擎一键联动，输入关键词即刻在右侧全景视窗中加载结果。
   - 支持**「内嵌全屏预览」**与**「新标签页弹出」**双模式，用户可自由选择。
3. **AI 智能深度答疑 (Gemini 2.5/Flash)**：
   - 内置 AI 智搜模块，不仅提供 AI 总结答复，还带有信源索引与可点击引用。
4. **全网实时热点榜单**：
   - 实时聚合百度风云榜、微博热搜、知乎热榜、B站热门视频，点击热词即可一键填入搜索框检索。
5. **高度可扩展**：
   - 支持自定义添加搜索引擎（包含 `%s` 占位符 URL 规则）。
   - 本地持久化保存用户的搜索历史记录、常用引擎收藏与暗黑模式状态。

---

## 🛠️ 技术栈

| 技术 | 说明 |
| :--- | :--- |
| **React 19** | 现代前端视图框架，采用 Hooks 与函数式组件 |
| **TypeScript 5.8** | 强类型语法，提供严格的编译期安全保障 |
| **Vite 6** | 极速前端构建工具，配置相对路径 `base: './'` |
| **Tailwind CSS v4** | 现代化原子级 CSS 框架，支持暗黑模式与流畅自适应 |
| **Lucide React** | 统一、优雅的矢量图标库 |
| **Express 4 & Node.js** | 轻量全栈后端，提供 AI 搜索代理与本地热搜 API |
| **@google/genai** | Google 官方 Gemini 模型调用 SDK |

---

## 📁 项目目录结构与文件深度详解

让每一位开发者和初学者都能一目了然：

```text
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 自动化构建与 gh-pages 分支推送工作流
├── public/                   # 纯静态资源（favicon、图标、静态图片等）
│   ├── iGoogle.html          # Google 极速纯净原生搜索页（已剔除广告与外链）
│   ├── diybaidu.html         # 百度极简纯净搜索与 AI 探索页（已剔除广告与外链）
│   ├── chatgpt.html          # ChatGPT 暗黑极速检索页（已剔除广告与外链）
│   └── images/               # 搜索引擎图标（google.ico, baidu.ico, ChatGPTicon.svg 等）
├── src/
│   ├── components/           # 模块化 UI 组件目录
│   │   ├── AISearchResult.tsx     # AI 智能搜索解答抽屉内容渲染
│   │   ├── CustomEngineModal.tsx  # 自定义搜索引擎弹窗（用户添加自定义站点）
│   │   ├── EngineTabs.tsx         # 搜索引擎分类选项卡
│   │   ├── Header.tsx             # 页面顶部主导航栏（主题切换、历史、模式设置等）
│   │   ├── HistoryDrawer.tsx      # 历史搜索记录与收藏引擎抽屉面板
│   │   ├── HotTrends.tsx          # 实时全网热搜榜（百度/微博/知乎/B站）
│   │   ├── IframePreview.tsx      # 嵌入式页面视窗容器
│   │   ├── LeftNav.tsx            # 重部落经典风格左侧多级导航（li 严格左对齐）
│   │   ├── SearchBar.tsx          # 独立搜索框输入条组件
│   │   └── Sidebar.tsx            # 侧边栏整体容器（支持快搜导航/领域分类切换）
│   ├── data/
│   │   └── searchEngines.ts       # 搜索引擎字典配置库（URL 规则、分类、图标色值）
│   ├── App.tsx               # 应用核心主中枢（状态调度、iframe 联动、全局布局）
│   ├── index.css             # 全局样式表（Tailwind 引入、左对齐样式、安全区适配）
│   ├── main.tsx              # React 应用挂载入口文件
│   └── types.ts              # TypeScript 全局接口与数据模型定义
├── .env.example              # 环境变量声明模板（GEMINI_API_KEY 等）
├── index.html                # SPA 入口 HTML（包含移动端 viewport-fit、PWA 元标签等）
├── metadata.json             # 项目元信息与权限配置文件
├── package.json              # 项目依赖清单与执行脚本（dev/build/build:client/start）
├── tsconfig.json             # TypeScript 编译器配置
├── server.ts                 # Express 服务端入口（API 路由代理 + Vite 中间件）
├── vite.config.ts            # Vite 配置文件（已开启 base: './' 相对路径）
└── README.md                 # 项目详细介绍与运维部署文档
```

### 关键文件逐一拆解：

#### 1. `src/App.tsx`（核心逻辑中枢）
- **功能与作用**：整个应用的状态大脑。
- **核心逻辑**：
  - 维护深色/浅色模式并在 `<html>` 标签上动态切换 `.dark` 类。
  - 维护当前选中的搜索引擎 `activeEngine` 与当前激活的分类 `activeCategory`。
  - 管理右侧嵌入视窗 `iframeState`，根据用户输入的关键词动态替换引擎 URL 中的 `%s` 占位符。
  - 处理历史搜索记录保存（`localStorage` 自动同步最新 50 条）。
  - 控制所有弹出层与抽屉的开关状态（侧边栏、历史记录、全网热搜、AI 智搜、添加自定义引擎）。

#### 2. `src/components/Header.tsx`（顶部全局导航）
- **功能与作用**：页面顶部的控制台。
- **核心逻辑**：
  - 放置侧边栏展开/收起按钮（手机端与桌面端通用）。
  - 提供「极光快搜」Logo 与外部常用子站点快捷跳转标签。
  - 提供「内置预览」与「新标签页」的搜索打开模式切换器。
  - 自定义引擎添加按钮、历史与收藏抽屉唤起按钮、暗黑模式切换开关。
  - **防崩溃机制**：所有操作回调均配置了安全回退（如 `setSidebarOpen = (_val?: React.SetStateAction<boolean>) => {}`），杜绝运行时由于未传递参数导致报错。

#### 3. `src/components/Sidebar.tsx` 与 `src/components/LeftNav.tsx`（重部落风格侧栏）
- **功能与作用**：左侧核心导航组件，支持「快搜导航」与「领域分类」双模式一键切换。
- **核心逻辑**：
  - `LeftNav.tsx`：致敬重部落经典 `ul#foo.chongbuluo` 结构，包含网页、图片、以图搜图（百度识图、Google Lens、Yandex、Bing 识图）、地图（高德、腾讯、百度、OpenStreetMap）、学术、资源等。
  - 每一项设置 `border-left: 3px solid transparent`，选中时变蓝且不产生像素级抖动。
  - 在移动端点击任意条目，自动收起侧边栏并直接呈递搜索视窗。

#### 4. `src/components/HotTrends.tsx`（实时热搜聚合）
- **功能与作用**：汇聚百度风云榜、微博热搜、知乎热榜、B站热门视频榜。
- **核心逻辑**：
  - 支持标签页快速切换平台，支持一键点击热搜词，热搜词直接填入搜索框并立即调用当前引擎检索。

#### 5. `src/components/AISearchResult.tsx`（Gemini 智能解析）
- **功能与作用**：提供现代化生成式 AI 答复。
- **核心逻辑**：
  - 调用后台 `/api/ai-search` 接口，结合 Gemini 模型对用户提问进行总结，并将参考资料按标题和链接结构化展示。

#### 6. `src/data/searchEngines.ts`（搜索引擎规则库）
- **功能与作用**：存放所有搜索引擎的元数据。
- **数据结构**：
  ```typescript
  {
    id: 'baidu',
    name: '百度',
    category: 'search',
    url: 'https://www.baidu.com/s?wd=%s',
    icon: 'Search',
    color: '#2932e1'
  }
  ```
  通过 `%s` 占位符规范，任何引擎只需提供检索 URL 规则即可立即适配。

#### 7. `server.ts`（Node.js 后端与代理）
- **功能与作用**：
  - 本地与生产环境的 Express 服务器，挂载 `/api/ai-search`（安全调用 Google Gemini SDK，杜绝 API Key 泄露到前端）。
  - 提供热搜数据聚合代理接口 `/api/trends`。
  - 开发环境下挂载 Vite 中间件，生产环境下托管 `dist/` 静态编译产物。

---

## 📱 移动端与多设备适配优化

本项目针对手机（iOS Safari、Android Chrome、微信内置浏览器）、平板（iPad）及桌面大屏进行了专门适配：

1. **全面支持刘海屏与全面屏安全区**：
   - `index.html` 声明 `viewport-fit=cover` 与 `maximum-scale=5.0`。
   - `index.css` 全局注入 `padding-bottom: env(safe-area-inset-bottom, 0px);`，防止底部手势指示条遮挡内容。
2. **移动端手势与抽屉设计**：
   - 屏幕宽度 `< 768px` 时，侧边栏自动转为全屏覆盖抽屉（Overlay Drawer），附带轻度磨砂遮罩背景。
   - 用户点击任何一个搜索项后，侧边栏**自动关闭**，直接呈现右侧内容，极大减少操作步数。
   - 侧栏收起状态下，屏幕左上角提供悬浮的「快搜导航」胶囊呼出按钮。
3. **触控交互防误触与无灰底**：
   - 设置 `-webkit-tap-highlight-color: transparent`，彻底去除移动端点击按钮时的蓝色/灰色方块高亮。
   - 保证按钮触控面积均达 40px~44px 以上，点击更跟手。
4. **小屏工具栏自适应缩减**：
   - 在宽度小于 400px（如 iPhone SE）的屏幕上，当前引擎名称自动省略截断，搜索输入框保持弹性扩展，确保在任何极小屏幕上均不出现横向滚动条或页面撕裂。

---

## ⚠️ 编程遇见的坑与避坑指南 (必读)

在构建此类聚合搜索与工具类平台时，容易踩中以下深坑，这里已全部为您妥善解决：

### 坑 1：iframe 嵌入时报 `Refused to display in a frame because it set 'X-Frame-Options' to 'sameorigin'`
- **原因**：部分网站（如百度首页主站 `baidu.com`、Google 主站等）出于安全防护考虑，响应头中带有 `X-Frame-Options: SAMEORIGIN` 或 CSP `frame-ancestors 'self'`，禁止被第三方页面以 `<iframe>` 形式内嵌。
- **解决之道**：
  1. **专用免拦截地址**：使用专门开放嵌入的镜像/轻量版本（例如本项目针对百度采用 `https://search.chongbuluo.com/diybaidu.html`，Google 采用 `https://search.chongbuluo.com/iGoogle.html`）。
  2. **双模式自适应切换**：页面右上角提供「新标签页」与「内置预览」切换开关。对于明确拦截 iframe 的站点，用户或系统可一键切换为在新标签页中打开。
  3. **一键外链呼出**：工具栏常驻「在新窗口打开」图标按钮，无论当前内嵌状态如何，用户均可秒级在新页面直达。

### 坑 2：React 组件传参不全导致 `TypeError: setSidebarOpen is not a function`
- **原因**：主入口 `App.tsx` 实例化子组件 `<Header />` 时若漏写了 `setSidebarOpen` 等属性，子组件在用户点击时就会因调用 `undefined` 而直接引发页面白屏崩溃。
- **解决之道**：
  1. 在 `Header.tsx` 与 `Sidebar.tsx` 中定义 Props 接口时将可选参数设为可选（`setSidebarOpen?: ...`）。
  2. 在解构参数时务必附带**默认安全空函数**：
     ```typescript
     setSidebarOpen = (_val?: React.SetStateAction<boolean>) => {},
     ```
  3. 并在主页面 `App.tsx` 中完整绑定所有状态方法。

### 坑 3：GitHub Pages 或二级子路径部署时资源 404 白屏
- **原因**：Vite 默认的 `base` 是 `/`（绝对路径），当部署到 `https://username.github.io/repo-name/` 时，浏览器会尝试去根目录 `https://username.github.io/assets/...` 请求 js 和 css，造成全部 404 白屏。
- **解决之道**：
  - 在 `vite.config.ts` 中明确配置 **`base: './'`（相对路径）**：
    ```typescript
    export default defineConfig(() => {
      return {
        base: './',
        plugins: [react(), tailwindcss()],
        // ...
      };
    });
    ```
  - 这样打包出来的静态资源全都使用相对路径引用，既能部署在任意二级目录，也能直接通过本地浏览器文件打开！

### 坑 4：TypeScript 默认空函数推导导致 `error TS2554: Expected 0 arguments, but got 1`
- **原因**：若写 `setSidebarOpen = () => {}`，TypeScript 可能会将该参数类型推导为不需要参数的函数 `() => void`。后续调用 `setSidebarOpen(false)` 时，TypeScript 就会报错“期望 0 个参数但传了 1 个”。
- **解决之道**：
  - 显式声明形参：`setSidebarOpen = (_val?: React.SetStateAction<boolean>) => {}`。

### 坑 5：CSS 列表项 hover 导致文字像素抖动
- **原因**：激活状态有 `border-left: 3px solid #2563eb`，未激活状态如果没有边框，加上边框后内容区会被挤压 3 个像素，导致文字横向抖动。
- **解决之道**：
  - 未激活项统一步长设置 `border-left: 3px solid transparent; box-sizing: border-box;`，切换状态时只有颜色变化，没有位移抖动。

---

## 🚀 零门槛保姆级部署指南

本项目支持**纯静态托管**（前端独立运行）与**全栈运行**（支持 AI 智搜接口）两种模式。

---

### 方案一：GitHub Pages 自动化工作流部署 (推荐)

仓库已内置 `.github/workflows/deploy.yml` 自动化 CI/CD 工作流，会自动将静态文件打包并推送到 `gh-pages` 分支进行发布。

#### 操作步骤：
1. **将项目推送到 GitHub**：
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

2. **开启 GitHub Actions 写入权限**：
   - 打开 GitHub 仓库，点击 **Settings（设置）** -> 左侧 **Actions** -> **General**。
   - 滚动到底部 **Workflow permissions**，勾选 **Read and write permissions（读写权限）**，点击 **Save**。

3. **设置 GitHub Pages 发布源**：
   - 第一次推送代码后，点击仓库顶部的 **Actions** 标签，等待工作流自动运行完成（会自动生成一个 `gh-pages` 分支）。
   - 进入仓库 **Settings** -> 左侧 **Pages**。
   - **Build and deployment** 下方的 **Source** 选择 **Deploy from a branch**。
   - **Branch** 选择 **`gh-pages`** 分支，目录选择 **`/ (root)`**，点击 **Save**。
   - 约 1 分钟后即可通过 `https://你的用户名.github.io/你的仓库名/` 访问上线网站！

---

### 方案二：Cloudflare Pages 部署

Cloudflare 全球 CDN 加速，国内访问速度极佳，且完全免费。

#### 操作步骤：
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 在左侧菜单点击 **Workers & Pages** -> **Create application** -> 选择 **Pages** -> **Connect to Git**。
3. 选择你的 GitHub 仓库。
4. 构建设置如下：
   - **Framework preset（框架预设）**：`Vite`
   - **Build command（构建命令）**：`npm run build:client`
   - **Build output directory（输出目录）**：`dist`
5. 点击 **Save and Deploy**，几秒钟即可全球上线，支持免费自定义域名与自动 HTTPS 证书。

---

### 方案三：Vercel 部署

1. 登录 [Vercel](https://vercel.com/)。
2. 点击 **Add New...** -> **Project**，从 GitHub 导入此仓库。
3. 构建配置会自动识别：
   - **Framework Preset**：`Vite`
   - **Build Command**：`npm run build:client`
   - **Output Directory**：`dist`
4. （可选）如果需要启用后端 AI 代理，可在 **Environment Variables** 添加：
   - `GEMINI_API_KEY`: 填入你的 Google Gemini API 密钥。
5. 点击 **Deploy** 即可完成发布。

---

### 方案四：Netlify 部署

1. 登录 [Netlify](https://www.netlify.com/)，选择 **Add new site** -> **Import an existing project**。
2. 授权连接你的 GitHub 仓库。
3. 基础构建配置：
   - **Build command**：`npm run build:client`
   - **Publish directory**：`dist`
4. 点击 **Deploy site**，等待数十秒即可访问分配的 `.netlify.app` 域名。

---

### 方案五：全栈运行 (Docker / VPS / Cloud Run)

如果你希望保留 Node.js 服务端并完整启用 AI 智搜接口：

#### 1. 使用 Node 直接运行：
```bash
# 1. 复制环境变量
cp .env.example .env
# 编辑 .env，填入 GEMINI_API_KEY=你的密钥

# 2. 安装依赖
npm install

# 3. 编译打包前端与后端
npm run build

# 4. 启动生产服务器 (监听 3000 端口)
npm start
```

#### 2. 使用 Docker 容器化运行：
创建 `Dockerfile`：
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

构建与运行：
```bash
docker build -t aurora-search .
docker run -d -p 3000:3000 -e GEMINI_API_KEY="你的Key" --name aurora-search aurora-search
```

---

## 💡 本地开发与调试

```bash
# 克隆仓库
git clone https://github.com/你的用户名/你的仓库名.git
cd 你的仓库名

# 安装依赖
npm install

# 启动本地开发服务 (支持前端即时热重载与后端 API 联调)
npm run dev

# 打开浏览器访问
http://localhost:3000
```

### 常用命令备忘：
- `npm run dev`：启动本地全栈开发服务（通过 `tsx server.ts` 监听 3000 端口）。
- `npm run build:client`：单独打包纯前端静态资源到 `dist/`（用于 GitHub Pages、Cloudflare Pages 等纯静态托管）。
- `npm run build`：同时打包纯静态前端与编译后的单文件 Node 服务端 `dist/server.cjs`。
- `npm run lint`：执行 TypeScript 全量静态类型检查。

---

## 📄 开源许可证

本项目基于 MIT 许可证开源，欢迎自由使用、二次开发与分享。如果本项目对你有所帮助，欢迎给仓库点个 ⭐️ Star！
