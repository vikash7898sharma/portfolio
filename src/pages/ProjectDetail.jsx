import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowLeft, Eye, Calendar } from 'lucide-react';
import { getProject } from '../services/project';
import { trackEvent } from '../services/analytics';
import SkillBadge from '../components/SkillBadge';

export default function ProjectDetail() {
  const { slug, id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const res = await getProject(id);
      setProject(res.data);
      if (res.data?.portfolio?._id) {
        trackEvent(res.data.portfolio._id, 'view', id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-8">The project doesn't exist.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const statusColors = {
    completed: 'text-emerald-400 bg-emerald-400/10',
    'in-progress': 'text-amber-400 bg-amber-400/10',
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 h-96 bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <Link to={`/portfolio/${slug}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>

          <div className="glass-card p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColors[project.status] || statusColors.completed}`}>
                    {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Completed'}
                  </span>
                  {project.featured && (
                    <span className="px-3 py-1 rounded-lg text-sm font-medium text-amber-400 bg-amber-400/10">
                      Featured
                    </span>
                  )}
                </div>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">{project.title}</h1>
                {project.description && <p className="text-xl text-gray-400">{project.description}</p>}
              </div>

              <div className="flex gap-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-400 text-white hover:bg-dark-300 transition-colors">
                    <Github className="w-4 h-4" /> Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors">
                    <ExternalLink className="w-4 h-4" /> Live Demo
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{project.views?.toLocaleString() || 0} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Screenshots */}
              {project.screenshots?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="font-display font-semibold text-lg text-white mb-4">Screenshots</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.screenshots.map((screenshot, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                        <img src={screenshot} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Long Description */}
              {project.longDescription && (
                <div className="glass-card p-6">
                  <h2 className="font-display font-semibold text-lg text-white mb-4">About This Project</h2>
                  <div className="prose prose-invert max-w-none text-gray-300">
                    <p>{project.longDescription}</p>
                  </div>
                </div>
              )}

              {/* AI Summary */}
              {project.aiSummary && (
                <div className="glass-card p-6 border-primary/30">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <span className="font-semibold text-white">Summary</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{project.aiSummary}</p>
                </div>
              )}

              {/* Build Timeline */}
              {project.buildTimeline?.length > 0 && (
                <div className="glass-card p-6">
                  <h2 className="font-display font-semibold text-lg text-white mb-4">Build Timeline</h2>
                  <div className="space-y-4">
                    {project.buildTimeline.map((item, index) => (
                      <div key={index} className="relative pl-8 border-l-2 border-dark-400">
                        <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-primary" />
                        <div className="text-sm text-gray-400 mb-1">{item.date}</div>
                        <h4 className="font-medium text-white">{item.step}</h4>
                        <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass-card p-6 sticky top-24">
                <h2 className="font-display font-semibold text-lg text-white mb-4">Tech Stack</h2>
                {project.techStack?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, index) => (
                      <SkillBadge key={tech} name={tech} level={undefined} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No tech stack specified.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
