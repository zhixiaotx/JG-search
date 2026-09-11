import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Compass } from 'lucide-react';

interface LeftNavProps {
  activeEngineId: string;
  onSelectEngineById: (engineId: string, fallbackUrl?: string) => void;
  onSearchWithUrl: (targetUrl: string, engineName: string, isBlank?: boolean) => void;
  currentQuery: string;
}

// Fallback search template mappings for items in the left navigation
const DIRECT_SEARCH_MAP: Record<string, { url: string; name: string }> = {
  google: { url: 'https://www.google.com/search?q=%s', name: 'Google' },
  baidu: { url: 'https://www.baidu.com/s?wd=%s', name: '百度' },
  chatgpt: { url: 'https://chatgpt.com/?q=%s', name: 'ChatGPT' },
  kimi: { url: 'https://kimi.moonshot.cn/', name: 'Kimi' },
  yuanbao: { url: 'https://yuanbao.tencent.com/', name: '元宝' },
  doubao: { url: 'https://www.doubao.com/chat/search', name: '豆包' },
  bochaai: { url: 'https://bochaai.com/', name: '博查' },
  wikipedia: { url: 'https://zh.wikipedia.org/wiki/%s', name: 'Wikipedia' },
  google_advanced: { url: 'https://www.google.com/advanced_search', name: '谷歌高级' },
  baidu_advanced: { url: 'https://www.baidu.com/gaoji/advanced.html', name: '百度高级' },
  sogou_advanced: { url: 'https://www.sogou.com/advanced/advanced.html', name: '搜狗高级' },
  xiaohongshu: { url: 'https://www.xiaohongshu.com/search_result?keyword=%s', name: '小红书搜索' },
  weibo: { url: 'https://s.weibo.com/weibo?q=%s', name: '微博搜索' },
  wechat: { url: 'https://weixin.sogou.com/weixin?type=2&query=%s', name: '搜狗微信' },
  zhihu: { url: 'https://www.zhihu.com/search?type=content&q=%s', name: '搜狗知乎' },
  douban: { url: 'https://www.douban.com/search?q=%s', name: '豆瓣搜索' },
  music: { url: 'https://music.163.com/#/search/m/?s=%s', name: '音乐' },
  panso: { url: 'https://pan.funletu.com/?q=%s', name: '趣盘搜' },
  hunhepan: { url: 'https://pan.club/', name: '网盘俱乐部' },
  cupfox: { url: 'https://ssgo.app/', name: '云盘搜索' },
  jiumodiary: { url: 'https://www.jiumodiary.com/', name: '电子书' },
  soman: { url: 'https://ai.animedb.cn/', name: '以图识番' },
  future: { url: 'https://bks.thefuture.top/', name: 'TheFuture' },
  capub: { url: 'https://pdc.capub.cn/', name: '出版物数据' },
  shidianguji: { url: 'https://www.shidianguji.com/search?query=%s', name: '识典古籍' },
  zdic: { url: 'https://www.zdic.net/hans/%s', name: '汉典' },
  iptv: { url: 'https://iptv-org.github.io/', name: 'IPTV 直播源' },
  law: { url: 'https://flk.npc.gov.cn/', name: '法律法规' },
  qichacha: { url: 'https://www.tianyancha.com/search?key=%s', name: '查企业' },
  similarsites: { url: 'https://cn.similarsites.com/site/%s', name: 'SimilarSites' },
  github: { url: 'https://github.com/search?q=%s', name: 'GitHub' },
  open: { url: 'https://www.openhub.net/p?query=%s', name: '开源代码' },
  wolf: { url: 'https://www.wolframalpha.com/input?i=%s', name: 'Wolfram Alpha' },
  index: { url: 'https://www.google.com/search?q=%s', name: '索引搜索' },
  kuaidi: { url: 'https://www.kuaidi100.com/', name: '快递' },
  gepu: { url: 'https://www.zhaogepu.com/', name: '找歌谱' },
  bilibili: { url: 'https://search.bilibili.com/all?keyword=%s', name: '哔哩哔哩' },
  emoji: { url: 'https://searchemoji.app/zh-hans', name: 'SearchEmoji' },
  vectorlogo: { url: 'https://worldvectorlogo.com/', name: '矢量 logo' },
  font: { url: 'https://www.likefont.com/', name: '字体识别' },
  visualhunt: { url: 'https://visualhunt.com/', name: 'Visual Hunt' },
  mba: { url: 'https://wiki.mbalib.com/wiki/Special:Search?search=%s', name: 'MBA智库' },
  makedie: { url: 'https://secure.assrt.net/', name: '字幕反向搜索' },
  plantplus: { url: 'https://www.plantplus.cn/', name: '植物物种' },
  innojoy: { url: 'https://www.innojoy.com/search/index.shtml', name: '专利检索' },

  // Submenu items
  gooleimage: { url: 'https://www.google.com/imghp', name: 'Google images' },
  tineye: { url: 'https://tineye.com/', name: 'TinEye' },
  yandex: { url: 'https://yandex.com/images/', name: 'Yandex images' },
  baidushitu: { url: 'https://image.baidu.com/?fr=shitu', name: '百度识图' },
  visualsearch: { url: 'https://www.bing.com/visualsearch', name: '必应视觉搜索' },

  amap: { url: 'https://ditu.amap.com/search?query=%s', name: '高德地图' },
  baidumap: { url: 'https://map.baidu.com/search?query=%s', name: '百度地图' },
  googlemap: { url: 'https://www.google.com/maps/search/%s', name: '谷歌地图' },
  tencentmap: { url: 'https://map.qq.com/', name: '腾讯地图' },
  sogoumap: { url: 'https://map.sogou.com', name: '搜狗地图' },
};

