import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

interface DarkModeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = '', showLabels = false }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-inner gap-0.5 ${className}`}>
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          theme === 'light'
            ? 'bg-white text-sparkle-purple shadow-sm ring-1 ring-slate-200/50'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5 text-amber-500" />
        {showLabels && <span>Light</span>}
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          theme === 'dark'
            ? 'bg-[#0B0B18] text-cyan-400 shadow-sm border border-cyan-500/30'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="Midnight Navy Dark Mode"
      >
        <Moon className="w-3.5 h-3.5 text-indigo-400" />
        {showLabels && <span>Navy</span>}
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-900 text-sparkle-purple dark:text-cyan-400 shadow-sm ring-1 ring-slate-200/50'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
        title="System Preference"
      >
        <Monitor className="w-3.5 h-3.5 text-slate-400" />
        {showLabels && <span>System</span>}
      </button>
    </div>
  );
};
