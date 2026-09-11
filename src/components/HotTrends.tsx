import React, { useState, useEffect } from 'react';
import { HotTrendCategory, HotTrendItem } from '../types';
import { Flame, TrendingUp, HelpCircle, Tv, Zap, RefreshCw, ExternalLink } from 'lucide-react';

interface HotTrendsProps {
  onSelectTrend: (title: string) => void;
}

export const HotTrends: React.FC<HotTrendsProps> = ({ onSelectTrend }) => {
  const [trendCategories, setTrendCategories] = useState<HotTrendCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>('baidu');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hot-trends');
      if (res.ok) {
        const data = await res.json();
        setTrendCategories(data);
      }
    } catch (err) {
      console.error('Failed to load hot trends', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const activeCategory = trendCategories.find((cat) => cat.id === activeTab) || trendCategories[0];

  const getTabIcon = (id: string) => {
    switch (id) {
      case 'baidu':
        return <Flame className="w-3.5 h-3.5 text-rose-500" />;
      case 'weibo':
        return <TrendingUp className="w-3.5 h-3.5 text-amber-500" />;
      case 'zhihu':
        return <HelpCircle className="w-3.5 h-3.5 text-blue-500" />;
      case 'bilibili':
        return <Tv className="w-3.5 h-3.5 text-sky-500" />;
      case 'kr36':
        return <Zap className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Flame className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm space-y-4">
      {/* Header & Tabs Row */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 dark:bg-rose-950/50 rounded-lg text-rose-600 dark:text-rose-400">
            <Flame className="w-4 h-4 fill-rose-500" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">全网实时热搜榜</h3>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {trendCategories.map((cat) => {
            const isTabActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                  isTabActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {getTabIcon(cat.id)}
                <span>{cat.name}</span>
              </button>
            );
          })}

          <button
            onClick={fetchTrends}
            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            title="刷新热搜榜"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hot Items Grid */}
      {activeCategory && activeCategory.items ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {activeCategory.items.map((item) => {
            const isTop3 = item.rank <= 3;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTrend(item.title)}
                className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60"
              >
                {/* Rank Badge */}
                <span
                  className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${
                    item.rank === 1
                      ? 'bg-rose-500 text-white shadow-xs'
                      : item.rank === 2
                      ? 'bg-orange-500 text-white shadow-xs'
                      : item.rank === 3
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.rank}
                </span>

                {/* Title & Hot Score */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {item.title}
                  </p>
                  {item.hotScore && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 inline-block">
                      {item.hotScore}
                    </span>
                  )}
                </div>

                <ExternalLink className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-slate-400">正在加载热搜数据...</div>
      )}
    </div>
  );
};
