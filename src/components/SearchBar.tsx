import React, { useState, useEffect, useRef } from 'react';
import { SearchEngine } from '../types';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft, Command } from 'lucide-react';

interface SearchBarProps {
  activeEngine: SearchEngine;
  query: string;
  setQuery: (q: string) => void;
  onSearch: (q?: string, engine?: SearchEngine) => void;
  allEngines: SearchEngine[];
  onSelectEngine: (engine: SearchEngine) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  activeEngine,
  query,
  setQuery,
  onSearch,
  allEngines,
  onSelectEngine,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut '/' to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch autocompletions on query change
  useEffect(() => {
    if (!query || !query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const engineType = activeEngine.id.includes('google') ? 'google' : 'baidu';
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(query.trim())}&engine=${engineType}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSuggestions(data);
            setShowSuggestions(data.length > 0);
            setSelectedIndex(-1);
          }
        }
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [query, activeEngine]);

  // Handle outside click to hide suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        onSearch();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const selected = suggestions[selectedIndex];
        setQuery(selected);
        setShowSuggestions(false);
        onSearch(selected);
      } else {
        onSearch();
        setShowSuggestions(false);
      }
    }
  };

  const quickEngines = allEngines
    .filter((e) => e.category === activeEngine.category)
    .slice(0, 8);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3" ref={containerRef}>
      {/* Main Search Form Container */}
      <div className="relative group">
        <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 border-2 border-blue-500/80 dark:border-blue-500/60 focus-within:border-blue-600 dark:focus-within:border-blue-400 transition-all p-1.5">
          {/* Active Engine Badge Indicator */}
          <div className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-slate-100 dark:bg-slate-700/60 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{ backgroundColor: activeEngine.color || '#3b82f6' }}
            />
            <span className="truncate max-w-[80px] sm:max-w-none">{activeEngine.name}</span>
          </div>

          {/* Input Box */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={`在 ${activeEngine.name} 中快捷搜索... (按 / 聚焦)`}
            className="w-full px-3 py-2 text-slate-900 dark:text-white bg-transparent outline-none text-base sm:text-lg font-medium placeholder-slate-400 dark:placeholder-slate-500"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
              className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
              title="清空关键词"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Search Button */}
          <button
            type="button"
            onClick={() => {
              onSearch();
              setShowSuggestions(false);
            }}
            className="px-5 py-2.5 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all active:scale-95 flex items-center gap-2 shrink-0"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">搜 索</span>
          </button>
        </div>

        {/* Autocomplete Suggestions Menu */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-2 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 px-3">
              <span>搜索联想建议 ({activeEngine.name})</span>
              <span className="flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" /> 回车确认
              </span>
            </div>

            <ul id="search-suggestions-list" className="py-1 max-h-72 overflow-y-auto divide-y divide-slate-100/50 dark:divide-slate-750">
              {suggestions.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery(item);
                        setShowSuggestions(false);
                        onSearch(item);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <Search className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`} />
                        <span className="truncate text-slate-800 dark:text-slate-100">{item}</span>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 shrink-0 opacity-0 ${isSelected ? 'opacity-100 text-blue-500' : ''}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Instant Switch Engine Row */}
      {query.trim() && (
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>一键无缝无刷新切搜索引擎:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {quickEngines.map((engine) => (
              <button
                key={`switch-${engine.id}`}
                onClick={() => {
                  onSelectEngine(engine);
                  onSearch(query, engine);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 border ${
                  activeEngine.id === engine.id
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: engine.color || '#3b82f6' }}
                />
                <span>{engine.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
