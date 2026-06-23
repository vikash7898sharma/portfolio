import { supabase, PORTFOLIO_ID } from '../lib/supabase';

// Portfolio Services
export const getPortfolio = async () => {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', PORTFOLIO_ID)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const upsertPortfolio = async (portfolioData) => {
  const { data, error } = await supabase
    .from('portfolios')
    .upsert({
      id: PORTFOLIO_ID,
      ...portfolioData,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Project Services
export const getProjects = async (filters = {}) => {
  let query = supabase
    .from('projects')
    .select('*')
    .eq('portfolio_id', PORTFOLIO_ID)
    .order('created_at', { ascending: false });

  if (filters.tag) query = query.contains('tags', [filters.tag]);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.featured) query = query.eq('featured', filters.featured === 'true');

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getProject = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;

  // Increment views
  await supabase
    .from('projects')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', id);

  return { ...data, views: (data.views || 0) + 1 };
};

export const createProject = async (projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      portfolio_id: PORTFOLIO_ID,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProject = async (id, projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...projectData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteProject = async (id) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const trackProjectClick = async (id, type) => {
  const field = `clicks_${type}`;
  const { data: project } = await supabase
    .from('projects')
    .select(field)
    .eq('id', id)
    .single();

  if (project) {
    await supabase
      .from('projects')
      .update({ [field]: (project[field] || 0) + 1 })
      .eq('id', id);
  }
};

// Experience Services
export const getExperiences = async () => {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('portfolio_id', PORTFOLIO_ID)
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createExperience = async (expData) => {
  const { data, error } = await supabase
    .from('experiences')
    .insert({
      ...expData,
      portfolio_id: PORTFOLIO_ID,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateExperience = async (id, expData) => {
  const { data, error } = await supabase
    .from('experiences')
    .update(expData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteExperience = async (id) => {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// Analytics Services
export const trackAnalytics = async (event, projectId = null) => {
  await supabase
    .from('analytics')
    .insert({
      portfolio_id: PORTFOLIO_ID,
      project_id: projectId,
      event,
      user_agent: navigator.userAgent,
    });
};

export const getAnalytics = async () => {
  const [eventsResult, projectsResult] = await Promise.all([
    supabase
      .from('analytics')
      .select('*')
      .eq('portfolio_id', PORTFOLIO_ID)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('projects')
      .select('id, title, views, clicks_github, clicks_live, clicks_youtube')
      .eq('portfolio_id', PORTFOLIO_ID)
      .order('views', { ascending: false }),
  ]);

  const events = eventsResult.data || [];
  const projects = projectsResult.data || [];

  const stats = {
    totalViews: events.filter(e => e.event === 'view').length,
    totalGithubClicks: events.filter(e => e.event === 'click_github').length,
    totalLiveClicks: events.filter(e => e.event === 'click_live').length,
    totalYoutubeClicks: events.filter(e => e.event === 'click_youtube').length,
    totalAiChats: events.filter(e => e.event === 'ai_chat').length,
    totalResumeDownloads: events.filter(e => e.event === 'resume_download').length,
  };

  return { events, projects, stats };
};

// Contact Services
export const submitContact = async (contactData) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      ...contactData,
      portfolio_id: PORTFOLIO_ID,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('portfolio_id', PORTFOLIO_ID)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

// AI Services - call Edge Functions
export const aiChat = async (projectId, message, history = []) => {
  const { data, error } = await supabase.functions.invoke('ai-chat', {
    body: { projectId, message, history },
  });
  if (error) throw error;
  return data;
};

export const generateResume = async () => {
  const { data, error } = await supabase.functions.invoke('ai-resume', {
    body: { portfolioId: PORTFOLIO_ID },
  });
  if (error) throw error;
  return data;
};

export const analyzeCareerFit = async (jobDescription) => {
  const { data, error } = await supabase.functions.invoke('career-fit', {
    body: { portfolioId: PORTFOLIO_ID, jobDescription },
  });
  if (error) throw error;
  return data;
};

// File Upload Services
export const uploadFile = async (file, bucket = 'uploads', folder = 'general') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
};
