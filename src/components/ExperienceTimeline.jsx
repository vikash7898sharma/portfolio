import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Code, Calendar } from 'lucide-react';

const typeConfig = {
  work: { icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Work' },
  education: { icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Education' },
  freelance: { icon: Code, color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'Freelance' },
};

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ExperienceTimeline({ experiences }) {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No experience added yet.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent" />

      <div className="space-y-8">
        {experiences.map((exp, index) => {
          const config = typeConfig[exp.type] || typeConfig.work;
          const Icon = config.icon;

          return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative pl-12 md:pl-16"
            >
              {/* Timeline Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                className={`absolute left-2 md:left-6 top-2 w-4 h-4 rounded-full ${config.bg} border-2 ${index === 0 ? 'border-primary' : 'border-gray-600'}`}
              >
                <div className="absolute inset-1 rounded-full bg-current" />
              </motion.div>

              {/* Card */}
              <motion.div
                whileHover={{ x: 5 }}
                className="glass-card p-6 hover:border-primary/30 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-white">
                      {exp.role || 'Position'}
                    </h3>
                    <p className="text-gray-400">{exp.company || 'Company'}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(exp.start_date)} - {exp.current ? 'Present' : formatDate(exp.end_date)}
                  </span>
                </div>

                {/* Description */}
                {exp.description && (
                  <p className="text-gray-300 text-sm mb-4">{exp.description}</p>
                )}

                {/* Tech Used */}
                {exp.tech_used?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.tech_used.map(tech => (
                      <span key={tech} className="px-2 py-1 rounded-md bg-dark-400 text-gray-300 text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
