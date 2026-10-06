import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AboutModal } from './components/AboutModal';
import {
  ChatMessage as ChatMessageType,
  ChatSession,
  AssistantMode,
} from './types';
import { ArrowDown } from 'lucide-react';

const STORAGE_KEY = 'shah_lalji_ai_sessions_v1';
const THEME_KEY = 'shah_lalji_ai_theme';

// Your Render backend
const API_URL = 'https://the-new-shah-lalji-ai.onrender.com/api/chat';

const INITIAL_WELCOME_TEXT = `Hey! 👋 I'm Shah Lalji AI.
What can I help you with today?`;

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading sessions from localStorage:', e);
    }

    const defaultSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'model',
          content: INITIAL_WELCOME_TEXT,
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: 'general',
    };

    return [defaultSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || '';
  });

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);

    if (saved) {
      return saved === 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Error persisting sessions:', e);
    }
  }, [sessions]);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto scroll to bottom
  const scrollToBottom = (
    behavior: ScrollBehavior = 'smooth'
  ) => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!showScrollBottom) {
      scrollToBottom('smooth');
    }
  }, [activeSession?.messages, isStreaming]);

  // Handle scroll detection
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
    } = scrollContainerRef.current;

    const distanceToBottom =
      scrollHeight - scrollTop - clientHeight;

    setShowScrollBottom(distanceToBottom > 200);
  };

  const createNewSession = (
    mode: AssistantMode = 'general'
  ) => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'model',
          content: INITIAL_WELCOME_TEXT,
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode,
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSelectMode = (newMode: AssistantMode) => {
    if (!activeSession) return;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              mode: newMode,
            }
          : s
      )
    );
  };

  const handleRenameSession = (
    id: string,
    newTitle: string
  ) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              title: newTitle,
            }
          : s
      )
    );
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);

      if (remaining.length === 0) {
        const fresh: ChatSession = {
          id: crypto.randomUUID(),
          title: 'New Conversation',
          messages: [
            {
              id: crypto.randomUUID(),
              role: 'model',
              content: INITIAL_WELCOME_TEXT,
              timestamp: Date.now(),
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          mode: 'general',
        };

        setActiveSessionId(fresh.id);

        return [fresh];
      }

      if (activeSessionId === id) {
        setActiveSessionId(remaining[0].id);
      }

      return remaining;
    });
  };

  const handleClearAllSessions = () => {
    const fresh: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Conversation',
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'model',
          content: INITIAL_WELCOME_TEXT,
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: 'general',
    };

    setSessions([fresh]);
    setActiveSessionId(fresh.id);
  };

  const handleSendMessage = async (
    userText: string,
    customMode?: AssistantMode
  ) => {
    if (!userText.trim() || isStreaming) return;

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userText.trim(),
      timestamp: Date.now(),
    };

    const assistantPlaceholderId = crypto.randomUUID();

    const assistantPlaceholder: ChatMessageType = {
      id: assistantPlaceholderId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    const targetMode =
      customMode || activeSession.mode || 'general';

    // Add the user message and assistant placeholder
    const updatedMessages = [
      ...activeSession.messages,
      userMessage,
      assistantPlaceholder,
    ];

    // Create conversation title
    let newTitle = activeSession.title;

    if (activeSession.title === 'New Conversation') {
      newTitle =
        userText.length > 32
          ? `${userText.slice(0, 32).trim()}...`
          : userText;
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              title: newTitle,
              mode: targetMode,
              messages: updatedMessages,
              updatedAt: Date.now(),
            }
          : s
      )
    );

    setInput('');
    setIsStreaming(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Send message to your Render backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText.trim(),
        }),
        signal: controller.signal,
      });

      // Read JSON response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            `HTTP error! Status: ${response.status}`
        );
      }

      const reply = data?.reply;

      if (!reply) {
        throw new Error(
          'The AI returned an empty response.'
        );
      }

      // Put the AI response into the placeholder message
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? {
                ...s,
                updatedAt: Date.now(),
                messages: s.messages.map((m) =>
                  m.id === assistantPlaceholderId
                    ? {
                        ...m,
                        content: reply,
                        isStreaming: false,
                      }
                    : m
                ),
              }
            : s
        )
      );
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantPlaceholderId
                      ? {
                          ...m,
                          content: '',
                          isStreaming: false,
                        }
                      : m
                  ),
                }
              : s
          )
        );
      } else {
        console.error(
          'Generation error:',
          error
        );

        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSession.id
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantPlaceholderId
                      ? {
                          ...m,
                          content:
                            error.message ||
                            'Sorry, I encountered an issue connecting to the AI. Please try again.',
                          isStreaming: false,
                          error: true,
                        }
                      : m
                  ),
                }
              : s
          )
        );
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRegenerate = () => {
    if (isStreaming) return;

    const msgs = activeSession.messages;

    let lastUserIndex = -1;

    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const userMessage = msgs[lastUserIndex];

    // Remove messages after the previous user message
    const trimmedMessages = msgs.slice(
      0,
      lastUserIndex
    );

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              messages: trimmedMessages,
            }
          : s
      )
    );

    // Send the message again
    handleSendMessage(
      userMessage.content,
      activeSession.mode
    );
  };

  const handleEditMessage = (newText: string) => {
    if (isStreaming) return;

    handleSendMessage(
      newText,
      activeSession.mode
    );
  };

  const handleExportChat = () => {
    const markdownContent = [
      `# ${activeSession.title}`,
      `*Exported from Shah Lalji AI on ${new Date().toLocaleString()}*`,
      `*Mode: ${activeSession.mode}*`,
      '',
      '---',
      '',
      ...activeSession.messages.map((m) => {
        const speaker =
          m.role === 'model'
            ? '### 🤖 Shah Lalji AI'
            : '### 👤 You';

        const time =
          new Date(m.timestamp).toLocaleTimeString();

        return `${speaker} (${time})\n\n${m.content}\n\n---`;
      }),
    ].join('\n\n');

    const blob = new Blob(
      [markdownContent],
      {
        type: 'text/markdown;charset=utf-8',
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download =
      `${activeSession.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')}_transcript.md`;

    link.click();

    URL.revokeObjectURL(url);
  };

  const hasOnlyWelcomeMessage =
    activeSession.messages.length === 1 &&
    activeSession.messages[0].role === 'model';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 font-sans transition-colors">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSession.id}
        onSelectSession={(id) =>
          setActiveSessionId(id)
        }
        onNewChat={() => createNewSession()}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onClearAllSessions={
          handleClearAllSessions
        }
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/50 dark:bg-slate-950">
        <Header
          onToggleSidebar={() =>
            setIsSidebarOpen(!isSidebarOpen)
          }
          onNewChat={() => createNewSession()}
          onExportChat={handleExportChat}
          onOpenAbout={() =>
            setIsAboutOpen(true)
          }
          isDarkMode={isDarkMode}
          onToggleDarkMode={() =>
            setIsDarkMode(!isDarkMode)
          }
          activeMode={activeSession.mode}
          onSelectMode={handleSelectMode}
          hasMessages={
            activeSession.messages.length > 1
          }
        />

        {/* Messages Scroll View */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative scroll-smooth"
        >
          {hasOnlyWelcomeMessage ? (
            <WelcomeScreen
              onSelectPrompt={(prompt, mode) => {
                if (mode) {
                  handleSelectMode(mode);
                }

                handleSendMessage(prompt, mode);
              }}
            />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 pb-4">
              {activeSession.messages.map(
                (message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isLatest={
                      index ===
                      activeSession.messages.length - 1
                    }
                    onRegenerate={
                      handleRegenerate
                    }
                    onEditMessage={
                      handleEditMessage
                    }
                  />
                )
              )}

              <div
                ref={messagesEndRef}
                className="h-4"
              />
            </div>
          )}

          {/* Floating Scroll to Bottom Button */}
          {showScrollBottom && (
            <button
              onClick={() =>
                scrollToBottom('smooth')
              }
              className="fixed bottom-24 right-6 p-2.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer z-10 hover:scale-105"
              title="Scroll to latest message"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={(text) =>
            handleSendMessage(
              text,
              activeSession.mode
            )
          }
          onStop={handleStopStreaming}
          isStreaming={isStreaming}
          activeMode={activeSession.mode}
        />
      </div>

      {/* About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() =>
          setIsAboutOpen(false)
        }
      />
    </div>
  );
}