import React from 'react';
import { SearchHistoryItem, SearchEngine } from '../types';
import { X, Trash2, History, Star, Clock, Search, ArrowRight } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryItem[];
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
  onReSearch: (query: string, engineId: string) => void;
  favoriteEngines: SearchEngine[];
  onToggleFavorite: (engineId: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onDeleteHistoryItem,
  onReSearch,
  favoriteEngines,
  onToggleFavorite,
}) => {
  if (!isOpen) return null;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">搜索历史与常用收藏</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Favorite Engines Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                已收藏的搜索引擎 ({favoriteEngines.length})
              </h4>
            </div>

            {favoriteEngines.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {favoriteEngines.map((engine) => (
                  <div
                    key={`drawer-fav-${engine.id}`}
                    className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: engine.color || '#3b82f6' }}
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {engine.name}
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleFavorite(engine.id)}
                      className="p-1 text-amber-500 hover:text-rose-500 transition"
                      title="取消收藏"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2 italic">暂无收藏。可在引擎列表点击五角星图标快速收藏。</p>
            )}
          </div>

          {/* History List Section */}
          <div>
            <div className="flex items-center justify-between mb-3 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                近期搜索记录 ({history.length})
              </h4>

              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> 清空记录
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition"
                  >
                    <button
                      onClick={() => {
                        onReSearch(item.query, item.engineId);
                        onClose();
                      }}
                      className="flex-1 text-left min-w-0 pr-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-md shrink-0">
                          {item.engineName}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {item.query}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                        {formatTime(item.timestamp)}
                      </span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onReSearch(item.query, item.engineId);
                          onClose();
                        }}
                        className="p-1.5 text-slate-400 group-hover:text-blue-500 transition"
                        title="再次搜索"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteHistoryItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                        title="删除记录"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400 space-y-1">
                <Search className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 stroke-1" />
                <p>暂无搜索历史记录</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
