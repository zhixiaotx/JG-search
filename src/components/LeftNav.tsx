import React, { useState } from 'react';
import { SearchEngine } from '../types';
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
    onSearchWithUrl(targetUrl, title, false);
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
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
          onClick={(e) => handleItemClick('google', '/iGoogle.html', 'Google', false, e)}
        >
          <img src="/images/google.ico" alt="Google" onError={handleImgError} />
          <a data="/iGoogle.html">Google</a>
        </li>

        <li
          id="baidu"
          className={activeEngineId === 'baidu' ? 'active' : ''}
          onClick={(e) => handleItemClick('baidu', '/diybaidu.html', '百度', false, e)}
        >
          <img src="/images/baidu.ico" alt="百度" onError={handleImgError} />
          <a data="/diybaidu.html">百度</a>
        </li>

        <li
          id="chatgpt"
          className={activeEngineId === 'chatgpt' ? 'active' : ''}
          onClick={(e) => handleItemClick('chatgpt', '/chatgpt.html', 'ChatGPT', false, e)}
        >
          <img src="/images/ChatGPTicon.svg" alt="ChatGPT" onError={handleImgError} />
          <a data="/chatgpt.html">ChatGPT</a>
        </li>

        <li
          id="kimi"
          className={activeEngineId === 'kimi' ? 'active' : ''}
          onClick={(e) => handleItemClick('kimi', 'https://kimi.moonshot.cn/', 'Kimi', false, e)}
        >
          <img src="/images/kimi.ico" alt="Kimi" onError={handleImgError} />
          <a data="https://kimi.moonshot.cn/">Kimi</a>
        </li>

        <li
          id="yuanbao"
          className={activeEngineId === 'yuanbao' ? 'active' : ''}
          onClick={(e) => handleItemClick('yuanbao', 'https://yuanbao.tencent.com/', '元宝', false, e)}
        >
          <img src="https://cdn-bot.hunyuan.tencent.com/logo-v2.png" alt="元宝" onError={handleImgError} />
          <a data="https://yuanbao.tencent.com/">元宝</a>
        </li>

        <li
          id="doubao"
          className={activeEngineId === 'doubao' ? 'active' : ''}
          onClick={(e) => handleItemClick('doubao', 'https://www.doubao.com/chat/search', '豆包', true, e)}
        >
          <img src="/images/doubao.png" alt="豆包" onError={handleImgError} />
          <a data="https://www.doubao.com/chat/search" target="_blank" rel="noreferrer">
            豆包
          </a>
        </li>

        <li
          id="bochaai"
          className={activeEngineId === 'bochaai' ? 'active' : ''}
          onClick={(e) => handleItemClick('bochaai', 'https://bochaai.com/', '博查', false, e)}
        >
          <img src="/images/bochaai.png" alt="博查" onError={handleImgError} />
          <a data="https://bochaai.com/">博查</a>
        </li>

        <li
          id="wikipedia"
          className={activeEngineId === 'wikipedia' ? 'active' : ''}
          onClick={(e) => handleItemClick('wikipedia', 'https://search.chongbuluo.com/wiki.html', 'Wikipedia', false, e)}
        >
          <img src="/images/wikipedia.ico" alt="Wikipedia" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/wiki.html">Wikipedia</a>
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
              <img src="/images/yandex.ico" alt="以图搜图" onError={handleImgError} />
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
                <img src="/images/google.ico" alt="Google images" onError={handleImgError} />
                <a data="https://www.google.com/imghp" target="_blank" rel="noreferrer">
                  Google images
                </a>
              </li>
              <li
                id="tineye"
                onClick={(e) => handleItemClick('tineye', 'https://tineye.com/', 'TinEye', false, e)}
              >
                <img src="/images/tineye.ico" alt="TinEye" onError={handleImgError} />
                <a data="https://tineye.com/">TinEye</a>
              </li>
              <li
                id="yandex"
                onClick={(e) => handleItemClick('yandex', 'https://yandex.com/images/', 'Yandex images', true, e)}
              >
                <img src="/images/yandex.ico" alt="Yandex images" onError={handleImgError} />
                <a data="https://yandex.com/images/" target="_blank" rel="noreferrer">
                  Yandex images
                </a>
              </li>
              <li
                id="baidushitu"
                onClick={(e) => handleItemClick('baidushitu', 'https://image.baidu.com/?fr=shitu', '百度识图', false, e)}
              >
                <img src="/images/baidu.ico" alt="百度识图" onError={handleImgError} />
                <a data="https://image.baidu.com/?fr=shitu">百度识图</a>
              </li>
              <li
                id="visualsearch"
                onClick={(e) => handleItemClick('visualsearch', 'https://www.bing.com/visualsearch', '必应视觉搜索', false, e)}
              >
                <img src="/images/bing.ico" alt="必应视觉搜索" onError={handleImgError} />
                <a data="https://www.bing.com/visualsearch">必应视觉搜索</a>
              </li>
            </ul>
          )}
        </li>

        <li
          id="google_advanced"
          onClick={(e) => handleItemClick('google_advanced', 'https://search.chongbuluo.com/advanced_search.html', '谷歌高级', false, e)}
        >
          <img src="/images/google.ico" alt="谷歌高级" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/advanced_search.html">谷歌高级</a>
        </li>

        <li
          id="baidu_advanced"
          onClick={(e) => handleItemClick('baidu_advanced', 'https://search.chongbuluo.com/baidu_advanced.html', '百度高级', false, e)}
        >
          <img src="/images/baidu.ico" alt="百度高级" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/baidu_advanced.html">百度高级</a>
        </li>

        <li
          id="sogou_advanced"
          onClick={(e) => handleItemClick('sogou_advanced', 'https://search.chongbuluo.com/sogou_advanced.html', '搜狗高级', false, e)}
        >
          <img src="/images/sogou.ico" alt="搜狗高级" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/sogou_advanced.html">搜狗高级</a>
        </li>

        <li
          id="xiaohongshu"
          className={activeEngineId === 'xiaohongshu' ? 'active' : ''}
          onClick={(e) => handleItemClick('xiaohongshu', 'https://search.chongbuluo.com/xhs.html', '小红书搜索', false, e)}
        >
          <img src="/images/xiaohongshu.ico" alt="小红书搜索" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/xhs.html">小红书搜索</a>
        </li>

        <li
          id="weibo"
          className={activeEngineId === 'weibo' ? 'active' : ''}
          onClick={(e) => handleItemClick('weibo', 'https://s.weibo.com/', '微博搜索', false, e)}
        >
          <img src="/images/weibo.ico" alt="微博搜索" onError={handleImgError} />
          <a data="https://s.weibo.com/">微博搜索</a>
        </li>

        <li
          id="wechat"
          className={activeEngineId === 'wechat' ? 'active' : ''}
          onClick={(e) => handleItemClick('wechat', 'https://search.chongbuluo.com/weixin.html', '搜狗微信', false, e)}
        >
          <img src="/images/weixin.ico" alt="搜狗微信" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/weixin.html">搜狗微信</a>
        </li>

        <li
          id="zhihu"
          className={activeEngineId === 'zhihu' ? 'active' : ''}
          onClick={(e) => handleItemClick('zhihu', 'https://zhihu.sogou.com/', '搜狗知乎', false, e)}
        >
          <img src="/images/zhihu.ico" alt="搜狗知乎" onError={handleImgError} />
          <a data="https://zhihu.sogou.com/">搜狗知乎</a>
        </li>

        <li
          id="douban"
          className={activeEngineId === 'douban' ? 'active' : ''}
          onClick={(e) => handleItemClick('douban', 'https://search.chongbuluo.com/douban.html', '豆瓣搜索', false, e)}
        >
          <img src="/images/douban.ico" alt="豆瓣搜索" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/douban.html">豆瓣搜索</a>
        </li>

        <li
          id="music"
          className={activeEngineId === 'music' ? 'active' : ''}
          onClick={(e) => handleItemClick('music', 'https://search.chongbuluo.com/music.html', '音乐', false, e)}
        >
          <img src="/images/music.png" alt="音乐" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/music.html">音乐</a>
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
              <img src="/images/map.ico" alt="Map" onError={handleImgError} />
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
                <img src="/images/amap.jpg" alt="高德地图" onError={handleImgError} />
                <a data="https://ditu.amap.com/">高德地图</a>
              </li>
              <li
                id="baidumap"
                onClick={(e) => handleItemClick('baidumap', 'https://map.baidu.com/', '百度地图', false, e)}
              >
                <img src="/images/baidu.ico" alt="百度地图" onError={handleImgError} />
                <a data="https://map.baidu.com/">百度地图</a>
              </li>
              <li
                id="googlemap"
                onClick={(e) => handleItemClick('googlemap', 'https://www.google.com/maps/', '谷歌地图', true, e)}
              >
                <img src="/images/googlemap.ico" alt="谷歌地图" onError={handleImgError} />
                <a data="https://www.google.com/maps/" target="_blank" rel="noreferrer">
                  谷歌地图
                </a>
              </li>
              <li
                id="tencentmap"
                onClick={(e) => handleItemClick('tencentmap', 'https://map.qq.com/', '腾讯地图', false, e)}
              >
                <img src="/images/tencentmap.ico" alt="腾讯地图" onError={handleImgError} />
                <a data="https://map.qq.com/">腾讯地图</a>
              </li>
              <li
                id="sogoumap"
                onClick={(e) => handleItemClick('sogoumap', 'https://map.sogou.com', '搜狗地图', false, e)}
              >
                <img src="/images/sogou.ico" alt="搜狗地图" onError={handleImgError} />
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
          <img src="https://pan.funletu.com/favicon.svg" alt="趣盘搜" onError={handleImgError} />
          <a data="https://pan.funletu.com/">趣盘搜</a>
        </li>

        <li
          id="hunhepan"
          onClick={(e) => handleItemClick('hunhepan', 'https://pan.club/', '网盘俱乐部', false, e)}
        >
          <img src="https://hunhepan.com/favicon-32x32.png" alt="网盘俱乐部" onError={handleImgError} />
          <a data="https://pan.club/">网盘俱乐部</a>
        </li>

        <li
          id="cupfox"
          onClick={(e) => handleItemClick('cupfox', 'https://ssgo.app/', '云盘搜索', false, e)}
        >
          <img src="/images/cupfox.png" alt="云盘搜索" onError={handleImgError} />
          <a data="https://ssgo.app/">云盘搜索</a>
        </li>

        <li
          id="jiumodiary"
          onClick={(e) => handleItemClick('jiumodiary', 'https://www.jiumodiary.com/', '电子书', false, e)}
        >
          <img src="/images/jiumodiary.png" alt="电子书" onError={handleImgError} />
          <a data="https://www.jiumodiary.com/">电子书</a>
        </li>

        <li
          id="soman"
          onClick={(e) => handleItemClick('soman', 'https://ai.animedb.cn/', '以图识番', false, e)}
        >
          <img src="/images/soman.ico" alt="以图识番" onError={handleImgError} />
          <a data="https://ai.animedb.cn/">以图识番</a>
        </li>

        <li
          id="future"
          onClick={(e) => handleItemClick('future', 'https://bks.thefuture.top/', 'TheFuture', false, e)}
        >
          <img src="/images/future.ico" alt="TheFuture" onError={handleImgError} />
          <a data="https://bks.thefuture.top/">TheFuture</a>
        </li>

        <li
          id="capub"
          onClick={(e) => handleItemClick('capub', 'https://pdc.capub.cn/', '出版物数据', true, e)}
        >
          <img src="/images/capub.ico" alt="出版物数据" onError={handleImgError} />
          <a data="https://pdc.capub.cn/" target="_blank" rel="noreferrer">
            出版物数据
          </a>
        </li>

        <li
          id="shidianguji"
          onClick={(e) => handleItemClick('shidianguji', 'https://www.shidianguji.com/', '识典古籍', false, e)}
        >
          <img src="/images/shidianguji.svg" alt="识典古籍" onError={handleImgError} />
          <a data="https://www.shidianguji.com/">识典古籍</a>
        </li>

        <li
          id="zdic"
          onClick={(e) => handleItemClick('zdic', 'https://www.zdic.net/', '汉典', false, e)}
        >
          <img src="/images/zdic.ico" alt="汉典" onError={handleImgError} />
          <a data="https://www.zdic.net/">汉典</a>
        </li>

        <li
          id="iptv"
          onClick={(e) => handleItemClick('iptv', 'https://iptv-org.github.io/', 'IPTV 直播源', false, e)}
        >
          <img src="/images/IPTV.png" alt="IPTV 直播源" onError={handleImgError} />
          <a data="https://iptv-org.github.io/">IPTV 直播源</a>
        </li>

        <li
          id="law"
          onClick={(e) => handleItemClick('law', 'https://search.chongbuluo.com/law.html', '法律法规', false, e)}
        >
          <img src="/images/law.ico" alt="法律法规" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/law.html">法律法规</a>
        </li>

        <li
          id="qichacha"
          onClick={(e) => handleItemClick('qichacha', 'https://www.tianyancha.com/', '查企业', false, e)}
        >
          <img src="/images/qichacha.png" alt="查企业" onError={handleImgError} />
          <a data="https://www.tianyancha.com/">查企业</a>
        </li>

        <li
          id="similarsites"
          onClick={(e) => handleItemClick('similarsites', 'https://cn.similarsites.com/', 'SimilarSites', false, e)}
        >
          <img src="/images/similarsites.png" alt="SimilarSites" onError={handleImgError} />
          <a data="https://cn.similarsites.com/">SimilarSites</a>
        </li>

        <li
          id="github"
          className={activeEngineId === 'github' ? 'active' : ''}
          onClick={(e) => handleItemClick('github', 'https://search.chongbuluo.com/github.html', 'GitHub', false, e)}
        >
          <img src="/images/github.ico" alt="GitHub" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/github.html">GitHub</a>
        </li>

        <li
          id="open"
          onClick={(e) => handleItemClick('open', 'https://www.openhub.net/', '开源代码', false, e)}
        >
          <img src="/images/kaiyuan.ico" alt="开源代码" onError={handleImgError} />
          <a data="https://www.openhub.net/">开源代码</a>
        </li>

        <li
          id="wolf"
          onClick={(e) => handleItemClick('wolf', 'https://www.wolframalpha.com/', 'Wolfram Alpha', false, e)}
        >
          <img src="/images/wolframalpha.ico" alt="Wolfram Alpha" onError={handleImgError} />
          <a data="https://www.wolframalpha.com/">Wolfram Alpha</a>
        </li>

        <li
          id="index"
          onClick={(e) => handleItemClick('index', 'https://search.chongbuluo.com/index-search/index.html', '索引搜索', false, e)}
        >
          <img src="/images/google.ico" alt="索引搜索" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/index-search/index.html">索引搜索</a>
        </li>

        <li
          id="kuaidi"
          onClick={(e) => handleItemClick('kuaidi', 'https://www.kuaidi100.com/', '快递', false, e)}
        >
          <img src="/images/kuaidi.ico" alt="快递" onError={handleImgError} />
          <a data="https://www.kuaidi100.com/">快递</a>
        </li>

        <li
          id="gepu"
          onClick={(e) => handleItemClick('gepu', 'https://www.zhaogepu.com/', '找歌谱', false, e)}
        >
          <img src="/images/zhaogepu.ico" alt="找歌谱" onError={handleImgError} />
          <a data="https://www.zhaogepu.com/">找歌谱</a>
        </li>

        <li
          id="bilibili"
          className={activeEngineId === 'bilibili' ? 'active' : ''}
          onClick={(e) => handleItemClick('bilibili', 'https://search.chongbuluo.com/bilibili.html', '哔哩哔哩', false, e)}
        >
          <img src="/images/bilibili.ico" alt="哔哩哔哩" onError={handleImgError} />
          <a data="https://search.chongbuluo.com/bilibili.html">哔哩哔哩</a>
        </li>

        <li
          id="emoji"
          onClick={(e) => handleItemClick('emoji', 'https://searchemoji.app/zh-hans', 'SearchEmoji', false, e)}
        >
          <img src="/images/searchemoji.png" alt="SearchEmoji" onError={handleImgError} />
          <a data="https://searchemoji.app/zh-hans">SearchEmoji</a>
        </li>

        <li
          id="vectorlogo"
          onClick={(e) => handleItemClick('vectorlogo', 'https://worldvectorlogo.com/', '矢量 logo', false, e)}
        >
          <img src="/images/vectorlogo.ico" alt="矢量 logo" onError={handleImgError} />
          <a data="https://worldvectorlogo.com/">矢量 logo</a>
        </li>

        <li
          id="font"
          onClick={(e) => handleItemClick('font', 'https://www.likefont.com/', '字体识别', false, e)}
        >
          <img src="/images/qiuziti.ico" alt="字体识别" onError={handleImgError} />
          <a data="https://www.likefont.com/">字体识别</a>
        </li>

        <li
          id="visualhunt"
          onClick={(e) => handleItemClick('visualhunt', 'https://visualhunt.com/', 'Visual Hunt', false, e)}
        >
          <img src="/images/visualhunt.ico" alt="Visual Hunt" onError={handleImgError} />
          <a data="https://visualhunt.com/">Visual Hunt</a>
        </li>

        <li
          id="mba"
          onClick={(e) => handleItemClick('mba', 'https://www.mbalib.com/', 'MBA智库', false, e)}
        >
          <img src="/images/mbalib.ico" alt="MBA智库" onError={handleImgError} />
          <a data="https://www.mbalib.com/">MBA智库</a>
        </li>

        <li
          id="makedie"
          onClick={(e) => handleItemClick('makedie', 'https://secure.assrt.net/', '字幕反向搜索', false, e)}
        >
          <img src="/images/zimu.ico" alt="字幕反向搜索" onError={handleImgError} />
          <a data="https://secure.assrt.net/">字幕反向搜索</a>
        </li>

        <li
          id="plantplus"
          onClick={(e) => handleItemClick('plantplus', 'https://www.plantplus.cn/', '植物物种', false, e)}
        >
          <img src="https://www.plantplus.cn/cn/images/favicon.ico" alt="植物物种" onError={handleImgError} />
          <a data="https://www.plantplus.cn/">植物物种</a>
        </li>

        <li
          id="innojoy"
          onClick={(e) => handleItemClick('innojoy', 'https://www.innojoy.com/search/index.shtml', '专利检索', false, e)}
        >
          <img src="/images/patMain.ico" alt="专利检索" onError={handleImgError} />
          <a data="https://www.innojoy.com/search/index.shtml">专利检索</a>
        </li>
      </ul>
    </div>
  );
};
