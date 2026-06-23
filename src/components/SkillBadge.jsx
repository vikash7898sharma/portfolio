export default function SkillBadge({ name, level, size = 'md' }) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const colors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-amber-500',
    'from-indigo-500 to-violet-500',
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg ${sizes[size]} bg-dark-400/50 border border-dark-400 hover:border-primary/50 transition-colors`}>
      <div className={`w-5 h-5 rounded bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold`}>
        {name.charAt(0).toUpperCase()}
      </div>
      <span className="font-medium text-white">{name}</span>
      {level !== undefined && (
        <span className={`px-1.5 py-0.5 rounded bg-gradient-to-br ${color} text-white text-xs font-bold`}>
          {level}%
        </span>
      )}
    </div>
  );
}
