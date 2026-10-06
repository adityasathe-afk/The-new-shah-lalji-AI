import React, { useRef, useEffect, useState } from 'react';
import {
  ArrowUp,
  Square,
  Mic,
  MicOff,
  Sparkles,
} from 'lucide-react';
import { AssistantMode } from '../types';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  activeMode: AssistantMode;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  activeMode,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  // Voice speech-to-text setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInput(input ? `${input} ${transcript}` : transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [input, setInput]);

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        onSend(input);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStreaming) {
      onStop();
    } else if (input.trim()) {
      onSend(input);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-3 sm:pb-5">
      <form
        onSubmit={handleFormSubmit}
        className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700/80 shadow-md focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500 transition-all"
      >
        <div className="p-2 sm:p-3 pb-1.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeMode === 'tutor'
                ? 'Ask a homework question or request a concept explanation...'
                : activeMode === 'coder'
                ? 'Ask for code, debug an error, or explain an algorithm...'
                : activeMode === 'math'
                ? 'Ask a math or science problem for step-by-step working...'
                : 'Message Shah Lalji AI...'
            }
            className="w-full max-h-48 resize-none bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span className="hidden sm:inline">
              Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Shift+Enter</kbd> for newline
            </span>
            <span className="sm:hidden flex items-center gap-1 text-[10px]">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Shah Lalji AI
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`p-2 rounded-xl text-xs transition cursor-pointer ${
                isListening
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 animate-pulse'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isListening ? 'Stop listening' : 'Dictate with voice'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send / Stop Button */}
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition shadow-xs cursor-pointer flex items-center gap-1.5 font-medium text-xs"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px] hidden sm:inline">Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  input.trim()
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-sm shadow-indigo-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
