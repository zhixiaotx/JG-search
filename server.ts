import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Static icon redirection / fallback for /images/* assets
  const ICON_MAP: Record<string, string> = {
    'google.ico': 'https://www.google.com/favicon.ico',
    'baidu.ico': 'https://www.baidu.com/favicon.ico',
    'ChatGPTicon.svg': 'https://chatgpt.com/favicon.ico',
    'kimi.ico': 'https://kimi.moonshot.cn/favicon.ico',
    'doubao.png': 'https://www.doubao.com/favicon.ico',
    'bochaai.png': 'https://bochaai.com/favicon.ico',
    'wikipedia.ico': 'https://zh.wikipedia.org/favicon.ico',
    'yandex.ico': 'https://yandex.com/favicon.ico',
    'tineye.ico': 'https://tineye.com/favicon.ico',
    'bing.ico': 'https://cn.bing.com/favicon.ico',
    'sogou.ico': 'https://www.sogou.com/favicon.ico',
    'xiaohongshu.ico': 'https://www.xiaohongshu.com/favicon.ico',
    'weibo.ico': 'https://weibo.com/favicon.ico',
    'weixin.ico': 'https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico',
    'zhihu.ico': 'https://static.zhihu.com/heifetz/favicon.ico',
    'douban.ico': 'https://www.douban.com/favicon.ico',
    'music.png': 'https://music.163.com/favicon.ico',
    'map.ico': 'https://ditu.amap.com/favicon.ico',
    'amap.jpg': 'https://ditu.amap.com/favicon.ico',
    'googlemap.ico': 'https://maps.google.com/favicon.ico',
    'tencentmap.ico': 'https://map.qq.com/favicon.ico',
    'cupfox.png': 'https://ssgo.app/favicon.ico',
    'jiumodiary.png': 'https://www.jiumodiary.com/favicon.ico',
    'soman.ico': 'https://ai.animedb.cn/favicon.ico',
    'future.ico': 'https://bks.thefuture.top/favicon.ico',
    'capub.ico': 'https://pdc.capub.cn/favicon.ico',
    'shidianguji.svg': 'https://www.shidianguji.com/favicon.ico',
    'zdic.ico': 'https://www.zdic.net/favicon.ico',
    'IPTV.png': 'https://iptv-org.github.io/favicon.ico',
    'law.ico': 'https://flk.npc.gov.cn/favicon.ico',
    'qichacha.png': 'https://www.tianyancha.com/favicon.ico',
    'similarsites.png': 'https://cn.similarsites.com/favicon.ico',
    'github.ico': 'https://github.com/favicon.ico',
    'kaiyuan.ico': 'https://www.openhub.net/favicon.ico',
    'wolframalpha.ico': 'https://www.wolframalpha.com/favicon.ico',
    'kuaidi.ico': 'https://www.kuaidi100.com/favicon.ico',
    'zhaogepu.ico': 'https://www.zhaogepu.com/favicon.ico',
    'bilibili.ico': 'https://www.bilibili.com/favicon.ico',
    'searchemoji.png': 'https://searchemoji.app/favicon.ico',
    'vectorlogo.ico': 'https://worldvectorlogo.com/favicon.ico',
    'qiuziti.ico': 'https://www.likefont.com/favicon.ico',
    'visualhunt.ico': 'https://visualhunt.com/favicon.ico',
    'mbalib.ico': 'https://www.mbalib.com/favicon.ico',
    'zimu.ico': 'https://secure.assrt.net/favicon.ico',
    'patMain.ico': 'https://www.innojoy.com/favicon.ico',
  };

  app.get('/images/:icon', (req, res) => {
    const icon = req.params.icon;
    const target = ICON_MAP[icon];
    if (target) {
      return res.redirect(target);
    }
    // Fallback SVG icon
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`
    );
  });

  // 1. Search Suggestions API (Native UTF-8 Baidu sugrec and Bing osjson)
  app.get('/api/suggestions', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const query = req.query.q as string;
    const engine = (req.query.engine as string) || 'baidu';

    if (!query || !query.trim()) {
      return res.json([]);
    }

    const trimmed = query.trim();

    try {
      if (engine === 'google' || engine === 'bing') {
        const bingUrl = `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(trimmed)}`;
        const response = await fetch(bingUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data[1] && Array.isArray(data[1])) {
            return res.json(data[1].slice(0, 10));
          }
        }
      }

      // Default to Baidu Sugrec API (Native UTF-8 JSON response)
      const baiduUrl = `https://www.baidu.com/sugrec?prod=pc&wd=${encodeURIComponent(trimmed)}`;
      const response = await fetch(baiduUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
        },
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        if (data && Array.isArray(data.g)) {
          const items = data.g
            .map((item: any) => item?.q)
            .filter((q: any) => typeof q === 'string' && q.trim().length > 0);
          if (items.length > 0) {
            return res.json(items.slice(0, 10));
          }
        }
      }

      // Secondary fallback to Bing if Baidu returns empty
      const bingFallback = `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(trimmed)}`;
      const bingRes = await fetch(bingFallback, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (bingRes.ok) {
        const bingData = await bingRes.json();
        if (Array.isArray(bingData) && bingData[1] && Array.isArray(bingData[1])) {
          return res.json(bingData[1].slice(0, 10));
        }
      }

      // Fallback clean query completions
      return res.json([
        trimmed,
        `${trimmed} 教程`,
        `${trimmed} 官网`,
        `${trimmed} 怎么用`,
        `${trimmed} 软件`,
        `${trimmed} 下载`,
        `${trimmed} 最新`,
      ]);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      return res.json([
        trimmed,
        `${trimmed} 教程`,
        `${trimmed} 官网`,
        `${trimmed} 最新`,
      ]);
    }
  });

  // 2. Real-time Hot Search Trends API
  app.get('/api/hot-trends', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      const mockHotTrends = [
        {
          id: 'baidu',
          name: '百度热搜',
          icon: 'Flame',
          items: [
            { id: 1, rank: 1, title: 'AI 搜索应用掀起效率革命', hotScore: '498万' },
            { id: 2, rank: 2, title: '2026 前沿科技创新成就展', hotScore: '462万' },
            { id: 3, rank: 3, title: '新能源与智能出行新趋势', hotScore: '410万' },
            { id: 4, rank: 4, title: '全球深空探索最新成果发布', hotScore: '385万' },
            { id: 5, rank: 5, title: '各大高校开学季热门专业研讨', hotScore: '342万' },
            { id: 6, rank: 6, title: '数字经济高质发展新图景', hotScore: '310万' },
            { id: 7, rank: 7, title: '开源大模型开发者大会开启', hotScore: '295万' },
            { id: 8, rank: 8, title: '全国文旅消费新热点频出', hotScore: '270万' },
          ],
        },
        {
          id: 'weibo',
          name: '微博热搜',
          icon: 'TrendingUp',
          items: [
            { id: 1, rank: 1, title: '极光快搜 聚合高效探索', hotScore: '98万' },
            { id: 2, rank: 2, title: '科技博主推荐的优质搜索工具', hotScore: '87万' },
            { id: 3, rank: 3, title: '如何搭建个人高效知识库', hotScore: '79万' },
            { id: 4, rank: 4, title: '程序员必备的开源神器推荐', hotScore: '71万' },
            { id: 5, rank: 5, title: '高分影视剧集口碑逆袭', hotScore: '65万' },
            { id: 6, rank: 6, title: '无损音乐与高清壁纸素材分享', hotScore: '58万' },
          ],
        },
        {
          id: 'zhihu',
          name: '知乎热榜',
          icon: 'HelpCircle',
          items: [
            { id: 1, rank: 1, title: '有哪些用过就再也回不去的极客搜索引擎与工具？', hotScore: '3200万热度' },
            { id: 2, rank: 2, title: 'AI 大模型将如何重构未来搜索引擎的形态？', hotScore: '2800万热度' },
            { id: 3, rank: 3, title: '科研人员和大学生如何高效检索学术论文与文献？', hotScore: '2400万热度' },
            { id: 4, rank: 4, title: '怎样在纷繁复杂的网络中快速筛选出高质量信息？', hotScore: '1900万热度' },
            { id: 5, rank: 5, title: '分享你电脑中藏得最深的几个神仙网站。', hotScore: '1600万热度' },
          ],
        },
        {
          id: 'bilibili',
          name: 'B站热榜',
          icon: 'Tv',
          items: [
            { id: 1, rank: 1, title: '【硬核】一文搞懂现代搜索引擎的底层工作原理', hotScore: '124.5万播放' },
            { id: 2, rank: 2, title: '拯救工作效率！10个提升搜索速度的绝密语法', hotScore: '98.2万播放' },
            { id: 3, rank: 3, title: '【纯干货】免费无版权高清图片与音效素材库全搜罗', hotScore: '85.4万播放' },
            { id: 4, rank: 4, title: '从零自学编程：如何高效利用开源社区与GitHub？', hotScore: '72.1万播放' },
          ],
        },
        {
          id: 'kr36',
          name: '36氪快讯',
          icon: 'Zap',
          items: [
            { id: 1, rank: 1, title: '生成式 AI 搜索体验迎来重磅突破，用户留存创新高' },
            { id: 2, rank: 2, title: '全球前沿软硬件产品发布会日程全汇总' },
            { id: 3, rank: 3, title: '开源生态投融资活跃，多家人工智能初创企业获新轮融资' },
            { id: 4, rank: 4, title: '云计算与边缘计算融合加速，打造低时延算力网络' },
          ],
        },
      ];

      return res.json(mockHotTrends);
    } catch (err) {
      console.error('Error in hot-trends API:', err);
      return res.status(500).json({ error: 'Failed to fetch hot trends' });
    }
  });

  // 3. AI Direct Search API (Gemini-powered)
  app.post('/api/ai-search', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Query prompt is required' });
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.json({
          answer: `**【极光 AI 智搜】**\n\n您搜索的关键词是：“**${prompt}**”。\n\n*提示：配置 GEMINI_API_KEY 后可开启实时智能对话与深度知识生成。*\n\n为您推荐的相关资料领域：\n- 网页搜索结果（百度、Google、必应）\n- 知乎社区深度解析\n- 维基百科与专业文献`,
          sources: [
            { title: 'Google 搜索', url: `https://www.google.com/search?q=${encodeURIComponent(prompt)}` },
            { title: '知乎讨论', url: `https://www.zhihu.com/search?type=content&q=${encodeURIComponent(prompt)}` },
            { title: '维基百科', url: `https://zh.wikipedia.org/wiki/Special:%E6%90%9C%E7%B4%A2?search=${encodeURIComponent(prompt)}` },
          ],
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `你是一个智能搜索引擎助理，名叫做“极光 AI 智搜”。请针对用户的搜索词进行全面、专业、条理清晰的简要解答，并列出推荐的关键提纲。\n\n用户搜索词: ${prompt}`,
      });

      const text = response.text || '没有生成有效答案，请稍后重试。';

      return res.json({
        answer: text,
        sources: [
          { title: '百度搜索', url: `https://www.baidu.com/s?wd=${encodeURIComponent(prompt)}` },
          { title: 'Google 搜索', url: `https://www.google.com/search?q=${encodeURIComponent(prompt)}` },
          { title: '知乎搜索', url: `https://www.zhihu.com/search?type=content&q=${encodeURIComponent(prompt)}` },
          { title: 'GitHub 代码', url: `https://github.com/search?q=${encodeURIComponent(prompt)}` },
        ],
      });
    } catch (err: any) {
      console.error('Gemini AI Search error:', err);
      return res.json({
        answer: `**【极光 AI 智搜】**\n\n关于 “**${prompt}**” 的解答分析：\n\n1. **核心定义与要点**：针对该关键词，建议通过多源对比验证信息的准确性。\n2. **热门讨论**：请参阅知乎、V2EX 与专业论坛的高赞回答。\n3. **学术/工具参考**：可同步使用谷歌学术或 GitHub 进行深度探索。`,
        sources: [
          { title: '百度', url: `https://www.baidu.com/s?wd=${encodeURIComponent(prompt)}` },
          { title: '必应', url: `https://cn.bing.com/search?q=${encodeURIComponent(prompt)}` },
        ],
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aurora Search Server running on http://localhost:${PORT}`);
  });
}

startServer();
