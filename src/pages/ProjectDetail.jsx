import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowLeft, Eye, Calendar, Youtube, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { getProject, getProjects, trackProjectClick } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import AIChatbot from '../components/AIChatbot';
import MediaLightbox from '../components/MediaLightbox';
import ReactMarkdown from 'react-markdown';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const projectData = await getProject(id);
      setProject(projectData);

      const allProjects = await getProjects();
      const related = allProjects
        .filter(p => p.id !== id && p.tech_stack?.some(t => projectData.tech_stack?.includes(t)))
        .slice(0, 3);
      setRelatedProjects(related);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExternalClick = async (type) => {
    if (project?.id) {
      await trackProjectClick(project.id, type);
    }
  };

  const openLightbox = (index) => {
    setCurrentMediaIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center glass-card p-12">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-8">The project doesn't exist.</p>
          <Link to="/portfolio" className="btn-primary">Go to Portfolio</Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    completed: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Completed' },
    'in-progress': { color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'In Progress' },
  };

  const status = statusConfig[project.status] || statusConfig.completed;

  const mediaItems = project.screenshots?.map(url => ({ type: 'image', url })) || [];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 h-96 bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Portfolio
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${status.color} ${status.bg}`}>
                    {status.label}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 rounded-lg text-sm font-medium text-amber-400 bg-amber-400/10">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
                  {project.title}
                </h1>
                {project.description && (
                  <p className="text-xl text-gray-400">{project.description}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalClick('github')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 text-white hover:bg-dark-300 transition-colors"
                  >
                    <Github className="w-4 h-4" /> Code
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalClick('live')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
                {project.youtube_url && (
                  <a
                    href={project.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleExternalClick('youtube')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Youtube className="w-4 h-4" /> Video
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{project.views?.toLocaleString() || 0} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Screenshots Gallery */}
              {project.screenshots?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6"
                >
                  <h2 className="font-display font-semibold text-lg text-white mb-4">
                    Screenshots
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.screenshots.map((screenshot, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openLightbox(index)}
                        className="relative aspect-video rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <img
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-white" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Long Description / README */}
              {project.long_description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6"
                >
                  <h2 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    About This Project
                  </h2>
                  <div className="prose prose-invert max-w-none text-gray-300">
                    <ReactMarkdown>{project.long_description}</ReactMarkdown>
                  </div>
                </motion.div>
              )}

              {/* Build Timeline */}
              {project.build_timeline?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-6"
                >
                  <h2 className="font-display font-semibold text-lg text-white mb-4">
                    Build Timeline
                  </h2>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent" />
                    <div className="space-y-6">
                      {project.build_timeline.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative pl-10"
                        >
                          <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-primary border-2 border-dark" />
                          <div className="text-sm text-gray-400 mb-1">{item.date}</div>
                          <h4 className="font-medium text-white">{item.step}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Related Projects */}
              {relatedProjects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-6"
                >
                  <h2 className="font-display font-semibold text-lg text-white mb-4">
                    Related Projects
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedProjects.map((p) => (
                      <Link
                        key={p.id}
                        to={`/project/${p.id}`}
                        className="group flex gap-3 p-3 rounded-lg hover:bg-dark-400 transition-colors"
                      >
                        {p.screenshots?.[0] ? (
                          <img
                            src={p.screenshots[0]}
                            alt={p.title}
                            className="w-16 h-12 rounded object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded bg-dark-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <h4 className="font-medium text-white text-sm group-hover:text-primary transition-colors truncate">
                            {p.title}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {p.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 sticky top-24"
              >
                <h2 className="font-display font-semibold text-lg text-white mb-4">
                  Tech Stack
                </h2>
                {project.tech_stack?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech, index) => (
                      <SkillBadge key={tech} name={tech} index={index} showLevel={false} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No tech stack specified.</p>
                )}
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h2 className="font-display font-semibold text-lg text-white mb-4">
                  Engagement
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">GitHub Clicks</span>
                    <span className="text-white font-medium">{project.clicks_github || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Live Demo Clicks</span>
                    <span className="text-white font-medium">{project.clicks_live || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">YouTube Clicks</span>
                    <span className="text-white font-medium">{project.clicks_youtube || 0}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chatbot */}
      <AIChatbot projectId={project.id} projectTitle={project.title} />

      {/* Media Lightbox */}
      <MediaLightbox
        items={mediaItems}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        currentIndex={currentMediaIndex}
        setCurrentIndex={setCurrentMediaIndex}
      />
    </div>
  );
}
