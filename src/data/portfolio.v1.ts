export type PortfolioLink = {
  label: string;
  href: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  askPrompt: string;
};

export type WorkItem = {
  index: string;
  title: string;
  eyebrow: string;
  description: string;
  technologies: string[];
  askPrompt: string;
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

export type PortfolioSnapshot = {
  snapshotVersion: "1.1.0";
  retrievedAt: string;
  source: string;
  name: string;
  initials: string;
  location: string;
  hero: {
    eyebrow: string;
    title: string;
    summary: string;
  };
  about: string[];
  experience: Experience[];
  work: WorkItem[];
  skillGroups: SkillGroup[];
  education: {
    institution: string;
    degree: string;
    period: string;
    location: string;
  };
  certification: {
    title: string;
    issuer: string;
    description: string;
    href: string;
    image: string;
  };
  interests: Array<{
    title: string;
    detail: string;
  }>;
  links: {
    profile: PortfolioLink;
    linkedin: PortfolioLink;
    frontend: PortfolioLink;
    backend: PortfolioLink;
    letterboxd: PortfolioLink;
  };
};

/**
 * Curated from the `nenad-info` Pinecone index on 2026-07-26.
 * The snapshot deliberately excludes uncertain, contradictory, or private details.
 * Runtime page rendering never depends on Pinecone or the assistant backend.
 */
export const portfolio = {
  snapshotVersion: "1.1.0",
  retrievedAt: "2026-07-26",
  source: "Pinecone / nenad-info",
  name: "Nenad Kajgana",
  initials: "NK",
  location: "Macedonia",
  hero: {
    eyebrow: "Hello, I’m Nenad — ML/ AI engineer",
    title: "AI/ML Engineer building practical NLP and GenAI systems.",
    summary:
      "I turn language models, retrieval pipelines, and product interfaces into software people can actually use.",
  },
  about: [
    "I like serious engineering without losing the fun of making things. Alongside workforce-intelligence systems and production AI, I build passion projects that give me room to experiment with agents, recommendations, music, film, and whatever idea refuses to leave my head.",
    "Curiosity is the thread: understand the system, find the playful angle, and turn it into something useful enough to live beyond the notebook.",
  ],
  experience: [
    {
      company: "HTEC",
      role: "Machine Learning / AI Engineer",
      period: "Present",
      summary:
        "Building workforce-intelligence products that use machine learning to understand employee dynamics and support better organizational decisions.",
      highlights: [
        "Developing predictive work around employee turnover and attrition.",
        "Exploring workforce signals and analytics that turn organizational data into practical decision support.",
        "Applying ML and AI engineering to current workforce-intelligence problems.",
      ],
      askPrompt: "What is Nenad currently building at HTEC in workforce intelligence?",
    },
    {
      company: "ITQuarks",
      role: "Machine Learning Engineer",
      period: "Jul 2023 — Jul 2025",
      summary:
        "Built machine learning and software systems across NLP, data engineering, automotive analytics, and full-stack product work.",
      highlights: [
        "Developed a RAG chatbot plug-in for Wix with document ingestion, memory, caching, Python, Velo, PostgreSQL, and Pinecone.",
        "Built Node.js pipelines around InfluxDB for real-time cryptocurrency data and serverless market-candle processing.",
        "Applied autoencoders, Neo4j, PostgreSQL, and graph-ranking methods to automotive assembly-code anomaly detection.",
        "Delivered price-prediction and supporting Next.js tooling for an automobile vendor platform.",
      ],
      askPrompt: "What did Nenad work on at ITQuarks? Give me the technical details.",
    },
    {
      company: "BetO2",
      role: "Full-Stack Developer",
      period: "Apr 2023 — Jul 2023",
      summary:
        "Worked on a sports-betting platform, developing product features across the client and server.",
      highlights: [
        "Built frontend functionality with Angular.",
        "Worked with .NET services and strengthened practical client–server engineering skills.",
      ],
      askPrompt: "Tell me about Nenad’s full-stack role at BetO2.",
    },
    {
      company: "Data Masters",
      role: "Intern / Junior Data Scientist",
      period: "May 2022 — Nov 2022",
      summary:
        "Started in applied NLP, progressing from internship work into a Junior Data Scientist role.",
      highlights: [
        "Developed a transformer-based skill extraction system for large volumes of text.",
        "Worked on preprocessing, model evaluation, and experimentation with Python, spaCy, NumPy, and pandas.",
      ],
      askPrompt: "How did Nenad use transformers and NLP at Data Masters?",
    },
  ],
  work: [
    {
      index: "01",
      title: "Workforce intelligence",
      eyebrow: "Current · HTEC",
      description:
        "Predictive ML work around employee turnover and attrition, designed to surface useful workforce signals and support proactive organizational decisions.",
      technologies: ["Predictive ML", "Workforce analytics", "Employee attrition", "Decision support"],
      askPrompt: "Explain Nenad’s current workforce-intelligence and employee-turnover work at HTEC.",
    },
    {
      index: "02",
      title: "Agentic cloud AI systems",
      eyebrow: "LLM orchestration",
      description:
        "Multi-agent workflows for text-to-SQL insights, visualization, caching, and editorial-style artist descriptions—alongside modular Docker-based AI tools in the cloud.",
      technologies: ["LangGraph", "Text-to-SQL", "Docker", "GCP", "AWS"],
      askPrompt: "What agentic AI and cloud systems has Nenad built?",
    },
    {
      index: "03",
      title: "RAG assistants with memory",
      eyebrow: "GenAI product",
      description:
        "An embeddable Wix assistant that ingested PDFs, Word documents, and text, then combined retrieval with user memory and caching.",
      technologies: ["RAG", "Pinecone", "PostgreSQL", "Python", "Velo"],
      askPrompt: "Explain the architecture of Nenad’s RAG chatbot work.",
    },
    {
      index: "04",
      title: "Transformer skill extraction",
      eyebrow: "Applied NLP",
      description:
        "A large-scale text pipeline that identified professional skills for an internal platform, covering preprocessing, transformer experimentation, and evaluation.",
      technologies: ["Transformers", "Python", "spaCy", "pandas"],
      askPrompt: "Walk me through Nenad’s transformer skill-extraction work.",
    },
    {
      index: "05",
      title: "Data and product engineering",
      eyebrow: "Full stack",
      description:
        "Production-facing work spanning live market-data pipelines, Angular/.NET features, Next.js tooling, and AI-backed automotive products.",
      technologies: ["Node.js", "InfluxDB", "Angular", ".NET", "Next.js"],
      askPrompt: "How broad is Nenad’s full-stack and data-engineering experience?",
    },
  ],
  skillGroups: [
    {
      title: "AI / ML",
      skills: ["NLP", "Transformers", "RAG", "LangGraph", "Autoencoders", "spaCy", "Regression"],
    },
    {
      title: "Backend",
      skills: ["Python", "Node.js", "TypeScript", ".NET", "API integration"],
    },
    {
      title: "Frontend",
      skills: ["React", "Next.js", "Angular", "Wix Velo"],
    },
    {
      title: "Cloud",
      skills: ["AWS", "S3", "EC2", "Google Cloud", "Cloud Run", "Docker"],
    },
    {
      title: "Data infrastructure",
      skills: ["Pinecone", "PostgreSQL", "InfluxDB", "Neo4j", "Real-time pipelines"],
    },
  ],
  education: {
    institution: "Faculty of Computer Science and Engineering",
    degree: "Bachelor’s degree",
    period: "2019 — 2023",
    location: "Skopje, Macedonia",
  },
  certification: {
    title: "Claude Certified Architect — Foundations",
    issuer: "Anthropic",
    description:
      "Designing and building production-grade Claude applications with Claude Code, the Claude Agent SDK, the Claude API, and MCP.",
    href: "https://www.credly.com/badges/d491f6ba-f6f2-4e4e-81b7-215800ddfb8d/public_url",
    image: "https://images.credly.com/images/f2040db3-3904-4240-8966-e87b1510bea0/linkedin_thumb_blob",
  },
  interests: [
    {
      title: "Music",
      detail: "Album discovery, physical collecting, and recommendation systems.",
    },
    {
      title: "Film",
      detail: "Cinema, personal curation, and finding the next great watch.",
    },
  ],
  links: {
    profile: { label: "GitHub profile", href: "https://github.com/k4jgana" },
    linkedin: { label: "LinkedIn profile", href: "https://www.linkedin.com/in/nenad-kajgana/" },
    frontend: { label: "Portfolio frontend", href: "https://github.com/k4jgana/portfolio-fe" },
    backend: { label: "AI assistant source", href: "https://github.com/k4jgana/portfolio-be" },
    letterboxd: { label: "Letterboxd profile", href: "https://letterboxd.com/k4jgana/" },
  },
} satisfies PortfolioSnapshot;
