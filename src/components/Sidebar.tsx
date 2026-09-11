import React, { useState } from 'react';
import { CATEGORIES } from '../data/searchEngines';
import { LeftNav } from './LeftNav';
import { SearchEngine } from '../types';
import {
  Search,
  BookOpen,
  MessageSquare,
  Film,
  Image as ImageIcon,
  GraduationCap,
  Code,
  HardDrive,
  ShoppingBag,
  Newspaper,
  Bot,
  Flame,
  ChevronRight,
  Layers,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  activeCategory: string;
  setActiveCategory: (catId: string) => void;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
  engineCounts: Record<string, number>;
  activeEngine: SearchEngine;
  allEngines?: SearchEngine[];
  onSelectEngine?: (engine: SearchEngine) => void;
  onSelectEngineById: (engineId: string, fallbackUrl?: string) => void;
  onSearchWithUrl: (targetUrl: string, engineName: string, isBlank?: boolean) => void;
  currentQuery: string;
}

const getCategoryIcon = (iconName: string, className: string = 'w-4 h-4') => {
  switch (iconName) {
    case 'Search':
      return <Search className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'MessageSquare':
      return <MessageSquare className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'Image':
      return <ImageIcon className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Code':
      return <Code className={className} />;
    case 'HardDrive':
      return <HardDrive className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Newspaper':
      return <Newspaper className={className} />;
    case 'Bot':
      return <Bot className={className} />;
    default:
      return <Search className={className} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  setActiveCategory,
  sidebarOpen = true,
  setSidebarOpen = (_val?: React.SetStateAction<boolean>) => {},
  engineCounts,
  activeEngine,
  allEngines,
  onSelectEngine,
  onSelectEngineById,
  onSearchWithUrl,
  currentQuery,
}) => {
  const [navMode, setNavMode] = useState<'leftnav' | 'categories'>('leftnav');

  if (!sidebarOpen) {
    return null;
  }

  const handleItemClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className="fixed inset-y-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 shrink-0 md:relative md:top-0 md:h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-200 ease-in-out overflow-y-auto shadow-xl md:shadow-none"
      >
        <div className="p-3 pb-24 space-y-3">
          {/* Top Collapse Row */}
          <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>快速导航侧栏</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
              title="收起侧栏"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          </div>

          {/* Navigation View Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setNavMode('leftnav')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                navMode === 'leftnav'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>快搜导航</span>
            </button>
            <button
              onClick={() => setNavMode('categories')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
                navMode === 'categories'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>领域分类</span>
            </button>
          </div>

          {navMode === 'leftnav' ? (
            /* Classic Left Navigation with ul#foo.chongbuluo */
            <LeftNav
              activeEngineId={activeEngine.id}
              onSelectEngineById={(id, fallbackUrl) => {
                onSelectEngineById(id, fallbackUrl);
                handleItemClick();
              }}
              onSearchWithUrl={(url, name, isBlank) => {
                onSearchWithUrl(url, name, isBlank);
                handleItemClick();
              }}
              currentQuery={currentQuery}
            />
          ) : (
            /* Categorical Navigation */
            <div>
              <div className="px-3 mb-2 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <span>搜索分类导航</span>
                <Flame className="w-3.5 h-3.5 text-amber-500" />
              </div>

              <nav className="space-y-1.5">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const count = engineCounts[cat.id] || 0;
                  const catEngines = (allEngines || []).filter((e) => e.category === cat.id);

                  return (
                    <React.Fragment key={cat.id}>
                      <button
                        key={cat.id}
                        onClick={(e) => {
                          setActiveCategory(cat.id);
                          if (activeCategory !== cat.id && catEngines.length > 0 && onSelectEngine) {
                            onSelectEngine(catEngines[0]);
                          }
                          handleItemClick();
                          const btn = e.currentTarget;
                          setTimeout(() => {
                            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                          }, 80);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`p-1.5 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {getCategoryIcon(cat.icon, 'w-3.5 h-3.5')}
                          </span>
                          <span className="whitespace-nowrap">{cat.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {count}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isActive ? 'text-white rotate-90' : 'text-slate-400 opacity-60'
                            }`}
                          />
                        </div>
                      </button>

                      {/* Sublist of all websites under this category: completely displayed, no clipping */}
                      {isActive && catEngines.length > 0 && (
                        <div className="my-1.5 p-2 bg-slate-50/90 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/70 space-y-1.5">
                          <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <span>收录网站</span>
                              <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1 py-0.5 rounded">
                                全部 {catEngines.length} 个
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-400">点击切换</span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 max-h-none overflow-visible pr-0.5">
                            {catEngines.map((eng) => {
                              const isSelected = activeEngine.id === eng.id;
                              return (
                                <button
                                  key={eng.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onSelectEngine) {
                                      onSelectEngine(eng);
                                    } else {
                                      onSelectEngineById(eng.id, eng.url);
                                    }
                                    handleItemClick();
                                  }}
                                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition text-left cursor-pointer border ${
                                    isSelected
                                      ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/70 dark:border-slate-700/70 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-300'
                                  }`}
                                  title={`${eng.name}${eng.description ? ` - ${eng.description}` : ''}`}
                                >
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0"
                                    style={{ backgroundColor: eng.color || '#3b82f6' }}
                                  />
                                  <span className="truncate flex-1 text-[11px] font-medium leading-tight">
                                    {eng.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Quick Tips Box */}
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
              <span>💡 快捷操作指南</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <li>• 输入关键词后点击左侧任意搜索引擎直接检索</li>
              <li>• 按 <kbd className="px-1 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-mono">/</kbd> 快速聚焦搜索框</li>
              <li>• 支持切换新标签页或内嵌全屏预览</li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};

