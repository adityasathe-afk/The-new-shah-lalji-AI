import React from 'react';
import {
  Menu,
  Plus,
  Download,
  Info,
  Sun,
  Moon,
  Sparkles,
  GraduationCap,
  Code2,
  Calculator,
  PenTool,
} from 'lucide-react';
import { AssistantMode } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onExportChat: () => void;
  onOpenAbout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeMode: AssistantMode;
  onSelectMode: (mode: AssistantMode) => void;
  hasMessages: boolean;
}

export const MODES: Array<{
  id: AssistantMode;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  {
    id: 'general',
    name: 'General',
    badge: 'All-Round',
    icon: Sparkles,
    description: 'Smart, friendly Q&A, research, and general assistance',
  },
  {
    id: 'tutor',
    name: 'School Tutor',
    badge: 'Step-by-Step',
    icon: GraduationCap,
    description: 'Homework and concept learning with guided reasoning',
  },
  {
    id: 'coder',
    name: 'Code Assistant',
    badge: 'Clean Code',
    icon: Code2,
    description: 'Software engineering, debugging, and code explanations',
  },
  {
    id: 'math',
    name: 'Math & Science',
    badge: 'Formulas & Lab',
    icon: Calculator,
    description: 'Detailed calculations, STEM problems, and derivations',
  },
  {
    id: 'creative',
    name: 'Creative Writing',
    badge: 'Draft & Polish',
    icon: PenTool,
    description: 'Essays, stories, summaries, and creative brainstorming',
  },
];

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onNewChat,
  onExportChat,
  onOpenAbout,
  isDarkMode,
  onToggleDarkMode,
  activeMode,
  onSelectMode,
  hasMessages,
}) => {
  const currentMode = MODES.find((m) => m.id === activeMode) || MODES[0];
  const ModeIcon = currentMode.icon;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-3.5 py-2.5 sm:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Toggle chat history sidebar"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <span className="font-bold text-sm tracking-tight">SL</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                Shah Lalji AI
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                Official
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
              Smart • Friendly • Step-by-Step
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mode Selector Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
            title="Switch assistant focus mode"
          >
            <ModeIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden md:inline">{currentMode.name}</span>
            <span className="md:hidden">{currentMode.badge}</span>
          </button>

          <div className="absolute right-0 mt-1 w-64 p-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 hidden group-hover:block hover:block z-30">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Focus Modes
            </div>
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = mode.id === activeMode;
              return (
                <button
                  key={mode.id}
                  onClick={() => onSelectMode(mode.id)}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <div className="font-medium flex items-center gap-1.5">
                      {mode.name}
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({mode.badge})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {mode.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* New Chat Quick Button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Start fresh conversation"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </button>

        {/* Export Chat Button */}
        {hasMessages && (
          <button
            onClick={onExportChat}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Export conversation as Markdown"
            aria-label="Export chat"
          >
            <Download className="w-4 h-4" />
          </button>
        )}

        {/* About Info Button */}
        <button
          onClick={onOpenAbout}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="About Shah Lalji AI"
          aria-label="About Shah Lalji AI"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
