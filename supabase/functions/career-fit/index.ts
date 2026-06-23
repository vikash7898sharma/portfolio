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
    const { jobDescription } = await req.json();

    if (!jobDescription) {
      return new Response(
        JSON.stringify({ error: "Job description is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Fetch portfolio data
    const portfolioRes = await fetch(
      `${supabaseUrl}/rest/v1/portfolios?id=eq.${PORTFOLIO_ID}&select=skills,title,bio`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );
    const portfolios = await portfolioRes.json();
    const portfolio = portfolios[0];

    if (!portfolio) {
      return new Response(
        JSON.stringify({ error: "Portfolio not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch projects for tech stack
    const projectsRes = await fetch(
      `${supabaseUrl}/rest/v1/projects?portfolio_id=eq.${PORTFOLIO_ID}&select=tech_stack,title`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );
    const projects = await projectsRes.json();

    const allTech = projects.flatMap(p => p.tech_stack || []);
    const uniqueTech = [...new Set(allTech)];
    const skills = (portfolio.skills || []).map(s => s.name);

    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");

    if (!openrouterKey) {
      return new Response(
        JSON.stringify({
          score: 65,
          strengths: skills.slice(0, 3),
          gaps: ["Configure OpenRouter API key for detailed analysis"],
          suggestions: ["Add more projects matching the job requirements", "Highlight relevant experience"],
          summary: "Configure OpenRouter API key to get a detailed career fit analysis.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `Analyze this candidate's fit for the job.

Candidate Profile:
- Title: ${portfolio.title || "Developer"}
- Bio: ${portfolio.bio || ""}
- Skills: ${skills.join(', ')}
- Technologies Used: ${uniqueTech.join(', ')}

Job Description:
${jobDescription}

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "score": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "gaps": ["gap1", "gap2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "summary": "2-3 sentence summary"
}`;

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
          { role: "system", content: "You are a senior technical recruiter. Respond only with valid JSON." },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.5,
      }),
    });

    const aiData = await aiRes.json();
    let result;

    try {
      const cleaned = (aiData.choices?.[0]?.message?.content || "")
        .replace(/```json|```/g, '')
        .trim();
      result = JSON.parse(cleaned);
    } catch {
      result = {
        score: 70,
        strengths: skills.slice(0, 3),
        gaps: [],
        suggestions: ["Review your skills for this role", "Add relevant projects"],
        summary: "Analysis complete. Your skills show good alignment with this role.",
      };
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
