import React, { useState, useEffect } from 'react';
import { CATEGORIES, DEFAULT_SEARCH_ENGINES } from './data/searchEngines';
import { SearchEngine, SearchHistoryItem, SearchMode } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HotTrends } from './components/HotTrends';
import { AISearchResult } from './components/AISearchResult';
import { CustomEngineModal } from './components/CustomEngineModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import {
  Sparkles,
  Compass,
  Search,
  PanelLeft,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Flame,
  X,
  ChevronDown,
} from 'lucide-react';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cb_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode class to html document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cb_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Category & Engines State
  const [activeCategory, setActiveCategory] = useState<string>('search');
  const [showAllEnginesPopover, setShowAllEnginesPopover] = useState<boolean>(false);

  // Custom Engines
  const [customEngines, setCustomEngines] = useState<SearchEngine[]>(() => {
    const saved = localStorage.getItem('cb_custom_engines');
    return saved ? JSON.parse(saved) : [];
  });

  const allEngines = [...DEFAULT_SEARCH_ENGINES, ...customEngines];

  // Favorite Engines
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cb_favorites');
    return saved ? JSON.parse(saved) : ['baidu', 'google', 'zhihu', 'bilibili', 'github', 'gemini_ai'];
  });

  useEffect(() => {
    localStorage.setItem('cb_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Active Engine
  const categoryEngines = allEngines.filter((e) => e.category === activeCategory);
  const currentCat = CATEGORIES.find((c) => c.id === activeCategory);
  const [activeEngine, setActiveEngine] = useState<SearchEngine>(() => {
    return categoryEngines[0] || DEFAULT_SEARCH_ENGINES[0];
  });

  // When active category changes, update active engine if needed
  useEffect(() => {
    const currentCatEngines = allEngines.filter((e) => e.category === activeCategory);
    if (currentCatEngines.length > 0) {
      setActiveEngine(currentCatEngines[0]);
    }
  }, [activeCategory]);

  // Search Mode (new_tab or iframe)
  const [searchMode, setSearchMode] = useState<SearchMode>(() => {
    const saved = localStorage.getItem('cb_search_mode');
    return (saved as SearchMode) || 'iframe';
  });

  useEffect(() => {
    localStorage.setItem('cb_search_mode', searchMode);
  }, [searchMode]);

  // Query & History
  const [query, setQuery] = useState<string>('');
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    const saved = localStorage.getItem('cb_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cb_history', JSON.stringify(history));
  }, [history]);

  // Previews / Results - default opens Google embedded on the right
  const [iframeState, setIframeState] = useState<{
    engine: SearchEngine;
    query: string;
    url: string;
  } | null>(() => ({
    engine: DEFAULT_SEARCH_ENGINES[1] || DEFAULT_SEARCH_ENGINES[0],
    query: '',
    url: '/iGoogle.html',
  }));

  const [iframeKey, setIframeKey] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const [aiResult, setAiResult] = useState<{
    query: string;
    answer: string;
    sources: { title: string; url: string }[];
    loading: boolean;
  } | null>(null);

  // Modals & Drawers
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isTrendsDrawerOpen, setIsTrendsDrawerOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('cb_sidebar_open');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('cb_sidebar_open', String(sidebarOpen));
  }, [sidebarOpen]);

  // Handlers
  const handleToggleFavorite = (engineId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(engineId) ? prev.filter((id) => id !== engineId) : [...prev, engineId]
    );
  };

  const handleAddCustomEngine = (newEngine: SearchEngine) => {
    const updated = [newEngine, ...customEngines];
    setCustomEngines(updated);
    localStorage.setItem('cb_custom_engines', JSON.stringify(updated));
    setActiveCategory(newEngine.category);
    setActiveEngine(newEngine);
  };

  const handleClearHistory = () => setHistory([]);

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const handleCopyUrl = async () => {
    if (iframeState?.url) {
      try {
        await navigator.clipboard.writeText(iframeState.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const executeAISearch = async (searchQuery: string) => {
    setIsAIDrawerOpen(true);
    setAiResult({ query: searchQuery, answer: '', sources: [], loading: true });

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: searchQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult({
          query: searchQuery,
          answer: data.answer,
          sources: data.sources || [],
          loading: false,
        });
      }
    } catch (err) {
      console.error('AI search failed', err);
      setAiResult({
        query: searchQuery,
        answer: '抱歉，AI 智能检索服务暂不可用，请稍后再试。',
        sources: [],
        loading: false,
      });
    }
  };

  const handleSearch = (searchQuery?: string, engine?: SearchEngine) => {
    const targetQuery = (searchQuery !== undefined ? searchQuery : query).trim();
    const targetEngine = engine || activeEngine;

    if (!targetQuery) {
      return;
    }

    // Add to history
    const newHistoryItem: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      query: targetQuery,
      engineId: targetEngine.id,
      engineName: targetEngine.name,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]);

    // Check if AI Search Engine
    if (targetEngine.id === 'gemini_ai' || targetEngine.url === 'internal:ai_gemini') {
      executeAISearch(targetQuery);
      return;
    }

    let targetUrl = targetEngine.url.replace('%s', encodeURIComponent(targetQuery));
    let externalUrl = targetUrl;

    if (targetEngine.id === 'chatgpt') {
      targetUrl = `/chatgpt.html?q=${encodeURIComponent(targetQuery)}`;
      externalUrl = `https://chatgpt.com/?q=${encodeURIComponent(targetQuery)}&hints=search`;
    } else if (targetEngine.id === 'google' && searchMode === 'embed') {
      // In embed mode, iGoogle provides clean search experience
      targetUrl = `/iGoogle.html?q=${encodeURIComponent(targetQuery)}`;
    }

    // Always display on the right in the embedded page viewport
    setIframeState({
      engine: targetEngine,
      query: targetQuery,
      url: targetUrl,
    });
    setIframeKey((prev) => prev + 1);

    if (searchMode === 'new_tab') {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSelectEngine = (engine: SearchEngine) => {
    setActiveEngine(engine);
    setActiveCategory(engine.category);

    let targetUrl = engine.url;
    if (query.trim() && targetUrl.includes('%s')) {
      targetUrl = targetUrl.replace('%s', encodeURIComponent(query.trim()));
    } else if (targetUrl.includes('%s')) {
      if (engine.id === 'google') targetUrl = '/iGoogle.html';
      else if (engine.id === 'baidu') targetUrl = '/diybaidu.html';
      else if (engine.id === 'chatgpt') targetUrl = '/chatgpt.html';
      else targetUrl = targetUrl.replace(/[\?&]?[a-zA-Z_]+=%s/, '').replace('%s', '');
    }

    setIframeState({
      engine,
      query: query.trim() || engine.name,
      url: targetUrl,
    });
    setIframeKey((prev) => prev + 1);
  };

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    const currentCatEngines = allEngines.filter((e) => e.category === catId);
    if (currentCatEngines.length > 0) {
      handleSelectEngine(currentCatEngines[0]);
    }
  };

  const handleReSearchFromHistory = (histQuery: string, engineId: string) => {
    const targetEngine = allEngines.find((e) => e.id === engineId) || activeEngine;
    setQuery(histQuery);
    setActiveEngine(targetEngine);
    setActiveCategory(targetEngine.category);
    handleSearch(histQuery, targetEngine);
  };

  const handleSelectEngineById = (engineId: string, fallbackUrl?: string) => {
    const idNormalized = engineId.toLowerCase();
    const found = allEngines.find(
      (e) => e.id.toLowerCase() === idNormalized || e.name.toLowerCase() === idNormalized
    );
    const targetEngine: SearchEngine =
      found ||
      (fallbackUrl
        ? {
            id: engineId,
            name: engineId,
            category: activeCategory,
            url: fallbackUrl.includes('%s')
              ? fallbackUrl
              : fallbackUrl.includes('?')
              ? `${fallbackUrl}&q=%s`
              : `${fallbackUrl}?q=%s`,
            description: '快速导航工具',
          }
        : {
            id: engineId,
            name: engineId,
            category: activeCategory,
            url: `https://www.google.com/search?q=%s`,
          });

    setActiveEngine(targetEngine);
    setActiveCategory(targetEngine.category);

    let targetUrl = fallbackUrl || targetEngine.url;
    if (query.trim() && targetUrl.includes('%s')) {
      targetUrl = targetUrl.replace('%s', encodeURIComponent(query.trim()));
    } else if (targetUrl.includes('%s')) {
      if (targetEngine.id === 'google') targetUrl = '/iGoogle.html';
      else if (targetEngine.id === 'baidu') targetUrl = '/diybaidu.html';
      else if (targetEngine.id === 'chatgpt') targetUrl = '/chatgpt.html';
      else targetUrl = targetUrl.replace(/[\?&]?[a-zA-Z_]+=%s/, '').replace('%s', '');
    }

    setIframeState({
      engine: targetEngine,
      query: query.trim() || targetEngine.name,
      url: targetUrl,
    });
    setIframeKey((prev) => prev + 1);
  };

  const handleSearchWithUrl = (targetUrl: string, engineName: string, _isBlank: boolean = false) => {
    if (query.trim()) {
      const newHistoryItem: SearchHistoryItem = {
        id: `${Date.now()}-${Math.random()}`,
        query: query.trim(),
        engineId: engineName,
        engineName: engineName,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]);
    }

    const targetEngine: SearchEngine =
      allEngines.find(
        (e) =>
          e.name.toLowerCase() === engineName.toLowerCase() ||
          e.id.toLowerCase() === engineName.toLowerCase()
      ) || {
        id: engineName.toLowerCase(),
        name: engineName,
        category: activeCategory,
        url: targetUrl,
      };

    setActiveEngine(targetEngine);
    setActiveCategory(targetEngine.category);

    // Immediately open in the right-side embedded area
    setIframeState({
      engine: targetEngine,
      query: query.trim() || targetEngine.name,
      url: targetUrl,
    });
    setIframeKey((prev) => prev + 1);
  };

  const favoriteEngines = allEngines.filter((e) => favoriteIds.includes(e.id));

  // Count engines per category for sidebar badges
  const engineCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = allEngines.filter((e) => e.category === cat.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors overflow-hidden">
      {/* Top Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        onOpenHistoryDrawer={() => setIsHistoryDrawerOpen(true)}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        favoritesCount={favoriteEngines.length}
      />

      {/* Main Viewport below header */}
      <div className="flex-1 w-full flex overflow-hidden">
        {/* Left Category & Navigation Sidebar */}
        <Sidebar
          activeCategory={activeCategory}
          setActiveCategory={handleSelectCategory}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          engineCounts={engineCounts}
          activeEngine={activeEngine}
          allEngines={allEngines}
          onSelectEngine={handleSelectEngine}
          onSelectEngineById={handleSelectEngineById}
          onSearchWithUrl={handleSearchWithUrl}
          currentQuery={query}
        />

        {/* Right Area: header栏以下及左侧分类栏右边整个页面 */}
        <main className="flex-1 min-w-0 h-full flex flex-col overflow-hidden bg-slate-100 dark:bg-slate-950">
          {/* Top Integrated Search & Engine Toolbar */}
          <div className="shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2.5 z-10 shadow-xs">
            {/* Left: Active Engine Tag & Quick Category Engine Switcher */}
            <div className="relative flex items-center gap-1.5 py-0.5 min-w-0 max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl shrink-0">
              {/* Expand Sidebar Button inside Toolbar when collapsed */}
              {!sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
                  title="展开快搜侧边栏导航"
                >
                  <PanelLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline whitespace-nowrap">展开侧栏</span>
                </button>
              )}

              {/* Active Engine Badge with Dropdown Trigger */}
              <button
                type="button"
                onClick={() => setShowAllEnginesPopover((prev) => !prev)}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200/80 dark:border-blue-800/80 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition cursor-pointer shrink-0 shadow-xs"
                title={`点击展开 ${currentCat?.name || '当前分类'} 下全部 ${categoryEngines.length} 个网站`}
              >
                <div
                  className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: activeEngine.color || '#3b82f6' }}
                />
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                  {activeEngine.name}
                </span>
                <span className="text-[10px] font-mono px-1 py-0.5 bg-blue-200/60 dark:bg-blue-800/60 text-blue-800 dark:text-blue-200 rounded-md font-bold whitespace-nowrap">
                  {categoryEngines.length}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 transition-transform ${
                    showAllEnginesPopover ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Quick pills for other engines in same category - full horizontal scroll with visible scrollbar */}
              <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-1.5 sm:pl-2 overflow-x-auto scrollbar-thin py-0.5">
                {categoryEngines.map((eng) => (
                  <button
                    key={eng.id}
                    type="button"
                    onClick={() => {
                      handleSelectEngine(eng);
                      setShowAllEnginesPopover(false);
                    }}
                    className={`px-2 py-0.5 text-xs rounded-md transition whitespace-nowrap cursor-pointer shrink-0 ${
                      activeEngine.id === eng.id
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={`${eng.name}${eng.description ? ` - ${eng.description}` : ''}`}
                  >
                    {eng.name}
                  </button>
                ))}
              </div>

              {/* Popover showing ALL engines under this category without any clipping */}
              {showAllEnginesPopover && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAllEnginesPopover(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 z-50 w-80 sm:w-96 max-w-[92vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span>{currentCat?.name || '分类'}收录网站</span>
                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded-full">
                          全部 {categoryEngines.length} 个
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAllEnginesPopover(false)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto pr-1">
                      {categoryEngines.map((eng) => {
                        const isSelected = activeEngine.id === eng.id;
                        return (
                          <button
                            key={eng.id}
                            type="button"
                            onClick={() => {
                              handleSelectEngine(eng);
                              setShowAllEnginesPopover(false);
                            }}
                            className={`flex flex-col items-start p-2 rounded-xl text-left transition border cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                                : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200'
                            }`}
                            title={eng.description || eng.name}
                          >
                            <div className="flex items-center gap-1.5 w-full">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: eng.color || '#3b82f6' }}
                              />
                              <span className="text-xs font-bold truncate flex-1">{eng.name}</span>
                            </div>
                            {eng.description && (
                              <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                                {eng.description}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Center: Integrated Instant Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch(query, activeEngine);
              }}
              className="flex-1 min-w-0 max-w-xl flex items-center gap-1 sm:gap-1.5"
            >
              <div className="relative flex-1 min-w-0 flex items-center">
                <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400 absolute left-2 sm:left-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`在 ${activeEngine.name} 中搜索...`}
                  className="w-full pl-7 sm:pl-8 pr-6 sm:pr-7 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 focus:bg-white dark:focus:bg-slate-900 border border-transparent focus:border-blue-500 rounded-lg outline-none transition text-slate-900 dark:text-white placeholder-slate-400"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-1.5 sm:right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-2.5 sm:px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-xs whitespace-nowrap cursor-pointer shrink-0"
              >
                搜索
              </button>
            </form>

            {/* Right: Actions (Refresh, Copy, New Tab, Trends Drawer, AI Search) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => setIframeKey((prev) => prev + 1)}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="刷新页面"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleCopyUrl}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title={copied ? '已复制网址' : '复制当前网址'}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <a
                href={iframeState?.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition hidden sm:inline-flex cursor-pointer"
                title="在新窗口打开"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setIsTrendsDrawerOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200/60 dark:border-amber-800/60 rounded-lg transition cursor-pointer"
                title="实时全网热搜"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">今日热搜</span>
              </button>

              <button
                onClick={() => {
                  if (query.trim()) {
                    executeAISearch(query.trim());
                  } else {
                    setIsAIDrawerOpen(true);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200/60 dark:border-purple-800/60 rounded-lg transition cursor-pointer"
                title="AI 智能答疑"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span className="hidden sm:inline">AI智搜</span>
              </button>
            </div>
          </div>

          {/* Embedded Page: takes 100% of remaining width and height */}
          <div className="flex-1 w-full h-full relative overflow-hidden bg-white dark:bg-slate-900">
            {iframeState ? (
              <iframe
                key={iframeKey}
                src={iframeState.url}
                title={iframeState.engine.name}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-modals allow-presentation"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3 animate-pulse" />
                <p className="text-sm font-medium">请在左侧点击任一引擎或分类，即可在右侧即时打开页面</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Hot Trends Slide-Over Drawer */}
      {isTrendsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsTrendsDrawerOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col h-full overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">实时全网热搜榜单</span>
              </div>
              <button
                onClick={() => setIsTrendsDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <HotTrends
                onSelectTrend={(trendTitle) => {
                  setQuery(trendTitle);
                  handleSearch(trendTitle);
                  setIsTrendsDrawerOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Search Result Drawer */}
      {isAIDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAIDrawerOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-10 flex flex-col h-full overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">AI 智能深度解答</span>
              </div>
              <button
                onClick={() => setIsAIDrawerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {aiResult ? (
                <AISearchResult
                  query={aiResult.query}
                  answer={aiResult.answer}
                  sources={aiResult.sources}
                  loading={aiResult.loading}
                  onRequery={() => executeAISearch(aiResult.query)}
                />
              ) : (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400 space-y-4">
                  <Sparkles className="w-10 h-10 text-purple-400 mx-auto" />
                  <p className="text-sm">在顶部搜索框输入问题或关键词，点击【AI智搜】即可获取 AI 归纳总结与参考信源</p>
                  {query && (
                    <button
                      onClick={() => executeAISearch(query)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      即刻解析："{query}"
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Engine Modal */}
      <CustomEngineModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddEngine={handleAddCustomEngine}
      />

      {/* History & Favorites Drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onReSearch={handleReSearchFromHistory}
        favoriteEngines={favoriteEngines}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}
