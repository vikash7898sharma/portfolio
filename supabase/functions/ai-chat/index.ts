import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const PORTFOLIO_ID = "00000000-0000-0000-0000-000000000001";

// Simple text vectorization (TF-IDF inspired)
function textToVector(text, vocabulary) {
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return vocabulary.map(word => (freq[word] || 0) / (words.length || 1));
}

// Cosine similarity
function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { projectId, message, history = [] } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    let context = "";
    let sources = [];

    if (projectId) {
      // Fetch project details
      const projectRes = await fetch(
        `${supabaseUrl}/rest/v1/projects?id=eq.${projectId}&select=*`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      const projects = await projectRes.json();
      const project = projects[0];

      if (project) {
        // Build context from project
        const parts = [];
        if (project.description) parts.push(project.description);
        if (project.long_description) parts.push(project.long_description);
        if (project.tech_stack?.length) parts.push(`Tech Stack: ${project.tech_stack.join(', ')}`);

        context = parts.join('\n\n');
        sources = ['description', 'techstack'];

        // Try to fetch chat memories for RAG
        const memoriesRes = await fetch(
          `${supabaseUrl}/rest/v1/chat_memories?project_id=eq.${projectId}&select=chunk,source`,
          { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
        );
        const memories = await memoriesRes.json();

        if (memories.length > 0) {
          context = memories.map(m => m.chunk).join('\n\n');
          sources = memories.map(m => m.source);
        }
      }
    }

    // Call OpenRouter AI
    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");
    let reply = "";

    if (openrouterKey) {
      const systemPrompt = context
        ? `You are an AI assistant for a developer portfolio. Answer questions about this project using the context below. Be concise and helpful.\n\nCONTEXT:\n${context}`
        : "You are a helpful AI assistant for a developer portfolio website. Answer questions about the developer's skills, projects, and experience.";

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
            { role: "system", content: systemPrompt },
            ...history.slice(-6),
            { role: "user", content: message },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      const aiData = await aiRes.json();
      reply = aiData.choices?.[0]?.message?.content || "I couldn't generate a response.";
    } else {
      reply = `Based on the project context, I'd be happy to help! However, AI features require an OpenRouter API key to be configured. In the meantime, you can explore the project details directly.`;
    }

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
        project_id: projectId || null,
        event: "ai_chat",
      }),
    });

    return new Response(
      JSON.stringify({ reply, sources }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
