import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  RefreshCw,
  Trash2,
  BookOpen,
  FileText,
  GraduationCap,
  Activity,
  Building2,
  Plus,
  Bot,
  User,
  ArrowRight,
  Search,
  MessageSquare
} from 'lucide-react';
import { aiService, AISendMessagePayload } from '../../services/aiService';
import { ChatMessage } from '../../types';

interface AIChatWindowProps {
  initialPrompt?: string;
  initialContext?: string;
}

export const AIChatWindow: React.FC<AIChatWindowProps> = ({
  initialPrompt,
  initialContext = 'My Academic Data'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>(initialPrompt || '');
  const [activeContext, setActiveContext] = useState<string>(initialContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [contextList, setContextList] = useState<
    { id: string; label: string; icon: string; description: string }[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const history = await aiService.getChatHistory();
      const prompts = await aiService.getSuggestedPrompts();
      const contexts = await aiService.getContextOptions();
      setMessages(history);
      setSuggestedPrompts(prompts);
      setContextList(contexts);

      if (initialPrompt) {
        handleSend(initialPrompt);
      }
    };
    init();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend || inputText;
    if (!msg.trim() || isLoading) return;

    setInputText('');
    setIsLoading(true);

    try {
      const payload: AISendMessagePayload = {
        message: msg,
        context: activeContext,
        history: messages
      };
      await aiService.sendMessage(payload);
      const updated = await aiService.getChatHistory();
      setMessages(updated);
    } catch (err) {
      console.error('Failed to send AI message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    await aiService.clearChatHistory();
    const updated = await aiService.getChatHistory();
    setMessages(updated);
  };

  const getContextIcon = (id: string) => {
    switch (id) {
      case 'notes':
        return <FileText className="w-3.5 h-3.5" />;
      case 'subjects':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'pyqs':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'academic_data':
        return <Activity className="w-3.5 h-3.5" />;
      case 'college_info':
        return <Building2 className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  const filteredMessages = searchFilter
    ? messages.filter((m) => m.content.toLowerCase().includes(searchFilter.toLowerCase()))
    : messages;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[760px]">
      {/* Copilot Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center shadow-xs border border-blue-800">
            <Sparkles className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Campus AI</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Academic Copilot
              </span>
            </div>
            <p className="text-xs text-slate-500">Your personal academic copilot • GLBITM Knowledge Base</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick search input */}
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search chat..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 w-36 focus:w-48 transition-all focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleClear}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RAG Context Selector Bar */}
      <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-1">
          RAG Context:
        </span>
        {contextList.map((ctx) => {
          const isSelected = activeContext === ctx.label;
          return (
            <button
              key={ctx.id}
              onClick={() => setActiveContext(ctx.label)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={ctx.description}
            >
              {getContextIcon(ctx.id)}
              {ctx.label}
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {filteredMessages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isAssistant
                    ? 'bg-blue-900 text-blue-100 border border-blue-700 shadow-xs'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className="space-y-1.5">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-white border border-slate-200/90 text-slate-800 shadow-xs'
                      : 'bg-blue-600 text-white shadow-xs font-medium'
                  }`}
                >
                  {/* Simple Markdown-friendly renderer */}
                  <div className="whitespace-pre-line space-y-2">
                    {msg.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Context pill if assistant */}
                  {isAssistant && msg.contextApplied && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      Indexed with: {msg.contextApplied}
                    </div>
                  )}
                </div>

                {/* Suggested follow-ups */}
                {isAssistant && msg.suggestedFollowups && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedFollowups.map((followup, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSend(followup)}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        {followup}
                      </button>
                    ))}
                  </div>
                )}

                <span
                  className={`text-[10px] text-slate-600 font-medium px-1 block ${
                    isAssistant ? 'text-left' : 'text-right'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-md mr-auto">
            <div className="w-8 h-8 rounded-xl bg-blue-900 text-blue-100 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Campus AI is reviewing GLBITM curriculum and syllabus...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pills */}
      {messages.length <= 4 && (
        <div className="px-6 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 whitespace-nowrap transition-colors border border-slate-200/80"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask Campus AI about ${activeContext}...`}
            className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          CampusOS Copilot indexes GL Bajaj Institute of Technology &amp; Management syllabus and AKTU exam datasets.
        </p>
      </div>
    </div>
  );
};
