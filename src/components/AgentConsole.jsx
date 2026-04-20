import React, { useEffect, useRef } from 'react';
import { MessageSquare, Zap, User, Send } from 'lucide-react';
import PropTypes from 'prop-types';

const QUICK_ACTIONS = [
  'Status of Gate A',
  'Show Congestion',
  'Confirm action',
  'Full status report',
];

/**
 * AgentConsole - AI-powered chat interface for operator communication with Synchra.
 * Supports simulated AI response with typing indicator and quick action chips.
 * @param {Array} messages - Chat message history
 * @param {boolean} isTyping - Whether Synchra is generating a response
 * @param {string} input - Current input field value
 * @param {Function} setInput - Input setter
 * @param {Function} onSend - Form submit handler
 * @param {Function} onQuickAction - Quick action chip click handler
 */
function AgentConsole({ messages, isTyping, input, setInput, onSend, onQuickAction }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <section
      className="glass-card agent-console"
      aria-label="Synchra Agent Console"
    >
      <div className="card-header">
        <div className="card-title">
          <MessageSquare size={20} color="var(--accent-purple)" aria-hidden="true" />
          Agent Console
        </div>
      </div>

      <div
        className="console-messages"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Agent conversation history"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role} fade-in`}>
            <div className="avatar" aria-hidden="true">
              {msg.role === 'synchra' ? <Zap size={18} /> : <User size={18} />}
            </div>
            <div className="msg-content">
              <span className="sr-only">
                {msg.role === 'synchra' ? 'Synchra: ' : 'Operator: '}
              </span>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div
            className="message synchra fade-in"
            role="status"
            aria-label="Synchra is composing a response"
          >
            <div className="avatar" aria-hidden="true">
              <Zap size={18} />
            </div>
            <div className="msg-content" style={{ padding: '4px 8px' }}>
              <div className="typing-indicator" aria-hidden="true">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div
          className="quick-actions"
          role="group"
          aria-label="Quick action suggestions"
        >
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              type="button"
              className="action-chip"
              onClick={() => onQuickAction(action)}
              aria-label={`Quick action: ${action}`}
            >
              {action}
            </button>
          ))}
        </div>

        <form
          className="console-input"
          onSubmit={onSend}
          aria-label="Send command to Synchra"
        >
          <label htmlFor="synchra-cmd-input" className="sr-only">
            Type a command or question for Synchra
          </label>
          <input
            id="synchra-cmd-input"
            type="text"
            placeholder="Command Synchra or ask..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            aria-disabled={isTyping}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isTyping}
            aria-label="Send message to Synchra"
            title="Send message"
          >
            <Send size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  );
}

AgentConsole.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.oneOf(['synchra', 'operator']).isRequired,
      content: PropTypes.string.isRequired,
    })
  ).isRequired,
  isTyping: PropTypes.bool.isRequired,
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  onQuickAction: PropTypes.func.isRequired,
};

export default AgentConsole;
