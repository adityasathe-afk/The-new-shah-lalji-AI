import React from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Code,
  ShieldCheck,
  CheckCircle2,
  Heart,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                About Shah Lalji AI
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Smart, Friendly & Patient AI Assistant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Principles */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
            <p className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
              <Heart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Welcome & Identity
            </p>
            <p className="mt-1 text-indigo-800/90 dark:text-indigo-300 text-xs italic">
              "Hey! 👋 I'm Shah Lalji AI. What can I help you with today?"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900 dark:text-slate-100">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                Teaching Style
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Step-by-step reasoning for schoolwork and homework so you master concepts instead of just memorizing answers.
              </p>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900 dark:text-slate-100">
                <Code className="w-3.5 h-3.5 text-blue-500" />
                Coding & Debugging
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Provides robust, working code with annotations, edge-case checks, and thorough inspection of your existing code.
              </p>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900 dark:text-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
                Honesty & Accuracy
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Never pretends to know what it doesn't. Confident when reliable, clear and truthful when uncertain.
              </p>
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900 dark:text-slate-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                Context Memory
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Retains the full context of your active conversation so you never have to repeat yourself.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition cursor-pointer"
          >
            Got it, Let's Chat!
          </button>
        </div>
      </div>
    </div>
  );
};
