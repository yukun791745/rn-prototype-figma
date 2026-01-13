import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  tabs: NavTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function BottomNav({ tabs, activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/70 border-t border-slate-200/60 max-w-md mx-auto backdrop-blur-md">
      <div className="grid h-16" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-200 relative ${
                isActive ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {/* Active indicator - minimal underline */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full" />
              )}

              {/* Icon and label */}
              <Icon
                className={`w-4.5 h-4.5 transition-all ${
                  isActive ? 'stroke-[2]' : 'stroke-[1.5]'
                }`}
              />
              <span
                className={`text-[9px] transition-all ${
                  isActive ? 'font-semibold' : 'font-normal'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}