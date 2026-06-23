import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000001";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { portfolioId, portfolioData, projectsData, experiencesData } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Fetch portfolio data if not provided
    let portfolio = portfolioData;
    if (!portfolio) {
      const portfolioRes = await fetch(
        `${supabaseUrl}/rest/v1/portfolios?id=eq.${PORTFOLIO_ID}&select=*`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      const portfolios = await portfolioRes.json();
      portfolio = portfolios[0];
    }

    // Fetch projects if not provided
    let projects = projectsData;
    if (!projects) {
      const projectsRes = await fetch(
        `${supabaseUrl}/rest/v1/projects?portfolio_id=eq.${PORTFOLIO_ID}&select=title,description,tech_stack&limit=6&order=featured.desc,views.desc`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      projects = await projectsRes.json();
    }

    // Fetch experiences if not provided
    let experiences = experiencesData;
    if (!experiences) {
      const expRes = await fetch(
        `${supabaseUrl}/rest/v1/experiences?portfolio_id=eq.${PORTFOLIO_ID}&select=*&order=start_date.desc`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      experiences = await expRes.json();
    }

    if (!portfolio) {
      return new Response(
        JSON.stringify({ error: "Portfolio not found. Build it first." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");

    if (!openrouterKey) {
      const fallbackResume = `
${portfolio.name || "Developer"}
${portfolio.title || "Software Developer"}
${portfolio.bio || ""}

CONTACT
${portfolio.social_links?.github ? `GitHub: ${portfolio.social_links.github}` : ""}
${portfolio.social_links?.linkedin ? `LinkedIn: ${portfolio.social_links.linkedin}` : ""}
${portfolio.social_links?.website ? `Website: ${portfolio.social_links.website}` : ""}

SKILLS
${(portfolio.skills || []).map(s => `${s.name} (${s.level}%)`).join(', ') || "Various technical skills"}

EXPERIENCE
${(experiences || []).map(e => `${e.role} at ${e.company}`).join('\n') || "Professional experience available upon request"}

PROJECTS
${(projects || []).map(p => `${p.title}: ${p.description || ''}`).join('\n') || "Featured projects available on portfolio"}
      `.trim();

      return new Response(
        JSON.stringify({ resumeText: fallbackResume }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `Write a professional resume for:
Name: ${portfolio.name || "Developer"}
Title: ${portfolio.title || "Software Developer"}
Bio: ${portfolio.bio || ""}
Skills: ${(portfolio.skills || []).map(s => s.name).join(', ')}

Experience:
${(experiences || []).map(e => `- ${e.role} at ${e.company} (${e.type || 'work'})`).join('\n') || "No experience listed"}

Top Projects:
${(projects || []).map(p => `- ${p.title}: ${p.description || ''} | Tech: ${(p.tech_stack || []).join(', ')}`).join('\n') || "No projects listed"}

Format it as: Summary, Skills, Experience, Projects. Use clean text formatting.`;

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": supabaseUrl,
        "X-Title": "AI Portfolio Pro",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a professional resume writer. Write clean, ATS-friendly resumes in plain text format." },
          { role: "user", content: prompt },
        ],
        max_tokens: 1500,
        temperature: 0.5,
      }),
    });

    const aiData = await aiRes.json();
    const resumeText = aiData.choices?.[0]?.message?.content || "Resume generation failed.";

    // Track analytics
    await fetch(`${supabaseUrl}/rest/v1/analytics`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        portfolio_id: PORTFOLIO_ID,
        event: "resume_download",
      }),
    });

    return new Response(
      JSON.stringify({ resumeText }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
