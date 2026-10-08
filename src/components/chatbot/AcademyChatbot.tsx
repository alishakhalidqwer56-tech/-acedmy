import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  PhoneCall,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../../context/SiteContext';
import { fetchChatbotSettings, ChatbotSettings, defaultChatbotSettings } from '../../lib/dataService';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  showLinkToAdmissions?: boolean;
  showLinkToCourses?: boolean;
}

export const AcademyChatbot: React.FC = () => {
  const { settings } = useSite();
  const [botConfig, setBotConfig] = useState<ChatbotSettings>(defaultChatbotSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chatbot settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const config = await fetchChatbotSettings();
        if (config) {
          setBotConfig(config);
        }
      } catch (err) {
        console.warn('Failed to load chatbot settings:', err);
      }
    }
    loadSettings();

    const handleStorage = () => loadSettings();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Initialize welcome message
  useEffect(() => {
    const welcome = botConfig.welcome_message || 
      'Welcome to Girls Academy Islamabad! I am your 24/7 AI Student & Admissions Advisor. How can I help you today? You can ask in English, Urdu, or Roman Urdu (e.g., "admissions", "fee structure", "timings", "courses").';

    setMessages([
      {
        id: 'welcome-msg',
        sender: 'bot',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [botConfig.welcome_message]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  if (botConfig.is_enabled === false) {
    return null;
  }

  const phone = settings.academy_phone || settings.contact_phone || settings.phone_number || '051-4861234';
  const positionClass = botConfig.position === 'bottom-left' ? 'left-6' : 'right-6';

  // Local fallback response generator if server is unavailable
  const generateLocalResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    if (/^(hi|hello|hey|salam|assalam|aoa|asalam|kese|kaise|kia hal|kya hal)/.test(q)) {
      return "Walaikum Assalam! Welcome to Girls Academy Islamabad. Main aapki kya madad kar sakti hoon? You can ask about admissions, fee structures, class timings, courses, or board results.";
    }

    if (q.includes('admiss') || q.includes('dakhla') || q.includes('apply') || q.includes('form') || q.includes('seat')) {
      return `Admissions for Session 2026-2027 are currently OPEN! You can apply directly through our online Admissions form. Free inquiry and registration are available. Phone: ${phone}.`;
    }

    if (q.includes('fee') || q.includes('fees') || q.includes('kharacha') || q.includes('charges') || q.includes('cost') || q.includes('scholarship')) {
      return "Girls Academy Monthly Tuition Fees:\n• Primary (Class 1-5): Rs. 3,000 / month\n• Middle (Class 6-8): Rs. 3,500 / month\n• Matric (Science/Arts): Rs. 4,000 - 4,500 / month\n• Intermediate (FSc / ICS / I.Com): Rs. 4,500 - 5,500 / month\n\nUp to 50% merit scholarships are available for high-achieving students!";
    }

    if (q.includes('timing') || q.includes('time') || q.includes('auqat') || q.includes('schedule') || q.includes('chutti') || q.includes('subah')) {
      return "Girls Academy Campus Timings:\n• Regular Classes: Monday to Friday from 8:00 AM to 2:00 PM\n• Saturday: Tutorial & Mentorship Sessions from 9:00 AM to 1:00 PM\n• Sunday: Closed.";
    }

    if (q.includes('course') || q.includes('program') || q.includes('subject') || q.includes('matric') || q.includes('fsc') || q.includes('ics') || q.includes('icom') || q.includes('class')) {
      return "We offer comprehensive academic programs:\n1. Matriculation: Science Group (Biology / Computer) & Arts/Commerce Groups\n2. Intermediate: FSc Pre-Medical, FSc Pre-Engineering, ICS (Computer Science), and I.Com\n3. Middle & Primary Wing with female-supervised environment.";
    }

    if (q.includes('address') || q.includes('location') || q.includes('kahan') || q.includes('sector') || q.includes('place')) {
      return `Girls Academy is located at Street 5, Sector G-11/2, Islamabad. We provide safe, GPS-monitored pick and drop van service across Islamabad and Rawalpindi.`;
    }

    if (q.includes('transport') || q.includes('van') || q.includes('bus') || q.includes('pick') || q.includes('drop')) {
      return "Yes! Dedicated, GPS-tracked van service with female attendants is available across all sectors of Islamabad and Rawalpindi for student safety.";
    }

    if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('rabta') || q.includes('whatsapp') || q.includes('email')) {
      return `Official Contact Details:\n• Phone: ${phone}\n• WhatsApp: 0300-4861234\n• Email: info@girlsacademy.edu.pk\n• Campus: Sector G-11/2, Islamabad.`;
    }

    if (q.includes('result') || q.includes('exam') || q.includes('board') || q.includes('bise') || q.includes('marks')) {
      return "Girls Academy celebrated top BISE 2025 positions with a 98% pass rate! Registered students and parents can view official marksheets through the portal.";
    }

    // Default polite response
    return `Thank you for your question! Girls Academy offers Primary, Middle, Matric, and Intermediate programs. Admissions for 2026-2027 are open. You can call us directly at ${phone} or apply online!`;
  };

  const processQuery = async (queryText: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: time,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Call server API powered by Gemini
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          history: messages.map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      let botAnswer = '';
      if (response.ok) {
        const data = await response.json();
        botAnswer = data.reply || generateLocalResponse(queryText);
      } else {
        botAnswer = generateLocalResponse(queryText);
      }

      const lowerAns = botAnswer.toLowerCase();
      const showAdmissions = lowerAns.includes('admiss') || lowerAns.includes('apply') || lowerAns.includes('dakhla');
      const showCourses = lowerAns.includes('course') || lowerAns.includes('matric') || lowerAns.includes('fsc') || lowerAns.includes('ics');

      const botMsg: ChatMessage = {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: botAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showLinkToAdmissions: showAdmissions,
        showLinkToCourses: showCourses,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('API error, falling back to local responder:', err);
      const fallbackText = generateLocalResponse(queryText);
      const botMsg: ChatMessage = {
        id: `b-${Date.now() + 1}`,
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showLinkToAdmissions: fallbackText.toLowerCase().includes('admiss'),
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query || isTyping) return;
    setInputText('');
    processQuery(query);
  };

  const handleSelectFaq = (questionText: string) => {
    if (isTyping) return;
    processQuery(questionText);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: botConfig.welcome_message || 'Welcome to Girls Academy Islamabad! How can I assist you today? Feel free to ask about admissions, courses, or fees.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  // Quick suggestion prompts
  const quickQuestions = [
    { label: 'Apply for Admission', query: 'How can I apply for admission 2026-2027?' },
    { label: 'Fee Structure', query: 'What is the monthly fee structure for all classes?' },
    { label: 'Campus Timings', query: 'What are the daily campus timings and schedule?' },
    { label: 'Programs & Groups', query: 'Which programs and groups are offered (Matric, FSc, ICS)?' },
    { label: 'Transport Facility', query: 'Is pick and drop van transport available for girls?' },
    { label: 'Contact & Location', query: 'What is your campus address and phone number?' },
  ];

  return (
    <div className={`fixed bottom-6 ${positionClass} z-40 font-['Poppins',sans-serif]`}>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{ backgroundColor: botConfig.primary_color || '#7c3aed' }}
          className="relative group p-4 rounded-full text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center border border-white/20"
          aria-label="Open Academy Assistant Chat"
          title={`${botConfig.bot_name || 'GA AI Assistant'}`}
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0f0f14]"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[410px] h-[550px] max-h-[85vh] bg-[#161625] border border-[#2a2a3e] rounded-3xl shadow-2xl shadow-purple-950/60 flex flex-col overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div 
            style={{ backgroundColor: botConfig.primary_color || '#7c3aed' }}
            className="p-4 flex items-center justify-between text-white border-b border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold tracking-wide flex items-center gap-1.5">
                  {botConfig.bot_name || 'GA AI Advisor'}
                  <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30"></span>
                </h4>
                <p className="text-[11px] text-white/80">Girls Academy 24/7 AI Support</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                title="Restart Conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                title="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#12121e]/90 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`max-w-[82%] rounded-2xl p-3 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-xs'
                    : 'bg-[#1e1e30] border border-[#2a2a3e] text-slate-200 rounded-bl-xs'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  
                  {/* Action buttons embedded in message */}
                  {(msg.showLinkToAdmissions || msg.showLinkToCourses) && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-2">
                      {msg.showLinkToAdmissions && (
                        <Link
                          to="/admissions"
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/25 hover:bg-purple-500/40 text-purple-200 hover:text-white border border-purple-500/40 font-medium transition-colors text-[11px]"
                        >
                          <span>Apply Online Now</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                      {msg.showLinkToCourses && (
                        <Link
                          to="/courses"
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 hover:text-white border border-pink-500/30 font-medium transition-colors text-[11px]"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>View Courses</span>
                        </Link>
                      )}
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-purple-200/70' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#1e1e30] border border-[#2a2a3e] rounded-2xl px-4 py-2.5 rounded-bl-xs text-slate-300 flex items-center gap-2">
                  <span className="text-[11px] text-purple-300 font-medium">GA Advisor is typing</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Suggestions */}
            {messages.length <= 3 && !isTyping && (
              <div className="pt-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Suggested Questions:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectFaq(q.query)}
                      className="text-left px-2.5 py-1.5 rounded-xl bg-[#19192b] hover:bg-purple-600/20 border border-[#2a2a3e] hover:border-purple-500/40 text-slate-300 hover:text-white text-[11px] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#2a2a3e] bg-[#161625] flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything (English, Roman Urdu)..."
              disabled={isTyping}
              className="flex-1 bg-[#12121e] border border-[#2a2a3e] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              style={{ backgroundColor: botConfig.primary_color || '#7c3aed' }}
              className="px-3.5 py-2.5 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