interface ItemMeta {
  domain?: string;
  iconSrc?: string;
  color: string;
  fallbackText: string;
}

// Metadata for high-res favicons and robust fallbacks
const ITEM_META: Record<string, ItemMeta> = {
  google: { domain: 'google.com', iconSrc: './images/google.ico', color: '#4285F4', fallbackText: 'G' },
  baidu: { domain: 'baidu.com', iconSrc: './images/baidu.ico', color: '#2932E1', fallbackText: '百' },
  chatgpt: { domain: 'chatgpt.com', iconSrc: './images/ChatGPTicon.svg', color: '#10A37F', fallbackText: 'AI' },
  kimi: { domain: 'moonshot.cn', color: '#1B64F2', fallbackText: 'K' },
  yuanbao: { domain: 'tencent.com', iconSrc: 'https://cdn-bot.hunyuan.tencent.com/logo-v2.png', color: '#0052D9', fallbackText: '元' },
  doubao: { domain: 'doubao.com', color: '#3370FF', fallbackText: '豆' },
  bochaai: { domain: 'bochaai.com', color: '#6366F1', fallbackText: '博' },
  wikipedia: { domain: 'wikipedia.org', color: '#333333', fallbackText: 'W' },
  gooleimage: { domain: 'google.com', iconSrc: './images/google.ico', color: '#4285F4', fallbackText: 'G' },
  tineye: { domain: 'tineye.com', color: '#2274A5', fallbackText: 'T' },
  yandex: { domain: 'yandex.com', color: '#FC3F1D', fallbackText: 'Y' },
  baidushitu: { domain: 'baidu.com', iconSrc: './images/baidu.ico', color: '#2932E1', fallbackText: '图' },
  visualsearch: { domain: 'bing.com', color: '#008373', fallbackText: 'B' },
  google_advanced: { domain: 'google.com', iconSrc: './images/google.ico', color: '#4285F4', fallbackText: 'G' },
  baidu_advanced: { domain: 'baidu.com', iconSrc: './images/baidu.ico', color: '#2932E1', fallbackText: '百' },
  sogou_advanced: { domain: 'sogou.com', color: '#FF5900', fallbackText: '搜' },
  xiaohongshu: { domain: 'xiaohongshu.com', color: '#FF2442', fallbackText: '红' },
  weibo: { domain: 'weibo.com', color: '#E6162D', fallbackText: '微' },
  wechat: { domain: 'weixin.qq.com', color: '#07C160', fallbackText: '信' },
  zhihu: { domain: 'zhihu.com', color: '#0084FF', fallbackText: '知' },
  douban: { domain: 'douban.com', color: '#007722', fallbackText: '豆' },
  music: { domain: 'music.163.com', color: '#C20C0C', fallbackText: '音' },
  map: { domain: 'amap.com', color: '#0091FF', fallbackText: '图' },
  amap: { domain: 'amap.com', color: '#0091FF', fallbackText: '高' },
  baidumap: { domain: 'map.baidu.com', iconSrc: './images/baidu.ico', color: '#2932E1', fallbackText: '百' },
  googlemap: { domain: 'google.com', iconSrc: './images/google.ico', color: '#4285F4', fallbackText: 'G' },
  tencentmap: { domain: 'map.qq.com', color: '#2E75D3', fallbackText: '腾' },
  sogoumap: { domain: 'map.sogou.com', color: '#FF5900', fallbackText: '搜' },
  panso: { domain: 'funletu.com', iconSrc: 'https://pan.funletu.com/favicon.svg', color: '#00B4D8', fallbackText: '盘' },
  hunhepan: { domain: 'hunhepan.com', iconSrc: 'https://hunhepan.com/favicon-32x32.png', color: '#4F46E5', fallbackText: '俱' },
  cupfox: { domain: 'ssgo.app', color: '#F59E0B', fallbackText: '云' },
  jiumodiary: { domain: 'jiumodiary.com', color: '#10B981', fallbackText: '鸠' },
  soman: { domain: 'animedb.cn', color: '#EC4899', fallbackText: '漫' },
  future: { domain: 'thefuture.top', color: '#8B5CF6', fallbackText: '未' },
  capub: { domain: 'capub.cn', color: '#64748B', fallbackText: '书' },
  shidianguji: { domain: 'shidianguji.com', color: '#854D0E', fallbackText: '识' },
  zdic: { domain: 'zdic.net', color: '#991B1B', fallbackText: '汉' },
  iptv: { domain: 'iptv-org.github.io', color: '#0284C7', fallbackText: 'TV' },
  law: { domain: 'npc.gov.cn', color: '#DC2626', fallbackText: '法' },
  qichacha: { domain: 'tianyancha.com', color: '#2563EB', fallbackText: '企' },
  similarsites: { domain: 'similarsites.com', color: '#0D9488', fallbackText: '同' },
  github: { domain: 'github.com', color: '#24292E', fallbackText: 'Git' },
  open: { domain: 'openhub.net', color: '#16A34A', fallbackText: '开' },
  wolf: { domain: 'wolframalpha.com', color: '#FF7F00', fallbackText: 'W' },
  index: { domain: 'google.com', iconSrc: './images/google.ico', color: '#4285F4', fallbackText: '索' },
  kuaidi: { domain: 'kuaidi100.com', color: '#EA580C', fallbackText: '递' },
  gepu: { domain: 'zhaogepu.com', color: '#7C3AED', fallbackText: '谱' },
  bilibili: { domain: 'bilibili.com', color: '#00AEEC', fallbackText: 'B' },
  emoji: { domain: 'searchemoji.app', color: '#FBBF24', fallbackText: '😊' },
  vectorlogo: { domain: 'worldvectorlogo.com', color: '#3B82F6', fallbackText: 'V' },
  font: { domain: 'likefont.com', color: '#6366F1', fallbackText: '字' },
  visualhunt: { domain: 'visualhunt.com', color: '#14B8A6', fallbackText: '视' },
  mba: { domain: 'mbalib.com', color: '#1E40AF', fallbackText: '智' },
  makedie: { domain: 'assrt.net', color: '#475569', fallbackText: '字' },
  plantplus: { domain: 'plantplus.cn', iconSrc: 'https://www.plantplus.cn/cn/images/favicon.ico', color: '#15803D', fallbackText: '植' },
  innojoy: { domain: 'innojoy.com', color: '#0369A1', fallbackText: '专' },
  searchbyimage: { domain: 'yandex.com', color: '#FC3F1D', fallbackText: '图' },
};

