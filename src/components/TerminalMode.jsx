import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Github, Linkedin, Twitter, Globe, Loader2 } from 'lucide-react';
import { getPortfolio, getProjects, aiChat } from '../services/api';

const ASCII_ART = `
  _____      _             _ _
 |_   _|    (_)           (_) |
   | | _ __  _  ___  ___   _| |_
   | || '_ \\| |/ _ \\/ __| | | __|
  _| || | | | |  __/\\__ \\_| | |_
  \\___/_| |_|_|\\___||___(_)_|\\__|
`;

const EASTER_EGG = `
  ╔════════════════════════════════════╗
  ║                                    ║
  ║   ╭───────────────────────────╮   ║
  ║   │  (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧           │   ║
  ║   │                           │   ║
  ║   │  Making you happy mode... │   ║
  ║   │  ======================= │   ║
  ║   │  ████████████████ 100%   │   ║
  ║   ╰───────────────────────────╯   ║
  ║                                    ║
  ║   You're awesome! Keep coding! 🚀  ║
  ║                                    ║
  ╚════════════════════════════════════╝
`;

export default function TerminalMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const loadData = async () => {
    try {
      const [portfolioData, projectsData] = await Promise.all([
        getPortfolio(),
        getProjects(),
      ]);
      setPortfolio(portfolioData);
      setProjects(projectsData || []);
    } catch (error) {
      console.error('Failed to load terminal data:', error);
    }
  };

  const typewriterEffect = async (text, delay = 10) => {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setHistory((prev) => {
            const newHistory = [...prev];
            const lastIndex = newHistory.length - 1;
            if (lastIndex >= 0 && newHistory[lastIndex].typing) {
              newHistory[lastIndex].content += text[i];
            }
            return newHistory;
          });
          i++;
        } else {
          clearInterval(interval);
          setHistory((prev) => {
            const newHistory = [...prev];
            const lastIndex = newHistory.length - 1;
            if (lastIndex >= 0) {
              newHistory[lastIndex].typing = false;
            }
            return newHistory;
          });
          resolve();
        }
      }, delay);
    });
  };

  const addOutput = (content, type = 'output') => {
    setHistory((prev) => [...prev, { type, content, typing: false }]);
  };

  const addTypingOutput = (content) => {
    setHistory((prev) => [...prev, { type: 'output', content: '', typing: true }]);
    return typewriterEffect(content);
  };

  const handleCommand = useCallback(async (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const args = trimmedCmd.split(' ');
    const command = args[0];

    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    switch (command) {
      case 'help':
        addOutput(`
Available commands:
  help          - Show this help message
  projects      - List all projects
  skills        - Show skills with bar visualization
  contact       - Display social links
  whoami        - Show portfolio owner info
  ai <query>    - Ask AI a question
  clear         - Clear terminal
  banner        - Show ASCII banner
  matrix        - Enter the matrix
  exit          - Close terminal (or press Ctrl+\`)
        `);
        break;

      case 'projects':
        if (projects.length === 0) {
          addOutput('No projects found.');
        } else {
          const projectList = projects
            .map((p, i) => `  ${i + 1}. ${p.title} - ${p.description || 'No description'}`)
            .join('\n');
          addOutput(`\nProjects (${projects.length}):\n${projectList}\n`);
        }
        break;

      case 'skills':
        if (!portfolio?.skills?.length) {
          addOutput('No skills found. Add skills in the portfolio builder.');
        } else {
          const skillsOutput = portfolio.skills
            .map((s) => {
              const bar = '█'.repeat(Math.floor((s.level || 50) / 10)) + '░'.repeat(10 - Math.floor((s.level || 50) / 10));
              return `  ${s.name?.padEnd(15)} [${bar}] ${s.level || 50}%`;
            })
            .join('\n');
          addOutput(`\nSkills:\n${skillsOutput}\n`);
        }
        break;

      case 'contact':
        const links = [];
        if (portfolio?.github_url) links.push(`  GitHub:   ${portfolio.github_url}`);
        if (portfolio?.linkedin_url) links.push(`  LinkedIn: ${portfolio.linkedin_url}`);
        if (portfolio?.twitter_url) links.push(`  Twitter:  ${portfolio.twitter_url}`);
        if (portfolio?.website_url) links.push(`  Website:  ${portfolio.website_url}`);
        if (links.length === 0) {
          addOutput('No contact links found.');
        } else {
          addOutput(`\nContact:\n${links.join('\n')}\n`);
        }
        break;

      case 'whoami':
        addOutput(`
  Name:  ${portfolio?.name || 'Developer'}
  Title: ${portfolio?.title || 'Software Developer'}
  Bio:   ${portfolio?.bio || 'Building amazing things with code.'}
        `);
        break;

      case 'ai':
        const query = args.slice(1).join(' ');
        if (!query) {
          addOutput('Usage: ai <your question>');
          break;
        }
        setLoading(true);
        addOutput(`\n> Asking AI: "${query}"...`);
        try {
          const response = await aiChat(null, query, []);
          addOutput(`\n${response.reply || 'No response received.'}\n`);
        } catch (error) {
          addOutput('\nError: Could not reach AI. Please try again.\n');
        } finally {
          setLoading(false);
        }
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'banner':
        addOutput(ASCII_ART);
        break;

      case 'matrix':
        addOutput('\nEntering the matrix...\n');
        addOutput(EASTER_EGG);
        break;

      case 'sudo':
        if (trimmedCmd === 'sudo make me happy') {
          addOutput(EASTER_EGG);
        } else {
          addOutput('\nPermission denied: You are not root! 👀\n');
        }
        break;

      case 'exit':
        setIsOpen(false);
        break;

      default:
        addOutput(`\nCommand not found: ${command}\nType 'help' for available commands.\n`);
    }
  }, [portfolio, projects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    addOutput(`$ ${input}`, 'input');
    handleCommand(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl h-[80vh] bg-dark-500 rounded-2xl border border-dark-400 overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-dark-400 border-b border-dark-400">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-300 font-mono">terminal@portfolio</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Terminal Output */}
            <div
              ref={terminalRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-sm scrollbar-thin"
            >
              {/* Welcome Banner */}
              {history.length === 0 && (
                <div className="text-gray-400 mb-4">
                  <pre className="text-primary text-xs whitespace-pre">{ASCII_ART}</pre>
                  <p className="mt-4">
                    Welcome to Terminal Mode! Type{' '}
                    <span className="text-primary">'help'</span> for available commands.
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Press Ctrl+` to toggle terminal
                  </p>
                </div>
              )}

              {/* History */}
              {history.map((item, index) => (
                <div
                  key={index}
                  className={`whitespace-pre-wrap ${
                    item.type === 'input' ? 'text-emerald-400' : 'text-gray-300'
                  }`}
                >
                  {item.content}
                  {item.typing && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-primary"
                    >
                      ▋
                    </motion.span>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 bg-dark-400 border-t border-dark-400"
            >
              <span className="text-emerald-400 font-mono">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder="Enter command..."
                className="flex-1 bg-transparent text-gray-200 font-mono text-sm focus:outline-none placeholder-gray-600"
                autoComplete="off"
                spellCheck="false"
              />
              <span className="text-gray-500 text-xs">Ctrl+` to close</span>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
