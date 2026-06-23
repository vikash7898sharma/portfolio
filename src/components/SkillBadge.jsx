import { motion } from 'framer-motion';

const colors = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-amber-500',
  'from-indigo-500 to-violet-500',
];

export default function SkillBadge({ name, level, index = 0, showLevel = true, size = 'md' }) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-3 py-1 text-sm gap-2',
    lg: 'px-4 py-1.5 text-base gap-2.5',
  };

  const colorIndex = name.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center rounded-lg ${sizes[size]} bg-dark-400/50 border border-dark-400 hover:border-primary/50 transition-colors`}
    >
      {/* Skill Icon */}
      <div
        className={`w-5 h-5 rounded bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
      >
        {name.charAt(0).toUpperCase()}
      </div>

      {/* Name */}
      <span className="font-medium text-white">{name}</span>

      {/* Level */}
      {showLevel && level !== undefined && (
        <span
          className={`px-1.5 py-0.5 rounded bg-gradient-to-br ${color} text-white text-xs font-bold`}
        >
          {level}%
        </span>
      )}
    </motion.div>
  );
}
