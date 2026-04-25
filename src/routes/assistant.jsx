import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  User,
  Bot,
  TrendingUp,
  Wallet,
  Boxes,
  Users,
  Receipt,
  Banknote,
  Landmark,
  LayoutDashboard,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/assistant")({
  component: AssistantIAPage,
});

const SUGGESTIONS = [
  {
    icon: TrendingUp,
    label: "CA & Ventes",
    text: "Quel est le chiffre d'affaires total et les meilleures familles de produits ?",
  },
  {
    icon: Wallet,
    label: "Trésorerie",
    text: "Analyse l'état actuel de la trésorerie et les créances impayées.",
  },
  {
    icon: Boxes,
    label: "Stocks",
    text: "Quels articles sont en rupture de stock ou sous le seuil d'alerte ?",
  },
  {
    icon: Users,
    label: "Clients",
    text: "Identifie les clients à risque d'attrition et les top clients par CA.",
  },
  {
    icon: Receipt,
    label: "Fiscalité",
    text: "Résume les anomalies comptables détectées ce mois-ci.",
  },
  {
    icon: Landmark,
    label: "Banque",
    text: "Quel est le taux de rapprochement bancaire actuel ?",
  },
];

const MOCK_RESPONSES = {
  default: [
    "D'après les données de **MAG Distribution**, voici mon analyse :\n\n**Points clés identifiés :**\n- Le CA total YTD s'établit à **12,4 MDT** avec une progression de +8,2% vs N-1\n- Les familles Biscuits et Boissons représentent **42%** du CA consolidé\n- 127 articles sont actuellement en rupture de stock (4,6% du catalogue actif)\n\n**Recommandations :**\n1. Renforcer le réapprovisionnement sur les 89 articles en alerte critique\n2. Relancer les 23% de clients identifiés à risque d'attrition\n3. Optimiser le délai moyen de règlement client (23j vs 20j contractuel)\n\nSouhaitez-vous une analyse plus détaillée sur un domaine spécifique ?",
    "Voici une synthèse de la situation financière consolidée :\n\n**Trésorerie :** Encaissements clients YTD à **8,2 MDT** (+6,1%)\n**Créances :** 1,3 MDT d'impayés dont 340K DT au-delà de 90 jours\n**Taux de recouvrement :** 87% — en amélioration de +2pts\n\nLes flux prévisionnels sur 30/60/90 jours indiquent une position favorable avec un solde net positif projeté à **2,3 MDT** à 90 jours.\n\nVoulez-vous que je détaille les clients les plus exposés ?",
    "Analyse des **anomalies comptables** détectées par le modèle Isolation Forest :\n\n⚠️ **12 écritures anormales** identifiées ce mois (score > 0.8)\n- 4 dans le journal Ventes\n- 5 dans le journal Achats  \n- 3 dans le journal Banque\n\nL'équilibre Débit/Crédit global est maintenu à **98,4%** avec des écarts inférieurs à 0,01 DT.\n\nJe vous recommande de vérifier en priorité les écritures OD du 15 et 22 du mois.",
  ],
};

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-card border border-border/60 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: "900ms" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (text) => {
    return text.split("\n").map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/_(.*?)_/g, "<em>$1</em>");
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className={`flex items-end gap-3 group ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
          isUser
            ? "bg-gradient-to-br from-slate-600 to-slate-700 shadow-slate-900/30"
            : "bg-gradient-to-br from-primary to-primary/70 shadow-primary/30"
        }`}
      >
        {isUser ? (
          <User size={14} className="text-white" />
        ) : (
          <Bot size={14} className="text-white" />
        )}
      </div>

      <div className={`max-w-[75%] relative ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
            isUser
              ? "bg-primary text-white rounded-br-sm shadow-lg shadow-primary/25"
              : "bg-card border border-border/60 text-foreground rounded-bl-sm shadow-sm"
          }`}
        >
          {renderContent(msg.content)}
        </div>
        <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-text-dim">{msg.time}</span>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-text-dim hover:text-foreground"
            >
              {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AssistantIAPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Bonjour ! Je suis votre assistant IA pour **MAG Distribution**. Je peux analyser vos données financières, identifier des tendances, détecter des anomalies et vous fournir des insights actionnables.\n\nQue souhaitez-vous explorer aujourd'hui ?",
      time: new Date().toLocaleTimeString("fr-TN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      content,
      time: new Date().toLocaleTimeString("fr-TN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const responses = MOCK_RESPONSES.default;
      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: responses[responseIndex % responses.length],
        time: new Date().toLocaleTimeString("fr-TN", { hour: "2-digit", minute: "2-digit" }),
      };
      setResponseIndex((i) => i + 1);
      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: "Conversation réinitialisée. Comment puis-je vous aider ?",
        time: new Date().toLocaleTimeString("fr-TN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-foreground leading-none">Assistant IA</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] text-text-dim">Connecté aux données MAG Distribution</span>
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-text-dim hover:text-foreground hover:border-border/80 text-[12px] transition-colors"
        >
          <Trash2 size={12} />
          Effacer
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />

        {/* Suggestions */}
        {showSuggestions && !isTyping && (
          <div className="mt-6">
            <p className="text-[11px] text-text-dim font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap size={11} className="text-primary" />
              Suggestions rapides
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMessage(s.text)}
                  className="flex items-start gap-2.5 p-3 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-primary/5 text-left transition-all duration-200 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <s.icon size={13} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground leading-none mb-1">{s.label}</p>
                    <p className="text-[11px] text-text-dim leading-relaxed line-clamp-2">{s.text}</p>
                  </div>
                  <ChevronRight size={12} className="text-text-dim flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 mt-2">
        <div className="flex gap-2 p-2 bg-card border border-border/60 rounded-2xl shadow-lg">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question sur les données MAG Distribution..."
            rows={1}
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-text-dim outline-none resize-none px-2 py-1.5 leading-relaxed max-h-32"
            style={{ minHeight: "36px" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 self-end shadow-md shadow-primary/30 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-text-dim text-center mt-1.5">
          Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
        </p>
      </div>
    </div>
  );
}