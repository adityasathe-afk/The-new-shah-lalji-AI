import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAllSessions: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onClearAllSessions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameSession(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteSession(id);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group sessions by date
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const todaySessions: ChatSession[] = [];
  const yesterdaySessions: ChatSession[] = [];
  const last7DaysSessions: ChatSession[] = [];
  const olderSessions: ChatSession[] = [];

  filteredSessions.forEach((s) => {
    const diff = now - s.updatedAt;
    if (diff < ONE_DAY) {
      todaySessions.push(s);
    } else if (diff < 2 * ONE_DAY) {
      yesterdaySessions.push(s);
    } else if (diff < 7 * ONE_DAY) {
      last7DaysSessions.push(s);
    } else {
      olderSessions.push(s);
    }
  });

  const renderSessionGroup = (title: string, groupSessions: ChatSession[]) => {
    if (groupSessions.length === 0) return null;
    return (
      <div className="mb-4">
        <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </div>
        <div className="space-y-1 mt-1">
          {groupSessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const isEditing = session.id === editingId;

            return (
              <div
                key={session.id}
                onClick={() => {
                  onSelectSession(session.id);
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  />

                  {isEditing ? (
                    <form
                      onSubmit={(e) => handleSaveRename(session.id, e)}
                      className="flex items-center gap-1 flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        autoFocus
                        className="w-full bg-white dark:bg-slate-800 border border-indigo-400 dark:border-indigo-600 rounded px-1.5 py-0.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1 hover:text-emerald-500 cursor-pointer"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelRename}
                        className="p-1 hover:text-rose-500 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <span className="truncate flex-1">{session.title}</span>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0">
                    <button
                      onClick={(e) => handleStartRename(session, e)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                      title="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 bg-slate-50/95 dark:bg-slate-900/95 md:bg-white dark:md:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top actions */}
        <div className="p-3.5 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                SL
              </div>
              <span className="font-semibold text-xs tracking-wide text-slate-800 dark:text-slate-200 uppercase">
                Conversations
              </span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) {
                onClose();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium text-xs shadow-sm shadow-indigo-500/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          {/* Search Bar */}
          {sessions.length > 3 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-2.5">
          {sessions.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-400 dark:text-slate-500 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs">No conversations yet.</p>
              <p className="text-[11px] text-slate-400">
                Ask a question to begin learning with Shah Lalji AI!
              </p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No matching conversations found.
            </div>
          ) : (
            <>
              {renderSessionGroup('Today', todaySessions)}
              {renderSessionGroup('Yesterday', yesterdaySessions)}
              {renderSessionGroup('Previous 7 Days', last7DaysSessions)}
              {renderSessionGroup('Older', olderSessions)}
            </>
          )}
        </div>

        {/* Bottom footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
          {sessions.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all conversation history?')) {
                  onClearAllSessions();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-500" />
              Shah Lalji Academy
            </span>
            <span className="font-mono text-[10px]">v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