// Resilient Logo Icon Component with graceful degradation
const NavIcon: React.FC<{ id: string; name: string; iconSrc?: string }> = ({ id, name, iconSrc }) => {
  const [loadFailed, setLoadFailed] = useState(false);
  const meta: ItemMeta = ITEM_META[id] || { color: '#3b82f6', fallbackText: name.slice(0, 1) };

  // Calculate icon source:
  // 1. Explicit iconSrc (e.g. relative path ./images/...)
  // 2. Meta defined iconSrc
  // 3. Google Favicon CDN based on domain
  const targetSrc =
    iconSrc ||
    meta.iconSrc ||
    (meta.domain ? `https://www.google.com/s2/favicons?domain=${meta.domain}&sz=32` : undefined);

  if (loadFailed || !targetSrc) {
    return (
      <span
        className="w-4 h-4 rounded-xs shrink-0 mr-2 flex items-center justify-center text-[10px] font-bold text-white leading-none shadow-2xs select-none"
        style={{ backgroundColor: meta.color || '#3b82f6' }}
      >
        {meta.fallbackText || name.slice(0, 1)}
      </span>
    );
  }

  return (
    <img
      src={targetSrc}
      alt={name}
      loading="lazy"
      onError={() => setLoadFailed(true)}
      className="w-4 h-4 mr-2 object-contain shrink-0 rounded-xs"
    />
  );
};

