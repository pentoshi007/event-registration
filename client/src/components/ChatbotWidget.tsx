import React, { useState, useRef, useEffect } from 'react';

const CHATBOT_IMAGE = 'https://cdn.pixabay.com/photo/2017/01/31/20/40/calendar-2027122_960_720.png';
const BOT_AVATAR = 'https://randomuser.me/api/portraits/women/44.jpg'; // Generic avatar

const FAQS = [
  // Event registration Q&A
  { q: 'how to register', a: 'To register for an event, click on the event you are interested in and then click the "Register" button. Fill in your details and submit the form.' },
  { q: 'is registration free', a: 'Some events are free, while others may have a registration fee. Please check the event details for pricing information.' },
  { q: 'confirmation', a: 'After successful registration, you will receive a confirmation email with your ticket and event details.' },
  { q: 'cancel', a: 'To cancel your registration, please contact our support team or check your email for a cancellation link if provided.' },
  { q: 'forget my ticket', a: 'If you forget your ticket, check your email for the confirmation message. You can also contact support for help.' },
  // General conversation Q&A
  { q: 'hi', a: 'Hello! How can I help you today?' },
  { q: 'hello', a: 'Hi there! How can I assist you?' },
  { q: 'hey', a: 'Hey! How can I help you?' },
  { q: 'how are you', a: 'I am just a bot, but I am here to help you with event registration!' },
  { q: 'who are you', a: 'I am the Eventinity chatbot, here to assist you with your queries.' },
  { q: 'what can you do', a: 'I can help you with event registration questions, guide you through the process, and answer common queries.' },
  { q: 'thank you', a: 'You’re welcome! If you have more questions, just ask.' },
  { q: 'thanks', a: 'Glad to help! Let me know if you need anything else.' },
  { q: 'bye', a: 'Goodbye! Have a great day and enjoy your events!' },
  { q: 'goodbye', a: 'See you next time! If you need help, just open the chat again.' },
];

const ChatbotWidget: React.FC = () => {
  const initialMessages = [
    { from: 'bot', text: 'Hello! How can I help you?' }
  ];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Close chat if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Reset chat when closed
  useEffect(() => {
    if (!open) {
      setMessages(initialMessages);
      setInput('');
    }
  }, [open]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg) return;
    setMessages((msgs) => [...msgs, { from: 'user', text: userMsg }]);
    setInput('');
    // Find answer
    const found = FAQS.find(faq => userMsg.toLowerCase().includes(faq.q));
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: found ? faqAnswer(found) : "Sorry, I don't have an answer for that. Please contact support or try rephrasing your question." }
      ]);
    }, 600);
  }

  function faqAnswer(faq: {q: string, a: string}) {
    return faq.a;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div ref={chatRef} className="mb-3 w-80 max-w-xs bg-white rounded-3xl shadow-2xl border border-blue-200 animate-fade-in flex flex-col overflow-hidden" style={{height: 480, minWidth: 340, maxWidth: 370}}>
          {/* Header */}
          <div className="relative">
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-t-3xl">
              <img src={BOT_AVATAR} alt="Bot Avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" />
              <div className="flex flex-col">
                <span className="font-semibold text-lg leading-tight">Eventinity Assistant</span>
                <span className="text-xs text-blue-100">We are online!</span>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-white hover:text-blue-200 text-2xl font-bold bg-transparent">&times;</button>
            </div>
          </div>
          {/* Chat area */}
          <div className="flex-1 px-4 py-3 text-gray-700 text-sm overflow-y-auto bg-white" style={{ minHeight: 120 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' && (
                  <img src={BOT_AVATAR} alt="Bot Avatar" className="w-7 h-7 rounded-full mr-2 border border-blue-200 object-cover self-end" />
                )}
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] shadow-sm ${msg.from === 'user' ? 'bg-blue-600 text-white rounded-br-2xl rounded-tr-2xl' : 'bg-gray-100 text-gray-900 rounded-bl-2xl rounded-tl-2xl'}`}>{msg.text}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          {/* Input area */}
          <form className="px-4 py-3 border-t border-blue-100 bg-blue-50 flex gap-2 items-center" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Enter your message..."
              className="flex-1 px-4 py-2 rounded-2xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base bg-white shadow-sm"
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus={open}
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-11 h-11 rounded-full flex items-center justify-center text-2xl shadow-md transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 p-0 bg-transparent border-none"
        aria-label="Open Chatbot"
        style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.15)' }}
      >
        <div 
          style={{ 
            width: 64, 
            height: 64, 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '3px solid #e0e7ff', 
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={CHATBOT_IMAGE}
            alt="Chatbot Calendar"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        </div>
      </button>
    </div>
  );
};

export default ChatbotWidget; 