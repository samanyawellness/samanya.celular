import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  ArrowLeft,
  CheckCheck,
  Sparkles,
  Search
} from 'lucide-react';
import { ChatConversation } from '../types';

export const MessagesModal: React.FC = () => {
  const {
    isMessagesOpen,
    setIsMessagesOpen,
    conversations,
    sendMessage,
    selectedResident,
    selectedFamiliarResident,
    currentUser
  } = useApp();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isMessagesOpen) return null;

  const isFamiliar = currentUser.role === 'familiar';
  const activeConversation = conversations.find(c => c.id === activeChatId);

  const filteredConversations = conversations.filter(c =>
    c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contactRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.contactUnit && c.contactUnit.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeConversations = filteredConversations.filter(c => c.hasHistory);
  const availableContacts = filteredConversations.filter(c => !c.hasHistory);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !inputText.trim()) return;
    sendMessage(activeChatId, inputText);
    setInputText('');
  };

  const contextResidentName = isFamiliar
    ? selectedFamiliarResident?.name
    : selectedResident?.name || 'Centro Residencial Samanya';

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F7F8] flex flex-col justify-start items-center overflow-hidden animate-in fade-in duration-150">
      <div
        role="region"
        aria-label="Mensajería directa"
        className="w-full max-w-md h-full flex flex-col bg-[#F7F7F8] relative overflow-hidden border-x border-[#DEDBD1]/60 shadow-sm"
      >
        {/* Header when inside a chat */}
        {activeConversation ? (
          <div className="p-3.5 sm:p-4 bg-white border-b border-[#DEDBD1] flex items-center justify-between shadow-2xs z-10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                id="btn-back-conversations"
                type="button"
                onClick={() => setActiveChatId(null)}
                className="touch-target p-2 -ml-1.5 rounded-xl text-[#292A24] hover:bg-[#F7F7F8] active:scale-95 transition-all"
                aria-label="Volver a la lista de mensajes"
              >
                <ArrowLeft className="w-5 h-5 text-[#292A24]" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeConversation.contactAvatar}
                  alt={activeConversation.contactName}
                  className="w-10 h-10 rounded-full object-cover border border-[#DEDBD1]"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#1E7A4C] rounded-full border-2 border-white" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-bold text-[#292A24] leading-tight truncate">
                  {activeConversation.contactName}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#D9F0F1] text-[#075158] truncate">
                    {activeConversation.contactRole}
                  </span>
                  <span className="text-[11px] text-[#5C6058] shrink-0">En línea</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Main Inbox Header - Clean title with back arrow, no icon beside title, no descriptive text below */
          <div className="p-3.5 sm:p-4 bg-white border-b border-[#DEDBD1] flex items-center justify-between shadow-2xs shrink-0">
            <div className="flex items-center gap-2">
              <button
                id="btn-back-messages"
                type="button"
                onClick={() => {
                  setIsMessagesOpen(false);
                  setActiveChatId(null);
                }}
                className="touch-target p-2 -ml-1.5 rounded-xl text-[#292A24] hover:bg-[#F7F7F8] active:scale-95 transition-all"
                aria-label="Volver atrás"
              >
                <ArrowLeft className="w-5 h-5 text-[#292A24]" />
              </button>
              <h1 className="text-base font-bold text-[#292A24] leading-tight">
                Mensajería directa
              </h1>
            </div>
          </div>
        )}

        {/* Content Area */}
        {activeConversation ? (
          /* Active Chat Stream & Input */
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBFBFA]">
              {/* Context Banner */}
              <div className="p-2.5 bg-[#D9F0F1]/40 rounded-2xl border border-[#068591]/20 flex items-center justify-between text-xs text-[#075158]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#068591] shrink-0" />
                  <span className="truncate">Conversación referida a: <strong>{contextResidentName}</strong></span>
                </div>
              </div>

              {activeConversation.messages.length > 0 ? (
                activeConversation.messages.map(msg => {
                  const isMe = msg.isFromMe;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[82%] sm:max-w-[75%] rounded-3xl p-3.5 shadow-2xs ${
                          isMe
                            ? 'bg-[#068591] text-white rounded-tr-xs'
                            : 'bg-white text-[#292A24] border border-[#DEDBD1] rounded-tl-xs'
                        }`}
                      >
                        <p className="text-xs leading-relaxed break-words">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-[#5C6058]">
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#068591]" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#EBF7F8] text-[#068591] flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-[#292A24]">Inicia la conversación</p>
                  <p className="text-[11px] text-[#5C6058] max-w-xs mx-auto">
                    Escribe tu consulta o informe sobre el estado del residente.
                  </p>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-[#DEDBD1] flex items-center gap-2 shrink-0"
            >
              <input
                id="input-chat-message"
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-[#F7F7F8] border border-[#DEDBD1] rounded-2xl px-4 py-2.5 text-xs text-[#292A24] placeholder-[#5C6058] focus:outline-none focus:ring-2 focus:ring-[#068591]"
              />
              <button
                id="btn-send-chat-message"
                type="submit"
                disabled={!inputText.trim()}
                className="touch-target p-3 rounded-2xl bg-[#068591] text-white hover:bg-[#075158] disabled:opacity-40 disabled:hover:bg-[#068591] transition-all flex items-center justify-center shadow-xs"
                aria-label="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Conversation List / Contacts */
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#5C6058]" />
              <input
                id="input-search-contacts"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, cargo o departamento..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#DEDBD1] text-xs text-[#292A24] placeholder-[#5C6058] focus:outline-none focus:ring-2 focus:ring-[#068591]"
              />
            </div>

            {/* Active Chats */}
            {activeConversations.length > 0 && (
              <div className="space-y-2">
                <div className="px-1 text-xs font-bold text-[#5C6058] uppercase tracking-wider">
                  Conversaciones recientes ({activeConversations.length})
                </div>
                <div className="space-y-2">
                  {activeConversations.map(conv => (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => setActiveChatId(conv.id)}
                      className="w-full p-3.5 bg-white rounded-2xl border border-[#DEDBD1] hover:border-[#068591] transition-all flex items-center gap-3 text-left shadow-2xs group"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.contactAvatar}
                          alt={conv.contactName}
                          className="w-12 h-12 rounded-full object-cover border border-[#DEDBD1]"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#1E7A4C] rounded-full border-2 border-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-sm text-[#292A24] truncate group-hover:text-[#068591]">
                            {conv.contactName}
                          </h4>
                          {conv.lastMessageTime && (
                            <span className="text-[10px] text-[#5C6058] shrink-0">
                              {conv.lastMessageTime}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5C6058] truncate mt-0.5">
                          {conv.lastMessage || conv.contactRole}
                        </p>
                      </div>

                      {conv.unreadCount > 0 && (
                        <span className="shrink-0 h-5 min-w-5 flex items-center justify-center rounded-full bg-[#068591] text-white text-[10px] font-bold px-1.5">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Contacts to Start a New Chat */}
            {availableContacts.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="px-1 text-xs font-bold text-[#5C6058] uppercase tracking-wider">
                  Contactos directos
                </div>
                <div className="space-y-2">
                  {availableContacts.map(contact => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => setActiveChatId(contact.id)}
                      className="w-full p-3 bg-white rounded-2xl border border-[#DEDBD1] hover:border-[#068591] transition-all flex items-center justify-between text-left shadow-2xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={contact.contactAvatar}
                          alt={contact.contactName}
                          className="w-10 h-10 rounded-full object-cover border border-[#DEDBD1]"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[#292A24] truncate group-hover:text-[#068591]">
                            {contact.contactName}
                          </h4>
                          <p className="text-[11px] text-[#5C6058] truncate">
                            {contact.contactRole}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#068591] bg-[#D9F0F1] px-2.5 py-1 rounded-xl shrink-0">
                        Escribir
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
