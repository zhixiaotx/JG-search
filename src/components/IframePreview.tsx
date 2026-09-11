import React, { useState } from 'react';
import { SearchEngine } from '../types';
import { ExternalLink, X, Copy, Check, ShieldAlert, RefreshCw, Maximize2, Minimize2 } from 'lucide-react';

interface IframePreviewProps {
  engine: SearchEngine;
  query: string;
  url: string;
  onClose: () => void;
}

export const IframePreview: React.FC<IframePreviewProps> = ({
  engine,
  query,
  url,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all ${
        isExpanded ? 'fixed inset-3 z-50 rounded-2xl flex flex-col' : 'mt-4'
      }`}
    >
      {/* Top Controls Header */}
      <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800/95 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white dark:ring-slate-700"
            style={{ backgroundColor: engine.color || '#3b82f6' }}
          />
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100 shrink-0">
              {engine.name}
            </span>
            {query && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate hidden sm:inline">
                搜索词: "{query}"
              </span>
            )}
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[200px] hidden md:inline">
              {url}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setKey((prev) => prev + 1)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            title="刷新页面"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            title={isExpanded ? '缩小窗口' : '全屏展示'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg transition flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? '已复制' : '复制网址'}</span>
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span>新窗口打开</span>
          </a>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            title="关闭视图"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Tip Notification Banner */}
      <div className="px-4 py-1.5 bg-amber-50/90 dark:bg-amber-950/30 border-b border-amber-200/50 dark:border-amber-900/30 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-[11px]">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>
            提示：若部分站点限制跨域嵌入显示空白，可直接点击右上角【新窗口打开】浏览。
          </span>
        </div>
      </div>

      {/* Iframe Viewport Container */}
      <div className={`relative w-full ${isExpanded ? 'flex-1 h-full' : 'h-[680px]'} bg-slate-50 dark:bg-slate-950`}>
        <iframe
          key={key}
          src={url}
          title={`Page view for ${engine.name}`}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
};
