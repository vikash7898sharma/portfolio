import { Link } from 'react-router-dom';
import { ExternalLink, Github, Eye, Star, Clock, CheckCircle } from 'lucide-react';

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-emerald-400', label: 'Completed' },
  'in-progress': { icon: Clock, color: 'text-amber-400', label: 'In Progress' },
};

export default function ProjectCard({ project, portfolioSlug, index = 0 }) {
  const status = statusConfig[project.status] || statusConfig.completed;
  const StatusIcon = status.icon;
  const thumbnail = project.screenshots?.[0];

  return (
    <div
      className="group glass-card overflow-hidden hover:border-primary/30 transition-all"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="relative h-48 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-300 to-dark-400 flex items-center justify-center">
            <Star className="w-12 h-12 text-gray-600" />
          </div>
        )}

        {project.featured && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3" />
            Featured
          </div>
        )}

        <div className={`absolute top-3 right-3 px-2 py-1 rounded bg-dark/80 backdrop-blur-sm text-xs font-medium flex items-center gap-1 ${status.color}`}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded bg-white/10 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/20"
            >
              <Github className="w-4 h-4" />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded bg-primary/80 backdrop-blur-sm text-white text-xs font-medium hover:bg-primary"
            >
              <ExternalLink className="w-4 h-4" />
              Live
            </a>
          )}
        </div>
      </div>

      <Link to={`/portfolio/${portfolioSlug}/project/${project._id}`}>
        <div className="p-5">
          <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {project.description || 'A showcase of modern development skills.'}
          </p>

          {project.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.techStack.slice(0, 5).map(tech => (
                <span key={tech} className="px-2 py-0.5 rounded bg-dark-400 text-gray-300 text-xs">
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
          </div>
        </div>
      </Link>
    </div>
  );
}
