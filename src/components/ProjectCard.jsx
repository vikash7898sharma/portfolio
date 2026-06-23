import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Eye, Star, Clock, CheckCircle } from 'lucide-react';

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-emerald-400', label: 'Completed' },
  'in-progress': { icon: Clock, color: 'text-amber-400', label: 'In Progress' },
};

export default function ProjectCard({ project, portfolioSlug = 'my-portfolio', index = 0 }) {
  const status = statusConfig[project.status] || statusConfig.completed;
  const StatusIcon = status.icon;
  const thumbnail = project.screenshots?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group glass-card overflow-hidden hover:border-primary/30 transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        {thumbnail ? (
          <motion.img
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            src={thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-300 to-dark-400 flex items-center justify-center">
            <Star className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {project.featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium flex items-center gap-1"
          >
            <Star className="w-3 h-3" />
            Featured
          </motion.div>
        )}

        <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg bg-dark/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1 ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/20 transition-colors"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-primary/80 backdrop-blur-sm text-white text-xs font-medium hover:bg-primary transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </a>
          )}
        </motion.div>
      </div>

      <Link to={`/project/${project.id}`}>
        <div className="p-5">
          <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {project.description || 'A showcase of modern development skills.'}
          </p>

          {project.tech_stack?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tech_stack.slice(0, 5).map(tech => (
                <span key={tech} className="px-2 py-0.5 rounded-md bg-dark-400 text-gray-300 text-xs">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-dark-400">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Eye className="w-4 h-4" />
              <span>{project.views?.toLocaleString() || 0} views</span>
            </div>
            {project.tags?.length > 0 && (
              <div className="flex gap-1">
                {project.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
