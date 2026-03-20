'use client'

import { motion } from 'framer-motion'

interface WhatsAppMessage {
  sender: 'user' | 'secretary'
  text: string
  time?: string
  buttons?: { label: string; action?: string }[]
}

interface WhatsAppChatProps {
  messages: WhatsAppMessage[]
  className?: string
}

export function WhatsAppChat({ messages, className = '' }: WhatsAppChatProps) {
  return (
    <div className={`bg-[#ECE5DD] rounded-2xl overflow-hidden shadow-xl ${className}`}>
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <div className="flex-1">
          <div className="text-white font-medium">Secretary</div>
          <div className="text-[#A8D8CB] text-xs">en línea</div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-3 min-h-[200px]">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.3, duration: 0.4 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.sender === 'user'
                  ? 'bg-[#DCF8C6] rounded-tr-sm'
                  : 'bg-white rounded-tl-sm shadow-sm'
              }`}
            >
              <p className="text-[#111] text-sm whitespace-pre-line">{msg.text}</p>
              
              {msg.buttons && msg.sender === 'secretary' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.buttons.map((btn, j) => (
                    <motion.button
                      key={j}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#128C7E] text-white text-xs px-4 py-2 rounded-lg"
                    >
                      {btn.label}
                    </motion.button>
                  ))}
                </div>
              )}
              
              {msg.time && (
                <div className={`text-[10px] text-[#667781] mt-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  {msg.time}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