export const LeftNav: React.FC<LeftNavProps> = ({
  activeEngineId,
  onSelectEngineById,
  onSearchWithUrl,
  currentQuery,
}) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    searchbyimage: false,
    map: false,
  });

  const toggleSubmenu = (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleItemClick = (
    id: string,
    dataUrl: string,
    title: string,
    isBlank: boolean = false,
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.preventDefault();
    }

    let targetUrl = dataUrl;
    const mapping = DIRECT_SEARCH_MAP[id];

    // If query exists and item supports direct search
    if (currentQuery.trim()) {
      if (mapping && mapping.url.includes('%s')) {
        targetUrl = mapping.url.replace('%s', encodeURIComponent(currentQuery.trim()));
      } else if (targetUrl.includes('%s')) {
        targetUrl = targetUrl.replace('%s', encodeURIComponent(currentQuery.trim()));
      }
    } else if (targetUrl.includes('%s')) {
      targetUrl = targetUrl.replace(/[\?&]?[a-zA-Z_]+=%s/, '').replace('%s', '');
    }

    // Select the engine in state
    onSelectEngineById(id, targetUrl);

    // Immediately open the page in the right-hand preview
    onSearchWithUrl(targetUrl, title, isBlank);
  };

  return (
    <div className="left-nav w-full">
      <div className="px-2 py-1.5 mb-1 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-500" />
          快搜导航
        </span>
        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-mono font-semibold">
          47+
        </span>
      </div>

      <ul id="foo" className="chongbuluo space-y-0.5 select-none">
        <li
          id="google"
          className={activeEngineId === 'google' ? 'active' : ''}
          onClick={(e) => handleItemClick('google', './iGoogle.html', 'Google', false, e)}
        >
          <NavIcon id="google" name="Google" iconSrc="./images/google.ico" />
          <a data="./iGoogle.html">Google</a>
        </li>

        <li
          id="baidu"
          className={activeEngineId === 'baidu' ? 'active' : ''}
          onClick={(e) => handleItemClick('baidu', './diybaidu.html', '百度', false, e)}
        >
          <NavIcon id="baidu" name="百度" iconSrc="./images/baidu.ico" />
          <a data="./diybaidu.html">百度</a>
        </li>

        <li
          id="chatgpt"
          className={activeEngineId === 'chatgpt' ? 'active' : ''}
          onClick={(e) => handleItemClick('chatgpt', './chatgpt.html', 'ChatGPT', false, e)}
        >
          <NavIcon id="chatgpt" name="ChatGPT" iconSrc="./images/ChatGPTicon.svg" />
          <a data="./chatgpt.html">ChatGPT</a>
        </li>

        <li
          id="kimi"
          className={activeEngineId === 'kimi' ? 'active' : ''}
          onClick={(e) => handleItemClick('kimi', 'https://kimi.moonshot.cn/', 'Kimi', false, e)}
        >
          <NavIcon id="kimi" name="Kimi" />
          <a data="https://kimi.moonshot.cn/">Kimi</a>
        </li>

        <li
          id="yuanbao"
          className={activeEngineId === 'yuanbao' ? 'active' : ''}
          onClick={(e) => handleItemClick('yuanbao', 'https://yuanbao.tencent.com/', '元宝', false, e)}
        >
          <NavIcon id="yuanbao" name="元宝" iconSrc="https://cdn-bot.hunyuan.tencent.com/logo-v2.png" />
          <a data="https://yuanbao.tencent.com/">元宝</a>
        </li>

        <li
          id="doubao"
          className={activeEngineId === 'doubao' ? 'active' : ''}
          onClick={(e) => handleItemClick('doubao', 'https://www.doubao.com/chat/search', '豆包', true, e)}
        >
          <NavIcon id="doubao" name="豆包" />
          <a data="https://www.doubao.com/chat/search" target="_blank" rel="noreferrer">
            豆包
          </a>
        </li>

        <li
          id="bochaai"
          className={activeEngineId === 'bochaai' ? 'active' : ''}
          onClick={(e) => handleItemClick('bochaai', 'https://bochaai.com/', '博查', false, e)}
        >
          <NavIcon id="bochaai" name="博查" />
          <a data="https://bochaai.com/">博查</a>
        </li>

        <li
          id="wikipedia"
          className={activeEngineId === 'wikipedia' ? 'active' : ''}
          onClick={(e) => handleItemClick('wikipedia', 'https://zh.wikipedia.org/', 'Wikipedia', false, e)}
        >
          <NavIcon id="wikipedia" name="Wikipedia" />
          <a data="https://zh.wikipedia.org/">Wikipedia</a>
        </li>

        {/* 以图搜图 with Submenu */}
        <li
          id="searchbyimage"
          className={`!flex-col !items-stretch !p-0 overflow-hidden text-left ${
            expandedMenus.searchbyimage ? 'bg-slate-50/80 dark:bg-slate-800/50' : ''
          }`}
        >
          <div
            className="flex items-center px-2.5 py-1.5 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-lg justify-between w-full text-left"
            onClick={(e) => toggleSubmenu('searchbyimage', e)}
          >
            <div className="flex items-center text-left flex-1 min-w-0">
              <NavIcon id="searchbyimage" name="以图搜图" />
              <a className="text-left truncate">以图搜图</a>
            </div>
            {expandedMenus.searchbyimage ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </div>
          {expandedMenus.searchbyimage && (
            <ul className="more border-l-2 border-blue-500/40 ml-4 my-1 pl-2 space-y-1">
              <li
                id="gooleimage"
                onClick={(e) => handleItemClick('gooleimage', 'https://www.google.com/imghp', 'Google images', true, e)}
              >
                <NavIcon id="gooleimage" name="Google images" iconSrc="./images/google.ico" />
                <a data="https://www.google.com/imghp" target="_blank" rel="noreferrer">
                  Google images
                </a>
              </li>
              <li
                id="tineye"
                onClick={(e) => handleItemClick('tineye', 'https://tineye.com/', 'TinEye', false, e)}
              >
                <NavIcon id="tineye" name="TinEye" />
                <a data="https://tineye.com/">TinEye</a>
              </li>
              <li
                id="yandex"
                onClick={(e) => handleItemClick('yandex', 'https://yandex.com/images/', 'Yandex images', true, e)}
              >
                <NavIcon id="yandex" name="Yandex images" />
                <a data="https://yandex.com/images/" target="_blank" rel="noreferrer">
                  Yandex images
                </a>
              </li>
              <li
                id="baidushitu"
                onClick={(e) => handleItemClick('baidushitu', 'https://image.baidu.com/?fr=shitu', '百度识图', false, e)}
              >
                <NavIcon id="baidushitu" name="百度识图" iconSrc="./images/baidu.ico" />
                <a data="https://image.baidu.com/?fr=shitu">百度识图</a>
              </li>
              <li
                id="visualsearch"
                onClick={(e) => handleItemClick('visualsearch', 'https://www.bing.com/visualsearch', '必应视觉搜索', false, e)}
              >
                <NavIcon id="visualsearch" name="必应视觉搜索" />
                <a data="https://www.bing.com/visualsearch">必应视觉搜索</a>
              </li>
            </ul>
          )}
        </li>

        <li
          id="google_advanced"
          onClick={(e) => handleItemClick('google_advanced', 'https://www.google.com/advanced_search', '谷歌高级', false, e)}
        >
          <NavIcon id="google_advanced" name="谷歌高级" iconSrc="./images/google.ico" />
          <a data="https://www.google.com/advanced_search">谷歌高级</a>
        </li>

        <li
          id="baidu_advanced"
          onClick={(e) => handleItemClick('baidu_advanced', 'https://www.baidu.com/gaoji/advanced.html', '百度高级', false, e)}
        >
          <NavIcon id="baidu_advanced" name="百度高级" iconSrc="./images/baidu.ico" />
          <a data="https://www.baidu.com/gaoji/advanced.html">百度高级</a>
        </li>

        <li
          id="sogou_advanced"
          onClick={(e) => handleItemClick('sogou_advanced', 'https://www.sogou.com/advanced/advanced.html', '搜狗高级', false, e)}
        >
          <NavIcon id="sogou_advanced" name="搜狗高级" />
          <a data="https://www.sogou.com/advanced/advanced.html">搜狗高级</a>
        </li>

        <li
          id="xiaohongshu"
          className={activeEngineId === 'xiaohongshu' ? 'active' : ''}
          onClick={(e) => handleItemClick('xiaohongshu', 'https://www.xiaohongshu.com/explore', '小红书搜索', false, e)}
        >
          <NavIcon id="xiaohongshu" name="小红书搜索" />
          <a data="https://www.xiaohongshu.com/explore">小红书搜索</a>
        </li>

        <li
          id="weibo"
          className={activeEngineId === 'weibo' ? 'active' : ''}
          onClick={(e) => handleItemClick('weibo', 'https://s.weibo.com/', '微博搜索', false, e)}
        >
          <NavIcon id="weibo" name="微博搜索" />
          <a data="https://s.weibo.com/">微博搜索</a>
        </li>

        <li
          id="wechat"
          className={activeEngineId === 'wechat' ? 'active' : ''}
          onClick={(e) => handleItemClick('wechat', 'https://weixin.sogou.com/', '搜狗微信', false, e)}
        >
          <NavIcon id="wechat" name="搜狗微信" />
          <a data="https://weixin.sogou.com/">搜狗微信</a>
        </li>

        <li
          id="zhihu"
          className={activeEngineId === 'zhihu' ? 'active' : ''}
          onClick={(e) => handleItemClick('zhihu', 'https://www.zhihu.com/explore', '知乎探索', false, e)}
        >
          <NavIcon id="zhihu" name="知乎探索" />
          <a data="https://www.zhihu.com/explore">知乎探索</a>
        </li>

        <li
          id="douban"
          className={activeEngineId === 'douban' ? 'active' : ''}
          onClick={(e) => handleItemClick('douban', 'https://www.douban.com/', '豆瓣搜索', false, e)}
        >
          <NavIcon id="douban" name="豆瓣搜索" />
          <a data="https://www.douban.com/">豆瓣搜索</a>
        </li>

        <li
          id="music"
          className={activeEngineId === 'music' ? 'active' : ''}
          onClick={(e) => handleItemClick('music', 'https://music.163.com/', '音乐', false, e)}
        >
          <NavIcon id="music" name="音乐" />
          <a data="https://music.163.com/">音乐</a>
        </li>

        {/* Map with Submenu */}
        <li
          id="map"
          className={`!flex-col !items-stretch !p-0 overflow-hidden text-left ${
            expandedMenus.map ? 'bg-slate-50/80 dark:bg-slate-800/50' : ''
          }`}
        >
          <div
            className="flex items-center px-2.5 py-1.5 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-lg justify-between w-full text-left"
            onClick={(e) => toggleSubmenu('map', e)}
          >
            <div className="flex items-center text-left flex-1 min-w-0">
              <NavIcon id="map" name="Map" />
              <a className="text-left truncate">Map</a>
            </div>
            {expandedMenus.map ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </div>
          {expandedMenus.map && (
            <ul className="more border-l-2 border-blue-500/40 ml-4 my-1 pl-2 space-y-1">
              <li
                id="amap"
                onClick={(e) => handleItemClick('amap', 'https://ditu.amap.com/', '高德地图', false, e)}
              >
                <NavIcon id="amap" name="高德地图" />
                <a data="https://ditu.amap.com/">高德地图</a>
              </li>
              <li
                id="baidumap"
                onClick={(e) => handleItemClick('baidumap', 'https://map.baidu.com/', '百度地图', false, e)}
              >
                <NavIcon id="baidumap" name="百度地图" iconSrc="./images/baidu.ico" />
                <a data="https://map.baidu.com/">百度地图</a>
              </li>
              <li
                id="googlemap"
                onClick={(e) => handleItemClick('googlemap', 'https://www.google.com/maps/', '谷歌地图', true, e)}
              >
                <NavIcon id="googlemap" name="谷歌地图" iconSrc="./images/google.ico" />
                <a data="https://www.google.com/maps/" target="_blank" rel="noreferrer">
                  谷歌地图
                </a>
              </li>
              <li
                id="tencentmap"
                onClick={(e) => handleItemClick('tencentmap', 'https://map.qq.com/', '腾讯地图', false, e)}
              >
                <NavIcon id="tencentmap" name="腾讯地图" />
                <a data="https://map.qq.com/">腾讯地图</a>
              </li>
              <li
                id="sogoumap"
                onClick={(e) => handleItemClick('sogoumap', 'https://map.sogou.com', '搜狗地图', false, e)}
              >
                <NavIcon id="sogoumap" name="搜狗地图" />
                <a data="https://map.sogou.com">搜狗地图</a>
              </li>
            </ul>
          )}
        </li>

        <li
          id="panso"
          className={activeEngineId === 'panso' ? 'active' : ''}
          onClick={(e) => handleItemClick('panso', 'https://pan.funletu.com/', '趣盘搜', false, e)}
        >
          <NavIcon id="panso" name="趣盘搜" iconSrc="https://pan.funletu.com/favicon.svg" />
          <a data="https://pan.funletu.com/">趣盘搜</a>
        </li>

        <li
          id="hunhepan"
          onClick={(e) => handleItemClick('hunhepan', 'https://pan.club/', '网盘俱乐部', false, e)}
        >
          <NavIcon id="hunhepan" name="网盘俱乐部" iconSrc="https://hunhepan.com/favicon-32x32.png" />
          <a data="https://pan.club/">网盘俱乐部</a>
        </li>

        <li
          id="cupfox"
          onClick={(e) => handleItemClick('cupfox', 'https://ssgo.app/', '云盘搜索', false, e)}
        >
          <NavIcon id="cupfox" name="云盘搜索" />
          <a data="https://ssgo.app/">云盘搜索</a>
        </li>

        <li
          id="jiumodiary"
          onClick={(e) => handleItemClick('jiumodiary', 'https://www.jiumodiary.com/', '电子书', false, e)}
        >
          <NavIcon id="jiumodiary" name="电子书" />
          <a data="https://www.jiumodiary.com/">电子书</a>
        </li>

        <li
          id="soman"
          onClick={(e) => handleItemClick('soman', 'https://ai.animedb.cn/', '以图识番', false, e)}
        >
          <NavIcon id="soman" name="以图识番" />
          <a data="https://ai.animedb.cn/">以图识番</a>
        </li>

        <li
          id="future"
          onClick={(e) => handleItemClick('future', 'https://bks.thefuture.top/', 'TheFuture', false, e)}
        >
          <NavIcon id="future" name="TheFuture" />
          <a data="https://bks.thefuture.top/">TheFuture</a>
        </li>

        <li
          id="capub"
          onClick={(e) => handleItemClick('capub', 'https://pdc.capub.cn/', '出版物数据', true, e)}
        >
          <NavIcon id="capub" name="出版物数据" />
          <a data="https://pdc.capub.cn/" target="_blank" rel="noreferrer">
            出版物数据
          </a>
        </li>

        <li
          id="shidianguji"
          onClick={(e) => handleItemClick('shidianguji', 'https://www.shidianguji.com/', '识典古籍', false, e)}
        >
          <NavIcon id="shidianguji" name="识典古籍" />
          <a data="https://www.shidianguji.com/">识典古籍</a>
        </li>

        <li
          id="zdic"
          onClick={(e) => handleItemClick('zdic', 'https://www.zdic.net/', '汉典', false, e)}
        >
          <NavIcon id="zdic" name="汉典" />
          <a data="https://www.zdic.net/">汉典</a>
        </li>

        <li
          id="iptv"
          onClick={(e) => handleItemClick('iptv', 'https://iptv-org.github.io/', 'IPTV 直播源', false, e)}
        >
          <NavIcon id="iptv" name="IPTV 直播源" />
          <a data="https://iptv-org.github.io/">IPTV 直播源</a>
        </li>

        <li
          id="law"
          onClick={(e) => handleItemClick('law', 'https://flk.npc.gov.cn/', '法律法规', false, e)}
        >
          <NavIcon id="law" name="法律法规" />
          <a data="https://flk.npc.gov.cn/">法律法规</a>
        </li>

        <li
          id="qichacha"
          onClick={(e) => handleItemClick('qichacha', 'https://www.tianyancha.com/', '查企业', false, e)}
        >
          <NavIcon id="qichacha" name="查企业" />
          <a data="https://www.tianyancha.com/">查企业</a>
        </li>

        <li
          id="similarsites"
          onClick={(e) => handleItemClick('similarsites', 'https://cn.similarsites.com/', 'SimilarSites', false, e)}
        >
          <NavIcon id="similarsites" name="SimilarSites" />
          <a data="https://cn.similarsites.com/">SimilarSites</a>
        </li>

        <li
          id="github"
          className={activeEngineId === 'github' ? 'active' : ''}
          onClick={(e) => handleItemClick('github', 'https://github.com/explore', 'GitHub', false, e)}
        >
          <NavIcon id="github" name="GitHub" />
          <a data="https://github.com/explore">GitHub</a>
        </li>

        <li
          id="open"
          onClick={(e) => handleItemClick('open', 'https://www.openhub.net/', '开源代码', false, e)}
        >
          <NavIcon id="open" name="开源代码" />
          <a data="https://www.openhub.net/">开源代码</a>
        </li>

        <li
          id="wolf"
          onClick={(e) => handleItemClick('wolf', 'https://www.wolframalpha.com/', 'Wolfram Alpha', false, e)}
        >
          <NavIcon id="wolf" name="Wolfram Alpha" />
          <a data="https://www.wolframalpha.com/">Wolfram Alpha</a>
        </li>

        <li
          id="index"
          onClick={(e) => handleItemClick('index', 'https://www.google.com/search?q=%s', '索引搜索', false, e)}
        >
          <NavIcon id="index" name="索引搜索" iconSrc="./images/google.ico" />
          <a data="https://www.google.com/search?q=%s">索引搜索</a>
        </li>

        <li
          id="kuaidi"
          onClick={(e) => handleItemClick('kuaidi', 'https://www.kuaidi100.com/', '快递', false, e)}
        >
          <NavIcon id="kuaidi" name="快递" />
          <a data="https://www.kuaidi100.com/">快递</a>
        </li>

        <li
          id="gepu"
          onClick={(e) => handleItemClick('gepu', 'https://www.zhaogepu.com/', '找歌谱', false, e)}
        >
          <NavIcon id="gepu" name="找歌谱" />
          <a data="https://www.zhaogepu.com/">找歌谱</a>
        </li>

        <li
          id="bilibili"
          className={activeEngineId === 'bilibili' ? 'active' : ''}
          onClick={(e) => handleItemClick('bilibili', 'https://www.bilibili.com/', '哔哩哔哩', false, e)}
        >
          <NavIcon id="bilibili" name="哔哩哔哩" />
          <a data="https://www.bilibili.com/">哔哩哔哩</a>
        </li>

        <li
          id="emoji"
          onClick={(e) => handleItemClick('emoji', 'https://searchemoji.app/zh-hans', 'SearchEmoji', false, e)}
        >
          <NavIcon id="emoji" name="SearchEmoji" />
          <a data="https://searchemoji.app/zh-hans">SearchEmoji</a>
        </li>

        <li
          id="vectorlogo"
          onClick={(e) => handleItemClick('vectorlogo', 'https://worldvectorlogo.com/', '矢量 logo', false, e)}
        >
          <NavIcon id="vectorlogo" name="矢量 logo" />
          <a data="https://worldvectorlogo.com/">矢量 logo</a>
        </li>

        <li
          id="font"
          onClick={(e) => handleItemClick('font', 'https://www.likefont.com/', '字体识别', false, e)}
        >
          <NavIcon id="font" name="字体识别" />
          <a data="https://www.likefont.com/">字体识别</a>
        </li>

        <li
          id="visualhunt"
          onClick={(e) => handleItemClick('visualhunt', 'https://visualhunt.com/', 'Visual Hunt', false, e)}
        >
          <NavIcon id="visualhunt" name="Visual Hunt" />
          <a data="https://visualhunt.com/">Visual Hunt</a>
        </li>

        <li
          id="mba"
          onClick={(e) => handleItemClick('mba', 'https://www.mbalib.com/', 'MBA智库', false, e)}
        >
          <NavIcon id="mba" name="MBA智库" />
          <a data="https://www.mbalib.com/">MBA智库</a>
        </li>

        <li
          id="makedie"
          onClick={(e) => handleItemClick('makedie', 'https://secure.assrt.net/', '字幕反向搜索', false, e)}
        >
          <NavIcon id="makedie" name="字幕反向搜索" />
          <a data="https://secure.assrt.net/">字幕反向搜索</a>
        </li>

        <li
          id="plantplus"
          onClick={(e) => handleItemClick('plantplus', 'https://www.plantplus.cn/', '植物物种', false, e)}
        >
          <NavIcon id="plantplus" name="植物物种" iconSrc="https://www.plantplus.cn/cn/images/favicon.ico" />
          <a data="https://www.plantplus.cn/">植物物种</a>
        </li>

        <li
          id="innojoy"
          onClick={(e) => handleItemClick('innojoy', 'https://www.innojoy.com/search/index.shtml', '专利检索', false, e)}
        >
          <NavIcon id="innojoy" name="专利检索" />
          <a data="https://www.innojoy.com/search/index.shtml">专利检索</a>
        </li>
      </ul>
    </div>
  );
};
