/*
 * Single source of truth for every personal detail, link, list and paragraph
 * rendered on the page. index.html holds structure only; js/main.js reads
 * this object and builds the content. Leave a value as "" or [] when it is
 * not available - dependent markup is simply not rendered.
 */

window.PORTFOLIO_CONFIG = {
  profile: {
    name: "Solomon M. Hailemariam",
    initials: "SH",
    title: "Full-Stack Developer | AI Engineer",
    tagline: "AI-powered web apps that turn raw data into useful answers.",
    heroDescription:
      "I build modern web applications with React, Node.js and MySQL, and integrate LLMs, RAG pipelines and semantic search to make information more useful and accessible.",
    training: "Evangadi's AI-Powered Full-Stack program",
    github: "https://github.com/SolomonMektie",
    profileImage: "images/so-lImage.jpeg",
    profileImageAlt: "Portrait of Solomon M. Hailemariam",
    pageTitle: "Solomon M. Hailemariam | Full-Stack Developer & AI Engineer",
    metaDescription:
      "Solomon M. Hailemariam - Full-Stack Developer and AI Engineer building AI-powered web apps with React 19, Node.js, Express, MySQL, Google Gemini API, RAG and semantic search.",
    heroChips: ["React", "Node.js", "MySQL", "Gemini API"],

    email: "",
    phone: "+1 (813) 240-2541",
    location: "USA, Florida",
    linkedin: "",
    otherSocials: [],
    resume: "",
    education: "",
    certificates: [],
    otherExperience: []
  },

  about: {
    text:
      "Solomon is a full-stack developer trained through Evangadi's AI-Powered Full-Stack program. He works across React, Node.js, Express and MySQL, and integrates large language models and retrieval-augmented generation (RAG) into applications. His interest sits at the intersection of full-stack engineering and applied AI: good interfaces, the APIs and databases behind them, and retrieval layers that make information useful.",
    focusAreas: [
      "Full-Stack Web Development",
      "AI-Powered Applications",
      "Retrieval-Augmented Generation (RAG)",
      "Semantic Search",
      "API and Database Integration"
    ]
  },

  skills: {
    Frontend: [
      "React 19",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Vite",
      "React Router",
      "Responsive UI"
    ],
    Backend: [
      "Node.js",
      "Express 5",
      "MySQL",
      "REST APIs",
      "JWT Authentication",
      "bcrypt",
      "Git and GitHub"
    ],
    AI: [
      "Google Gemini API",
      "Text Embeddings",
      "Semantic Search",
      "Retrieval-Augmented Generation (RAG)",
      "Prompt Design",
      "Cosine Similarity"
    ]
  },

  projects: [
    {
      title: "AI-Powered Evangadi Forum",
      type: "Full Stack · Applied AI",
      featured: true,
      description:
        "An AI-enhanced discussion and knowledge-sharing app that combines full-stack development with retrieval-based AI to make information easier to find.",
      tech: [
        "React 19.2",
        "Vite",
        "Node.js",
        "Express 5.2",
        "MySQL",
        "Google Gemini API (gemini-embedding-001, gemini-3.5-flash-lite)",
        "Text Embeddings",
        "Semantic Search",
        "RAG",
        "JWT",
        "bcryptjs",
        "pdf-parse / pdfjs-dist"
      ],
      workflow: [
        "The React SPA calls the Express REST API, which reads and writes MySQL.",
        "PDFs are ingested, split into chunks, and turned into embeddings.",
        "A user question runs a semantic search (cosine similarity), and the matches are used to generate a RAG answer.",
        "Security uses JWT sessions, role-based route guards and input validation."
      ],
      github: "https://github.com/SolomonMektie/EvangadiFrum-2026",
      live: "https://evangadiforum.tsedetech.com/",
      image: "images/project-evangadi.png",
      imageWidth: 1600,
      imageHeight: 2609
    },
    {
      title: "ChatGPT Clone",
      type: "Full Stack · AI Assistant",
      featured: false,
      description:
        "A conversational AI interface inspired by ChatGPT, built to demonstrate interactive React development and integration with a large language model API.",
      tech: [
        "React 19.2",
        "Vite",
        "JavaScript",
        "Node.js backend utility",
        "Google Gemini API",
        "Markdown rendering",
        "Syntax highlighting",
        "Conversation history"
      ],
      workflow: [
        "The user sends a message from the React UI.",
        "React state manages the multi-turn conversation.",
        "The message goes through a REST call to the Node backend, then to Gemini.",
        "The reply is rendered with Markdown and code highlighting, with error handling, loading states and optimistic UI updates."
      ],
      github: "https://github.com/SolomonMektie/Chagpt2026",
      live: "https://clonegpt.tsedetech.com/",
      image: "images/chatgpt-chat.png",
      imageWidth: 1600,
      imageHeight: 1000
    },
    {
      title: "Netflix Clone",
      type: "Frontend · API Integration",
      featured: false,
      description:
        "A streaming-style web interface focused on responsive layouts, component-based UI and media browsing.",
      tech: [
        "React 19.2",
        "Vite 8",
        "React Router 7",
        "JavaScript",
        "HTML5",
        "CSS3",
        "TMDB imagery"
      ],
      workflow: [
        "React Router handles the pages.",
        "Reusable components render the browsing rows and movie cards.",
        "Data and images come from TMDB, which needs an API key for live data."
      ],
      github: "https://github.com/SolomonMektie/Netflix2026",
      live: "https://netclone.tsedetech.com/",
      image: "images/project-netflix.jpg",
      imageWidth: 2048,
      imageHeight: 1152
    }
  ],

  experience: [
    {
      tag: "Training",
      program: "AI-Powered Full-Stack Program",
      organisation: "Evangadi",
      description:
        "Covers full-stack web development with React, Node.js, Express and MySQL, plus applied AI: LLM integration, RAG, text embeddings and semantic search."
    }
  ],

  contact: {
    heading: "Let's connect",
    invitation: "Have an AI-powered web app idea? Reach me on GitHub."
  }
};
