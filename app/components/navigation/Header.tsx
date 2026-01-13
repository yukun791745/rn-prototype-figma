import { Settings } from 'lucide-react';

interface HeaderProps {
  date: string;
  title?: string;
  subtitle?: string;
  onSettingsClick?: () => void;
}

export function Header({ date, title, subtitle, onSettingsClick }: HeaderProps) {
  if (title) {
    // AI Coach Header with title and subtitle
    return (
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/40">
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-slate-500 text-xs">{date}</p>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-indigo-600">
            {title}
          </h1>
          <button
            onClick={onSettingsClick}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        {subtitle && (
          <div className="px-4 pb-2.5 text-[11px] text-slate-500 leading-relaxed">
            {subtitle}
          </div>
        )}
      </header>
    );
  }

  // Default Header
  return (
    <header className="sticky top-0 z-40 px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-200/40">
      <div className="flex items-center justify-between">
        <p className="text-slate-500 text-xs">{date}</p>
        <button
          onClick={onSettingsClick}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}