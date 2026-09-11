import { Category, SearchEngine } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'search', name: '综合搜索', icon: 'Search', description: '网页基础搜索与常用引擎', badgeColor: 'bg-blue-500' },
  { id: 'knowledge', name: '百科知识', icon: 'BookOpen', description: '知乎、维基、百科与知识库', badgeColor: 'bg-emerald-500' },
  { id: 'social', name: '社区社交', icon: 'MessageSquare', description: '微博、贴吧、V2EX、小红书与论坛', badgeColor: 'bg-indigo-500' },
  { id: 'media', name: '影视音乐', icon: 'Film', description: 'Bilibili、豆瓣电影、音乐与播客', badgeColor: 'bg-rose-500' },
  { id: 'design', name: '图片设计', icon: 'Image', description: '花瓣、Unsplash、Pixabay与设计灵感', badgeColor: 'bg-purple-500' },
  { id: 'academic', name: '学术论文', icon: 'GraduationCap', description: '谷歌学术、百度学术、知网与论文', badgeColor: 'bg-amber-500' },
  { id: 'software', name: '软件代码', icon: 'Code', description: 'GitHub、吾爱破解、Chrome商店与开源', badgeColor: 'bg-cyan-500' },
  { id: 'pan', name: '网盘磁力', icon: 'HardDrive', description: '盘搜、阿里网盘、百度网盘与资源', badgeColor: 'bg-teal-500' },
  { id: 'shopping', name: '购物电商', icon: 'ShoppingBag', description: '淘宝、京东、拼多多与比价', badgeColor: 'bg-orange-500' },
  { id: 'news', name: '新闻资讯', icon: 'Newspaper', description: '澎湃、36氪、虎嗅与科技快讯', badgeColor: 'bg-red-500' },
  { id: 'ai', name: 'AI 智搜', icon: 'Bot', description: 'Gemini、DeepSeek、Kimi与智能AI助手', badgeColor: 'bg-violet-500' },
];

