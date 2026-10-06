import React, { useState } from 'react';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  User,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest: boolean;
  onRegenerate?: () => void;
  onEditMessage?: (content: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLatest,
  onRegenerate,
  onEditMessage,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isModel = message.role === 'model';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    // Cancel existing utterance
    window.speechSynthesis.cancel();

    // Strip basic markdown syntax for speech
    const cleanText = message.content
      .replace(/```[\s\S]*?```/g, 'Code block omitted for reading.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/[#*_~]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim() && onEditMessage) {
      onEditMessage(editContent.trim());
      setIsEditing(false);
    }
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group py-4 sm:py-5 px-3 sm:px-6 transition-colors ${
        isModel
          ? 'bg-slate-50/70 dark:bg-slate-900/60'
          : 'bg-white dark:bg-slate-950/40'
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isModel ? (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 ring-1 ring-slate-300 dark:ring-slate-700">
              <User className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Message Content Container */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                {isModel ? 'Shah Lalji AI' : 'You'}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {formattedTime}
              </span>
              {message.isStreaming && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  Generating...
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Copy text"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={handleToggleSpeech}
                className={`p-1 rounded-md transition cursor-pointer ${
                  isPlayingAudio
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                }`}
                title={isPlayingAudio ? 'Stop reading' : 'Read aloud'}
              >
                {isPlayingAudio ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>

              {!isModel && onEditMessage && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Edit question"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              )}

              {isModel && isLatest && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition cursor-pointer"
                  title="Regenerate response"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Body Content */}
          {message.error ? (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div className="flex-1">
                <p className="font-medium">Connection or generation error</p>
                <p className="mt-0.5 text-rose-700 dark:text-rose-300 text-xs">
                  {message.content}
                </p>
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retry
                  </button>
                )}
              </div>
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-2 mt-1">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-indigo-400 dark:border-indigo-600 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                rows={3}
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium cursor-pointer"
                >
                  Update & Resend
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : isModel ? (
            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-100">
              <MarkdownRenderer content={message.content} />
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-pulse align-middle" />
              )}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed font-sans">
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
