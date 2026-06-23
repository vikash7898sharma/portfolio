import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Terminal, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center max-w-lg"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <span className="font-display font-bold text-[150px] md:text-[200px] leading-none gradient-text">
            404
          </span>
        </motion.div>

        {/* Terminal Style Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8 font-mono text-left"
        >
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-400">terminal</span>
          </div>
          <div className="text-sm">
            <span className="text-emerald-400">$</span>{' '}
            <span className="text-gray-300">navigate --to page</span>
            <br />
            <span className="text-red-400">Error:</span>{' '}
            <span className="text-gray-400">Page not found</span>
            <br />
            <span className="text-emerald-400">$</span>{' '}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-primary"
            >
              _
            </motion.span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display font-bold text-2xl text-white mb-4"
        >
          Lost in the Matrix
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 mb-8"
        >
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            to="/portfolio"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            View Portfolio
          </Link>
        </motion.div>

        {/* Keyboard Shortcut Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-gray-600"
        >
          Pro tip: Press <kbd className="px-2 py-1 rounded bg-dark-400 text-gray-400 font-mono">Ctrl</kbd> + <kbd className="px-2 py-1 rounded bg-dark-400 text-gray-400 font-mono">`</kbd> to open terminal mode
        </motion.p>
      </motion.div>
    </div>
  );
}
