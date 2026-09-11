import React from 'react';
import { SUB_SITES } from '../data/searchEngines';
import { SearchMode } from '../types';
import { 
  PlusCircle, 
  History, 
  Moon, 
  Sun, 
  ExternalLink, 
  Layers, 
  Globe, 
  Sparkles,
  PanelLeft,
  PanelLeftClose
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  searchMode: SearchMode;
  setSearchMode: (mode: SearchMode) => void;
  onOpenCustomModal: () => void;
  onOpenHistoryDrawer?: () => void;
  onOpenHistory?: () => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (val: boolean | ((prev: boolean) => boolean)) => void;
  favoritesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  searchMode,
  setSearchMode,
  onOpenCustomModal,
  onOpenHistoryDrawer,
  onOpenHistory,
  sidebarOpen = true,
  setSidebarOpen = (_val?: React.SetStateAction<boolean>) => {},
  favoritesCount = 0,
}) => {
  const handleOpenHistory = onOpenHistoryDrawer || onOpenHistory || (() => {});
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 flex-nowrap">
        {/* Left Logo Section */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className={`p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0 ${
              sidebarOpen
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label="Toggle sidebar"
            title={sidebarOpen ? '收起侧栏导航' : '展开侧栏导航'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5 shrink-0" /> : <PanelLeft className="w-5 h-5 shrink-0" />}
            <span className="hidden sm:inline font-semibold whitespace-nowrap">
              {sidebarOpen ? '收起侧栏' : '快搜侧栏'}
            </span>
          </button>

          {/* First <a>: Two lines of text (Title + Slogan) */}
          <a href="./" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              {/* Line 1 */}
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent whitespace-nowrap">
                  极光
                </span>
                <span className="px-1.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-md tracking-wider whitespace-nowrap">
                  快搜
                </span>
              </div>
              {/* Line 2 */}
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block whitespace-nowrap leading-tight">
                聚合搜索 · 快人一步
              </span>
            </div>
          </a>

          {/* Sub-sites navigation: other <a> tags strictly on ONE line */}
          <nav className="hidden lg:flex items-center gap-1 ml-6 border-l border-slate-200 dark:border-slate-800 pl-4">
            {SUB_SITES.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target={site.isExternal ? '_blank' : '_self'}
                rel={site.isExternal ? 'noopener noreferrer' : undefined}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 leading-none ${
                  site.active
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="whitespace-nowrap leading-none">{site.name}</span>
                {site.isExternal && <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Opening Mode Toggle */}
          <div className="hidden sm:flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs shrink-0">
            <button
              onClick={() => setSearchMode('new_tab')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                searchMode === 'new_tab'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="在新标签页中直接打开搜索结果"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">新标签页</span>
            </button>
            <button
              onClick={() => setSearchMode('iframe')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                searchMode === 'iframe'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="在页面底部直接嵌框架预览搜索"
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">内置预览</span>
            </button>
          </div>

          {/* Add Custom Engine Button */}
          <button
            onClick={onOpenCustomModal}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="自定义搜索引擎"
          >
            <PlusCircle className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">自定义引擎</span>
          </button>

          {/* History Drawer Button */}
          <button
            onClick={handleOpenHistory}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition flex items-center gap-1.5 relative whitespace-nowrap shrink-0"
            title="搜索历史与收藏"
          >
            <History className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">历史与收藏</span>
            {favoritesCount > 0 && (
              <span className="w-4 h-4 text-[10px] bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            aria-label="Toggle Theme"
            title={darkMode ? '切换为浅色模式' : '切换为深色模式'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
