import React from 'react';
import {
  GraduationCap,
  Code2,
  Calculator,
  PenTool,
  Lightbulb,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Cpu,
} from 'lucide-react';
import { AssistantMode } from '../types';

interface WelcomeScreenProps {
  onSelectPrompt: (prompt: string, mode?: AssistantMode) => void;
}

interface PromptCard {
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  mode: AssistantMode;
  tagColor: string;
}

const STARTER_PROMPTS: PromptCard[] = [
  {
    title: 'Schoolwork & Homework',
    category: 'Step-by-step Tutor',
    icon: GraduationCap,
    prompt: 'Can you explain how photosynthesis works step by step? Please break it down so I can understand the concepts clearly.',
    mode: 'tutor',
    tagColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  {
    title: 'Mathematics & Science',
    category: 'Full Working & Proofs',
    icon: Calculator,
    prompt: 'Solve the quadratic equation: 2x² - 7x + 3 = 0. Show the full working and explain each step carefully.',
    mode: 'math',
    tagColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  {
    title: 'Coding & Programming',
    category: 'Clean Code & Debug',
    icon: Code2,
    prompt: 'Write a Python program to find whether a word or phrase is a palindrome. Include comments explaining how it works and test cases.',
    mode: 'coder',
    tagColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  {
    title: 'Writing & Rewriting',
    category: 'Essay & Structure',
    icon: PenTool,
    prompt: 'Help me draft an engaging opening paragraph and thesis statement for an essay about the impact of artificial intelligence in education.',
    mode: 'creative',
    tagColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  {
    title: 'Explaining Difficult Concepts',
    category: 'Clear & Intuitive',
    icon: Lightbulb,
    prompt: 'Explain what quantum entanglement is in simple terms, using an intuitive everyday analogy that a high school student can understand.',
    mode: 'general',
    tagColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  },
  {
    title: 'Science Project Ideas',
    category: 'Creative Brainstorming',
    icon: Cpu,
    prompt: 'Give me 5 unique, creative ideas for a high school science fair project in physics or environmental science.',
    mode: 'general',
    tagColor: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPrompt }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Hero Welcome Card */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-500/10 mb-2">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Hey! 👋 I'm Shah Lalji AI.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
            What can I help you with today?
          </p>
        </div>

        <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Your smart, friendly, and helpful companion for schoolwork, mathematics, coding, writing, difficult concepts, and creative brainstorming.
        </p>
      </div>

      {/* Suggested Starter Topics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            Explore Topics & Starters
          </span>
          <span className="text-[11px] text-slate-400">Click any card to start</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STARTER_PROMPTS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectPrompt(card.prompt, card.mode)}
                className="group p-4 text-left rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-600/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${card.tagColor}`}
                    >
                      <Icon className="w-3 h-3" />
                      {card.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {card.prompt}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust & Teaching Style badges */}
      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-2">
          <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            Step-by-Step Learning
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Reasoning is explained so you master the concepts
          </div>
        </div>
        <div className="p-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700/60">
          <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            Reliable & Honest
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent explanations, never invents facts
          </div>
        </div>
        <div className="p-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700/60">
          <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            Code & Debug Ready
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Working code snippets with clear explanations
          </div>
        </div>
      </div>
    </div>
  );
};
