import React, { useState } from 'react';
import { Bot, Sparkles, ExternalLink, Copy, Check, RefreshCw, Layers } from 'lucide-react';

interface AISearchResultProps {
  query: string;
  answer: string;
  sources: { title: string; url: string }[];
  loading: boolean;
  onRequery: () => void;
}

export const AISearchResult: React.FC<AISearchResultProps> = ({
  query,
  answer,
  sources,
  loading,
  onRequery,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 shadow-lg p-5 sm:p-6 space-y-5 transition-all mt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/50 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">极光 AI 智搜</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Gemini 智能驱动
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">正在针对 “{query}” 进行深度总结回答</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition"
            title="复制 AI 回答内容"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={onRequery}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition"
            title="重新生成"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Answer Body */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium animate-pulse">极光 AI 正在检索与归纳全网资料，请稍候...</p>
        </div>
      ) : (
        <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-3 whitespace-pre-wrap font-sans">
          {answer}
        </div>
      )}

      {/* Source Search Shortcuts */}
      {sources && sources.length > 0 && !loading && (
        <div className="pt-3 border-t border-indigo-100 dark:border-indigo-900/40 space-y-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-violet-500" /> 推荐扩展检索原源:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow-xs"
              >
                <span>{src.title}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