export const DEFAULT_SEARCH_ENGINES: SearchEngine[] = [
  // 综合搜索
  { id: 'baidu', name: '百度', category: 'search', url: 'https://www.baidu.com/s?wd=%s', isPopular: true, color: '#2932e1', description: '百度一下，你就知道' },
  { id: 'google', name: 'Google', category: 'search', url: 'https://www.google.com/search?q=%s', isPopular: true, color: '#4285F4', description: '全球最大的搜索引擎' },
  { id: 'bing', name: '必应 Bing', category: 'search', url: 'https://cn.bing.com/search?q=%s', isPopular: true, color: '#008373', description: '微软 Bing 搜索引擎' },
  { id: 'so360', name: '360搜索', category: 'search', url: 'https://www.so.com/s?q=%s', color: '#19b955', description: '360 综合搜索' },
  { id: 'sogou', name: '搜狗', category: 'search', url: 'https://www.sogou.com/web?query=%s', color: '#ff5900', description: '搜狗 Web 搜索' },
  { id: 'duckduckgo', name: 'DuckDuckGo', category: 'search', url: 'https://duckduckgo.com/?q=%s', color: '#de5833', description: '保护隐私的搜索引擎' },
  { id: 'yandex', name: 'Yandex', category: 'search', url: 'https://yandex.com/search/?text=%s', color: '#fc3f1d', description: '俄罗斯最大的搜索引擎' },

  // 百科知识
  { id: 'zhihu', name: '知乎', category: 'knowledge', url: 'https://www.zhihu.com/search?type=content&q=%s', isPopular: true, color: '#0084ff', description: '问答社区与高质量讨论' },
  { id: 'wikipedia', name: '维基百科', category: 'knowledge', url: 'https://zh.wikipedia.org/wiki/Special:%E6%90%9C%E7%B4%A2?search=%s', isPopular: true, color: '#636466', description: '自由的百科全书' },
  { id: 'baidubaike', name: '百度百科', category: 'knowledge', url: 'https://baike.baidu.com/item/%s', color: '#2932e1', description: '百度权威中文百科' },
  { id: 'weixin', name: '微信文章', category: 'knowledge', url: 'https://weixin.sogou.com/weixin?type=2&query=%s', isPopular: true, color: '#07c160', description: '微信公众号高质量好文' },
  { id: 'douban', name: '豆瓣', category: 'knowledge', url: 'https://www.douban.com/search?q=%s', color: '#007722', description: '图书、电影、音乐与生活社区' },
  { id: 'quora', name: 'Quora', category: 'knowledge', url: 'https://www.quora.com/search?q=%s', color: '#b92b27', description: '全球知识问答平台' },

  // 社区社交
  { id: 'weibo', name: '微博', category: 'social', url: 'https://s.weibo.com/weibo?q=%s', isPopular: true, color: '#e6162d', description: '随时随地发现新鲜事' },
  { id: 'tieba', name: '百度贴吧', category: 'social', url: 'https://tieba.baidu.com/f?kw=%s', color: '#3385ff', description: '兴趣主题讨论社区' },
  { id: 'v2ex', name: 'V2EX', category: 'social', url: 'https://www.google.com/search?q=site:v2ex.com/t+%s', isPopular: true, color: '#333333', description: '创意工作者讨论社区' },
  { id: 'twitter', name: 'Twitter / X', category: 'social', url: 'https://x.com/search?q=%s', color: '#000000', description: '实时社交动态与新闻' },
  { id: 'reddit', name: 'Reddit', category: 'social', url: 'https://www.reddit.com/search/?q=%s', color: '#ff4500', description: '互联网前端讨论集散地' },
  { id: 'xiaohongshu', name: '小红书', category: 'social', url: 'https://www.xiaohongshu.com/search_result?keyword=%s', isPopular: true, color: '#ff2442', description: '生活方式分享平台' },

  // 影视音乐
  { id: 'bilibili', name: '哔哩哔哩', category: 'media', url: 'https://search.bilibili.com/all?keyword=%s', isPopular: true, color: '#00aeec', description: '国内知名的视频弹幕网站' },
  { id: 'doubanmovie', name: '豆瓣电影', category: 'media', url: 'https://search.douban.com/movie/subject_search?search_text=%s', isPopular: true, color: '#27a', description: '评分与影评权威指南' },
  { id: 'netease_music', name: '网易云音乐', category: 'media', url: 'https://music.163.com/#/search/m/?s=%s', color: '#c20c0c', description: '音乐力量，听你想听' },
  { id: 'youtube', name: 'YouTube', category: 'media', url: 'https://www.youtube.com/results?search_query=%s', isPopular: true, color: '#ff0000', description: '全球最大视频共享网站' },
  { id: 'dytt', name: '电影天堂', category: 'media', url: 'https://www.dytt8.net/doc/search.asp?keyword=%s', color: '#00a3d9', description: '影视资源高品质下载' },
  { id: 'xiaoyuzhou', name: '播客小宇宙', category: 'media', url: 'https://www.xiaoyuzhoufm.com/search?q=%s', color: '#ff7300', description: '中文播客探索平台' },

  // 图片设计
  { id: 'huaban', name: '花瓣网', category: 'design', url: 'https://huaban.com/search/?q=%s', isPopular: true, color: '#e2434b', description: '陪你收集灵感灵动设计' },
  { id: 'unsplash', name: 'Unsplash', category: 'design', url: 'https://unsplash.com/s/photos/%s', isPopular: true, color: '#000000', description: '高画质无版权高清摄影图' },
  { id: 'pixabay', name: 'Pixabay', category: 'design', url: 'https://pixabay.com/images/search/%s/', color: '#02be6e', description: '免费素材与矢量图' },
  { id: 'pexels', name: 'Pexels', category: 'design', url: 'https://www.pexels.com/search/%s/', color: '#05a081', description: '免费优质高清图片与视频' },
  { id: 'dribbble', name: 'Dribbble', category: 'design', url: 'https://dribbble.com/search/%s', color: '#ea4c89', description: '全球顶尖设计师作品集' },
  { id: 'baiduimg', name: '百度图片', category: 'design', url: 'https://image.baidu.com/search/index?tn=baiduimage&word=%s', color: '#2932e1', description: '海量图片素材搜索' },

  // 学术论文
  { id: 'googlescholar', name: '谷歌学术', category: 'academic', url: 'https://scholar.google.com/scholar?q=%s', isPopular: true, color: '#4285F4', description: '学术文献与论文检索' },
  { id: 'baiduxueshu', name: '百度学术', category: 'academic', url: 'https://xueshu.baidu.com/s?wd=%s', color: '#2932e1', description: '海量中外文学术资源' },
  { id: 'cnki', name: '中国知网', category: 'academic', url: 'https://kns.cnki.net/kns8s/defaultresult/index?kw=%s', isPopular: true, color: '#c8161d', description: '权威中文期刊与学术论文' },
  { id: 'wanfang', name: '万方数据', category: 'academic', url: 'https://s.wanfangdata.com.cn/paper?q=%s', color: '#1161aa', description: '科技文献与学术资源库' },
  { id: 'arxiv', name: 'arXiv', category: 'academic', url: 'https://arxiv.org/search/?query=%s&searchtype=all', isPopular: true, color: '#b31b1b', description: '计算机/物理/数学开放预印本' },
  { id: 'semanticscholar', name: 'Semantic Scholar', category: 'academic', url: 'https://www.semanticscholar.org/search?q=%s', color: '#1859a5', description: 'AI驱动的学术文献检索平台' },

  // 软件代码
  { id: 'github', name: 'GitHub', category: 'software', url: 'https://github.com/search?q=%s', isPopular: true, color: '#24292e', description: '全球开源代码托管平台' },
  { id: 'pojie52', name: '吾爱破解', category: 'software', url: 'https://www.52pojie.cn/search.php?mod=forum&searchid=1&searchsubmit=yes&kw=%s', isPopular: true, color: '#0194db', description: '软件安全与破解技术论坛' },
  { id: 'chromestore', name: 'Chrome 商店', category: 'software', url: 'https://chromewebstore.google.com/search/%s', color: '#4285F4', description: '谷歌浏览器扩展商店' },
  { id: 'gitee', name: 'Gitee 码云', category: 'software', url: 'https://search.gitee.com/?q=%s', color: '#c71d23', description: '开源中国代码托管平台' },
  { id: 'npm', name: 'NPM', category: 'software', url: 'https://www.npmjs.com/search?q=%s', color: '#cb3837', description: 'Node.js JavaScript 包管理' },
  { id: 'stackoverflow', name: 'Stack Overflow', category: 'software', url: 'https://stackoverflow.com/search?q=%s', color: '#f48024', description: '程序员问答与解决方案' },

  // 网盘磁力
  { id: 'pansou', name: '盘搜网', category: 'pan', url: 'https://www.pansou.com/?q=%s', isPopular: true, color: '#0f72e5', description: '聚合网盘资源搜索引擎' },
  { id: 'alipansou', name: '阿里网盘搜索', category: 'pan', url: 'https://www.alipansou.com/search?k=%s', isPopular: true, color: '#ff6a00', description: '阿里云盘资源高效探索' },
  { id: 'dalipan', name: '百度网盘搜', category: 'pan', url: 'https://www.dalipan.com/search?q=%s', color: '#2932e1', description: '百度网盘公开共享资源' },
  { id: 'quarkpan', name: '夸克网盘', category: 'pan', url: 'https://www.quark.cn/s?q=%s', color: '#23a2fe', description: '夸克网盘极速搜' },
  { id: 'yisou', name: '易搜', category: 'pan', url: 'https://yisou.cool/search?q=%s', color: '#00b894', description: '简洁干净的网盘搜索引擎' },

  // 购物电商
  { id: 'taobao', name: '淘宝', category: 'shopping', url: 'https://s.taobao.com/search?q=%s', isPopular: true, color: '#ff5000', description: '淘你喜欢，网购首选' },
  { id: 'jd', name: '京东', category: 'shopping', url: 'https://search.jd.com/Search?keyword=%s', isPopular: true, color: '#e1251b', description: '正品品质，多快好省' },
  { id: 'pinduoduo', name: '拼多多', category: 'shopping', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%s', color: '#e02e24', description: '拼着买，更便宜' },
  { id: 'amazon', name: '亚马逊', category: 'shopping', url: 'https://www.amazon.cn/s?k=%s', color: '#ff9900', description: '全球商品一站采购' },
  { id: 'alibaba1688', name: '1688 批发', category: 'shopping', url: 'https://s.1688.com/selloffer/offer_search.htm?keywords=%s', color: '#ff6000', description: '源头货源，批发采购' },

  // 新闻资讯
  { id: 'thepaper', name: '澎湃新闻', category: 'news', url: 'https://www.thepaper.cn/searchResult.jsp?inpsearch=%s', isPopular: true, color: '#000000', description: '专注时政与思想严肃新闻' },
  { id: 'kr36', name: '36氪', category: 'news', url: 'https://36kr.com/search/articles/%s', isPopular: true, color: '#0062ff', description: '科技创投与前沿商业资讯' },
  { id: 'huxiu', name: '虎嗅网', category: 'news', url: 'https://www.huxiu.com/search.html?s=%s', color: '#231815', description: '视角独特的商业科技深度内容' },
  { id: 'readhub', name: 'Readhub', category: 'news', url: 'https://readhub.cn/search?q=%s', color: '#333333', description: '聚合科技、创业、开发者资讯' },
  { id: 'googlenews', name: '谷歌新闻', category: 'news', url: 'https://news.google.com/search?q=%s', color: '#4285F4', description: '全球突发与权威新闻' },

  // AI 智搜
  { id: 'gemini_ai', name: '极光 AI 智搜', category: 'ai', url: 'internal:ai_gemini', isPopular: true, color: '#8E75FF', description: '使用 Gemini 内置 AI 极速回答' },
  { id: 'deepseek', name: 'DeepSeek', category: 'ai', url: 'https://chat.deepseek.com/', isPopular: true, color: '#4d6bfe', description: '深度求索 AI 对话助手' },
  { id: 'kimi', name: 'Kimi 智能助手', category: 'ai', url: 'https://kimi.moonshot.cn/', isPopular: true, color: '#1e1e1e', description: 'Moonshot 超长文本 AI 搜索' },
  { id: 'metaso', name: '秘塔 AI 搜索', category: 'ai', url: 'https://metaso.cn/?q=%s', isPopular: true, color: '#1328ff', description: '无广告深入研报与资料 AI 搜' },
  { id: 'perplexity', name: 'Perplexity', category: 'ai', url: 'https://www.perplexity.ai/search?q=%s', color: '#20b2aa', description: '全球首屈一指的对话式 AI 搜索引擎' },
  { id: 'doubao', name: '豆包 AI', category: 'ai', url: 'https://www.doubao.com/', color: '#1296db', description: '字节跳动 AI 智能助手' },
  { id: 'chatgpt', name: 'ChatGPT', category: 'ai', url: 'https://chatgpt.com/?q=%s', color: '#10a37f', description: 'OpenAI 对话生成模型' },
];

export const SUB_SITES = [
  { name: '快搜主页', url: '/', active: true },
  { name: '学术搜索', url: 'https://scholar.google.com/', isExternal: true },
  { name: '数据分析', url: 'https://data.stats.gov.cn/', isExternal: true },
  { name: '开源精选', url: 'https://github.com/trending', isExternal: true },
  { name: '极客社区', url: 'https://v2ex.com/', isExternal: true },
];
