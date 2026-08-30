import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Phone,
  CheckCheck,
  User,
  PlusCircle,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ChatConversation } from '../../types';

export const FamiliarMensajeriaScreen: React.FC = () => {
  const { conversations, sendMessage, selectedFamiliarResident } = useApp();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  // Active chat object if open
  const activeConversation = conversations.find(c => c.id === activeChatId);

  // Group conversations into active (hasHistory = true) vs contacts (hasHistory = false)
  const activeConversations = conversations.filter(c => c.hasHistory);
  const availableContacts = conversations.filter(c => !c.hasHistory);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !inputText.trim()) return;
    sendMessage(activeChatId, inputText);
    setInputText('');
  };

  // If a chat is active -> Render Individual Chat View
  if (activeConversation) {
    return (
      <div className="flex flex-col h-[calc(100vh-80px)] max-w-lg mx-auto bg-white sm:rounded-3xl border border-[#DEDBD1] shadow-sm overflow-hidden animate-in fade-in duration-200">
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 bg-white border-b border-[#DEDBD1] flex items-center justify-between shadow-2xs z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveChatId(null)}
              className="touch-target p-2 rounded-xl text-[#5C6058] hover:text-[#292A24] hover:bg-[#F7F7F8]"
              aria-label="Volver a la lista de mensajes"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <img
                src={activeConversation.participantAvatar}
                alt={activeConversation.participantName}
                className="w-10 h-10 rounded-full object-cover border border-[#DEDBD1]"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#1E7A4C] rounded-full border-2 border-white" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#292A24] leading-tight">
                {activeConversation.participantName}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#D9F0F1] text-[#075158]">
                  {activeConversation.participantRole}
                </span>
                <span className="text-[11px] text-[#5C6058]">En línea</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => alert(`Llamada directa al departamento de ${activeConversation.participantRole} de Samanya`)}
              className="touch-target p-2.5 rounded-2xl bg-[#EBF7F8] text-[#068591] hover:bg-[#D9F0F1] transition-all"
              aria-label="Llamar"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message bubble stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FBFBFA]">
          {/* Patient context banner inside chat */}
          <div className="p-2.5 bg-[#D9F0F1]/40 rounded-2xl border border-[#068591]/20 flex items-center justify-between text-xs text-[#075158]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#068591]" />
              <span>Conversación referida a: <strong>{selectedFamiliarResident?.name}</strong></span>
            </div>
            <span className="text-[10px] font-semibold text-[#5C6058]">{selectedFamiliarResident?.room}</span>
          </div>

          {activeConversation.messages.map((msg) => {
            const isMe = msg.isFromMe;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                  isMe ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-[#068591] text-white rounded-tr-xs'
                      : 'bg-white text-[#292A24] border border-[#DEDBD1] rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#5C6058] mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-[#068591]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-[#DEDBD1] flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Escribe a ${activeConversation.participantName}...`}
            className="flex-1 bg-[#F7F7F8] border border-[#DEDBD1] rounded-2xl px-4 py-2.5 text-xs text-[#292A24] placeholder:text-[#5C6058] focus:outline-none focus:border-[#068591]"
          />
          <button
            id="btn-send-chat-message"
            type="submit"
            disabled={!inputText.trim()}
            className="touch-target w-10 h-10 rounded-2xl bg-[#068591] text-white flex items-center justify-center shadow-xs hover:bg-[#056c76] active:scale-95 transition-all disabled:opacity-40"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Otherwise -> Render Conversation Directory
  return (
    <div className="space-y-4 pb-28 px-4 sm:px-5 max-w-lg mx-auto pt-1 animate-in fade-in duration-200">
      {/* 1. Title */}
      <div className="pt-1">
        <h2 className="text-xl font-bold text-[#292A24]">
          Mensajería con el Centro
        </h2>
      </div>

      {/* 2. Sección: Conversaciones activas */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-[#5C6058] uppercase tracking-wide">
            Conversaciones activas ({activeConversations.length})
          </h3>
          <span className="text-[11px] text-[#068591] font-semibold">
            Historial guardado
          </span>
        </div>

        <div className="space-y-2">
          {activeConversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => setActiveChatId(conv.id)}
              className="w-full text-left bg-white p-3.5 rounded-3xl border border-[#DEDBD1] hover:border-[#068591]/40 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    className="w-12 h-12 rounded-full object-cover border border-[#DEDBD1]"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#1E7A4C] rounded-full border-2 border-white" />
                </div>
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#292A24] truncate">
                      {conv.participantName}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#D9F0F1] text-[#075158] shrink-0">
                      {conv.participantRole}
                    </span>
                  </div>
                  <p className="text-xs text-[#5C6058] truncate mt-0.5">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-[#5C6058] block">
                  {conv.lastMessageTime}
                </span>
                {conv.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-4 h-4 px-1.5 rounded-full bg-[#8C2E2E] text-white text-[10px] font-bold mt-1 shadow-xs">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Sección: Contactos del centro (Sin conversación iniciada aún) */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-[#5C6058] uppercase tracking-wide">
            Contactos del centro ({availableContacts.length})
          </h3>
          <span className="text-[11px] text-[#5C6058]">
            Disponibles para consulta
          </span>
        </div>

        <div className="space-y-2">
          {availableContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white p-3.5 rounded-3xl border border-[#DEDBD1] flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={contact.participantAvatar}
                  alt={contact.participantName}
                  className="w-11 h-11 rounded-full object-cover border border-[#DEDBD1]"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#292A24]">
                    {contact.participantName}
                  </h4>
                  <p className="text-xs text-[#5C6058]">
                    {contact.participantRole}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveChatId(contact.id)}
                className="touch-target py-2 px-3 rounded-2xl bg-[#D9F0F1] text-[#075158] hover:bg-[#cbe8ea] font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Conversar</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security & GDPR compliance notice */}
      <div className="p-3 bg-[#F7F7F8] rounded-2xl border border-[#DEDBD1]/60 flex items-center gap-2 text-[11px] text-[#5C6058]">
        <ShieldCheck className="w-4 h-4 text-[#068591] shrink-0" />
        <span>Canal cifrado y auditado conforme a la normativa sanitaria de protección de datos.</span>
      </div>
    </div>
  );
};
