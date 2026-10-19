import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { Conversation } from '../../types/models';
import {
  Send,
  Search,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  CheckCheck,
} from 'lucide-react';

export const MessagesScreen: React.FC = () => {
  const { conversations, sendMessage, currentUser } = useSparkle();

  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileViewingChat, setMobileViewingChat] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const filteredConversations = conversations.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.participantName.toLowerCase().includes(q) ||
        c.participantUniversity.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;

    sendMessage(activeConversationId, inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden h-[calc(100vh-140px)] min-h-[500px] flex">
      
      {/* Conversations List (Pane 1) */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-slate-200/80 flex flex-col ${
          mobileViewingChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-900">Direct Messages</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sparkle-purple/10 text-sparkle-purple font-bold">
              {conversations.length} Active
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
            />
          </div>
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConversationId;

            return (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConversationId(conv.id);
                  setMobileViewingChat(true);
                }}
                className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                  isSelected ? 'bg-sparkle-purple/5' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <img
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    className="w-11 h-11 rounded-full bg-slate-100 object-cover"
                  />
                  {conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-sparkle-purple text-white text-[10px] font-bold flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-extrabold text-xs text-slate-900 truncate">
                      {conv.participantName}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-[11px] text-sparkle-purple font-medium mb-1 truncate">
                    {conv.participantUniversity}
                  </p>
                  <p className="text-xs text-slate-500 truncate font-medium">{conv.lastMessage}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Conversation Chat Window (Pane 2) */}
      <div
        className={`flex-1 flex flex-col bg-slate-50/50 ${
          !mobileViewingChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileViewingChat(false)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <img
                  src={activeConversation.participantAvatar}
                  alt={activeConversation.participantName}
                  className="w-10 h-10 rounded-full bg-slate-100 object-cover"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-none">
                      {activeConversation.participantName}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-sparkle-mint" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {activeConversation.participantUniversity} • Student Verified
                  </p>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isFromMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[78%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                      msg.isFromMe
                        ? 'bg-sparkle-purple text-white rounded-br-xs shadow-sm shadow-sparkle-purple/20'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.content || msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-slate-400 font-medium">{msg.timestamp}</span>
                    {msg.isFromMe && <CheckCheck className="w-3.5 h-3.5 text-sparkle-purple" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200/80">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Message ${activeConversation.participantName}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sparkle-purple/30 font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-sparkle-purple text-white hover:bg-sparkle-purple-dark disabled:opacity-40 transition-all shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
            <p className="font-bold text-sm text-slate-700">Select a conversation</p>
            <p className="text-xs text-slate-400 mt-1">Chat directly with peers across Kenyan universities.</p>
          </div>
        )}
      </div>

    </div>
  );
};
