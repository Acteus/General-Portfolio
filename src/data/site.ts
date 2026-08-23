export const site = {
  name: 'Garren Dullas',
  role: 'Cloud & Platform Engineer',
  email: 'mailto:garrendullas@gmail.com',
  github: 'https://github.com/Acteus',
  resume: '/output/pdf/Garren-Dullas-Cloud-Platform-Resume.pdf',
  location: 'Philippines',
  navigation: [
    { id: 'home', recruiter: 'Home', journal: 'Home' },
    { id: 'about', recruiter: 'About', journal: 'Story' },
    { id: 'skills', recruiter: 'Skills', journal: 'Now' },
    { id: 'projects', recruiter: 'Projects', journal: 'Notes' },
    { id: 'contact', recruiter: 'Contact', journal: 'Say hello' },
  ],
} as const;

export const about = {
  recruiter: [
    'IT student at Jose Rizal University focused on cloud infrastructure, deployment, and platform operations. I work with backend services, containers, workers, managed identities, registries, reverse proxies, and the operational details that keep applications reachable.',
    'My projects span Azure Container Apps, DigitalOcean App Platform, and Oracle Cloud. I also write application code, but my main focus is the cloud layer: how services are packaged, connected, secured, monitored, and recovered.',
  ],
  journal: [
    'I’m an IT student who became interested not only in writing applications, but in the quieter work that keeps them reachable: packaging, deployment, service connections, logs, and recovery.',
    'This space is a record of learning through real systems across Azure, DigitalOcean, and Oracle Cloud—what worked, what needed another attempt, and what I want to understand better next.',
  ],
} as const;

export const education = {
  title: 'B.S. Information Technology',
  institution: 'Jose Rizal University, Mandaluyong',
  detail: 'Expected 2027',
} as const;

export const certifications = ['CompTIA ITF+', 'IT Specialist — Java', 'IT Specialist — Databases', 'Wadhwani — Job Ready'] as const;

export const skills = {
  recruiter: [
    {
      tier: 'Core focus',
      title: 'Cloud & Platform Operations',
      description: 'The work I want to be hired to do: deploy, connect, secure, monitor, and recover services.',
      technologies: ['Azure Container Apps', 'Azure Container Registry', 'Docker', 'Podman', 'GitHub Actions', 'Linux', 'Managed Identity', 'Log Analytics', 'HTTP / TLS'],
    },
    {
      tier: 'Working knowledge',
      title: 'Backend & Systems',
      description: 'Application and server-side tools used to build the systems around the platform.',
      technologies: ['Python', 'FastAPI', 'PHP', 'Laravel', 'SQL', 'MySQL', 'Caddy', 'Quadlet', 'Shell'],
    },
    {
      tier: 'Project experience',
      title: 'Application & Data',
      description: 'Additional tools demonstrated through application, ML, and data projects.',
      technologies: ['JavaScript', 'TypeScript', 'React', 'Flutter', 'TensorFlow', 'NLP', 'Causal Inference', 'Firebase', 'Streamlit'],
    },
  ],
  journal: [
    { tier: 'Building', title: 'JRU Atlas & LaborWise', body: 'Two private systems in active development: an accreditation workspace on DigitalOcean and an employment-rights service on Azure.', technologies: ['DigitalOcean', 'Azure', 'Private projects'] },
    { tier: 'Learning', title: 'Making operations visible', body: 'I’m paying closer attention to observability, reliable container delivery, and documentation that explains what happens after deployment.', technologies: ['Observability', 'Containers', 'Documentation'] },
    { tier: 'Improving', title: 'Sharing the work responsibly', body: 'I’m turning deployment work into concise, sanitized case studies that show decisions and lessons without exposing private code or data.', technologies: ['Case studies', 'Architecture', 'Clear writing'] },
  ],
} as const;

export const contact = {
  recruiter: 'Open to discussing cloud deployments, platform operations, backend systems, and practical infrastructure work. Email is the best way to reach me.',
  journal: 'If you’re building something thoughtful, learning through a difficult system, or looking for someone who cares about the details behind deployment, I’d be glad to hear from you.',
} as const;
