import React from 'react';
import { SearchEngine } from '../types';
import { Star, Sparkles, Check, Bookmark } from 'lucide-react';

interface EngineTabsProps {
  categoryEngines: SearchEngine[];
  favoriteEngines: SearchEngine[];
  activeEngine: SearchEngine;
  onSelectEngine: (engine: SearchEngine) => void;
  onToggleFavorite: (engineId: string) => void;
}

export const EngineTabs: React.FC<EngineTabsProps> = ({
  categoryEngines,
  favoriteEngines,
  activeEngine,
  onSelectEngine,
  onToggleFavorite,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Favorites Pinned Row */}
      {favoriteEngines.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-xl border border-amber-200/60 dark:border-amber-900/50">
            <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>常用收藏:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {favoriteEngines.map((engine) => {
              const isSelected = activeEngine.id === engine.id;
              return (
                <button
                  key={`fav-${engine.id}`}
                  onClick={() => onSelectEngine(engine)}
                  className={`group relative px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 font-semibold'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: engine.color || '#3b82f6' }}
                  />
                  <span>{engine.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Category Engine Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoryEngines.map((engine) => {
          const isSelected = activeEngine.id === engine.id;
          const isFav = favoriteEngines.some((fav) => fav.id === engine.id);

          return (
            <div
              key={engine.id}
              className={`group relative flex items-center rounded-xl text-xs font-medium transition-all shrink-0 border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 font-semibold'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <button
                onClick={() => onSelectEngine(engine)}
                className="px-3.5 py-2 flex items-center gap-2"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: engine.color || '#3b82f6' }}
                />
                <span>{engine.name}</span>
                {engine.isPopular && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="热门引擎" />
                )}
                {isSelected && <Check className="w-3.5 h-3.5 ml-0.5 text-white" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(engine.id);
                }}
                className={`pr-2.5 py-2 text-slate-400 hover:text-amber-500 transition-colors ${
                  isFav ? 'text-amber-400' : 'opacity-0 group-hover:opacity-100'
                }`}
                title={isFav ? '取消收藏' : '收藏此引擎'}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isFav ? 'fill-amber-400 text-amber-400' : 'hover:fill-amber-400'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
