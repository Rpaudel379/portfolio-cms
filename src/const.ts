import {
  ProjectCategoryEnum,
  ProjectStatusEnum,
} from "@/schema/project.schema";

export const projects = [
  {
    id: 1,
    title: "E-Commerce Microservices Platform",
    description:
      "A comprehensive e-commerce solution built with microservices architecture, featuring real-time inventory management, payment processing, and advanced analytics dashboard.",
    longDescription:
      "This platform handles over 10,000 daily transactions with 99.9% uptime. Built using Node.js microservices, it includes user authentication, product catalog, order processing, payment integration with Stripe, and real-time notifications. The system is designed to scale horizontally and can handle massive traffic spikes during sales events.",
    thumbnail: "/placeholder.jpg?height=300&width=400&text=E-Commerce+Platform",
    tags: [
      "Node.js",
      "Express",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Kubernetes",
      "AWS",
      "GraphQL",
    ],
    category: "Full-Stack",
    status: "Live",
    year: "2024",
    github: "https://github.com/johnsmith/ecommerce-platform",
    demo: "https://ecommerce-demo.johnsmith.dev",
    featured: true,
    stats: {
      users: "10K+",
      performance: "99.9%",
      rating: 4.9,
    },
    features: [
      "Microservices Architecture",
      "Real-time Inventory Management",
      "Payment Processing with Stripe",
      "Advanced Analytics Dashboard",
      "Auto-scaling Infrastructure",
      "Multi-tenant Support",
    ],
    challenges:
      "The main challenge was designing a system that could handle high traffic while maintaining data consistency across multiple services. We solved this using event sourcing and CQRS patterns.",
    technologies: {
      Backend: ["Node.js", "Express", "GraphQL", "PostgreSQL", "Redis"],
      Infrastructure: ["Docker", "Kubernetes", "AWS", "Terraform"],
      Monitoring: ["Prometheus", "Grafana", "ELK Stack"],
    },
  },
  {
    id: 2,
    title: "Real-time Chat Application",
    description:
      "A secure messaging platform with end-to-end encryption, file sharing, group chats, and real-time presence indicators.",
    longDescription:
      "Built with Socket.io and React, this chat application supports real-time messaging for up to 1000 concurrent users. Features include message encryption, file uploads, emoji reactions, and push notifications. The application uses WebRTC for voice and video calls.",
    thumbnail: "/placeholder.svg?height=300&width=400&text=Chat+Application",
    tags: ["Socket.io", "React", "Node.js", "MongoDB", "JWT", "WebRTC"],
    category: "Full-Stack",
    status: "Development",
    year: "2024",
    github: "https://github.com/johnsmith/chat-app",
    demo: "https://chat-demo.johnsmith.dev",
    featured: false,
    stats: {
      users: "5K+",
      performance: "98.5%",
      rating: 4.7,
    },
    features: [
      "End-to-end Encryption",
      "Real-time Messaging",
      "File Sharing",
      "Voice & Video Calls",
      "Group Chats",
      "Push Notifications",
    ],
    challenges:
      "Implementing end-to-end encryption while maintaining real-time performance was complex. We used a hybrid approach with RSA for key exchange and AES for message encryption.",
    technologies: {
      Frontend: ["React", "TypeScript", "Socket.io Client", "WebRTC"],
      Backend: ["Node.js", "Socket.io", "MongoDB", "JWT"],
      Security: ["AES Encryption", "RSA Key Exchange", "HTTPS"],
    },
  },
  {
    id: 3,
    title: "Task Management API",
    description:
      "RESTful API with advanced authentication, role-based permissions, real-time notifications, and comprehensive analytics.",
    longDescription:
      "A robust backend API serving multiple client applications. Includes JWT authentication, role-based access control, task scheduling with Celery, and real-time updates via WebSockets. The API is fully documented with OpenAPI/Swagger and includes comprehensive testing.",
    thumbnail: "/placeholder.svg?height=300&width=400&text=Task+Management+API",
    tags: ["Python", "FastAPI", "PostgreSQL", "Celery", "Redis", "Docker"],
    category: "Backend",
    status: "Live",
    year: "2023",
    github: "https://github.com/johnsmith/task-api",
    demo: "https://task-api.johnsmith.dev/docs",
    featured: true,
    stats: {
      users: "2K+",
      performance: "99.2%",
      rating: 4.8,
    },
    features: [
      "RESTful API Design",
      "JWT Authentication",
      "Role-based Access Control",
      "Task Scheduling",
      "Real-time Notifications",
      "Comprehensive Testing",
    ],
    challenges:
      "Designing a flexible permission system that could handle complex organizational hierarchies while maintaining performance was the key challenge.",
    technologies: {
      Backend: ["Python", "FastAPI", "SQLAlchemy", "Alembic"],
      Database: ["PostgreSQL", "Redis"],
      Infrastructure: ["Docker", "Celery", "WebSockets"],
    },
  },
  {
    id: 4,
    title: "Analytics Dashboard",
    description:
      "Interactive data visualization platform with real-time metrics, custom reports, and automated insights generation.",
    longDescription:
      "A comprehensive analytics solution processing millions of data points daily. Features interactive charts, custom dashboard creation, automated report generation, and machine learning-powered insights. Built with Next.js and integrates with multiple data sources.",
    thumbnail: "/placeholder.svg?height=300&width=400&text=Analytics+Dashboard",
    tags: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Chart.js",
      "Python",
    ],
    category: "Frontend",
    status: "Maintenance",
    year: "2023",
    github: "https://github.com/johnsmith/analytics-dashboard",
    demo: "https://analytics-demo.johnsmith.dev",
    featured: false,
    stats: {
      users: "8K+",
      performance: "97.8%",
      rating: 4.6,
    },
    features: [
      "Interactive Data Visualization",
      "Real-time Metrics",
      "Custom Dashboard Builder",
      "Automated Reports",
      "ML-powered Insights",
      "Multi-source Integration",
    ],
    challenges:
      "Processing and visualizing large datasets in real-time while maintaining smooth user interactions required careful optimization of both backend queries and frontend rendering.",
    technologies: {
      Frontend: ["Next.js", "TypeScript", "Chart.js", "D3.js"],
      Backend: ["Node.js", "Prisma", "PostgreSQL"],
      ML: ["Python", "Pandas", "Scikit-learn"],
    },
  },
  {
    id: 5,
    title: "Content Management System",
    description:
      "Headless CMS with modern admin interface, content versioning, multi-language support, and advanced SEO optimization.",
    longDescription:
      "A flexible headless CMS powering multiple websites. Includes drag-and-drop page builder, content versioning, multi-language support, SEO optimization, and integration with popular frameworks. The system supports custom content types and has a powerful plugin architecture.",
    thumbnail:
      "/placeholder.svg?height=300&width=400&text=Content+Management+System",
    tags: ["Node.js", "Express", "MongoDB", "React", "AWS S3", "Elasticsearch"],
    category: "Full-Stack",
    status: "Archived",
    year: "2023",
    github: "https://github.com/johnsmith/headless-cms",
    demo: "https://cms-demo.johnsmith.dev",
    featured: false,
    stats: {
      users: "3K+",
      performance: "98.9%",
      rating: 4.5,
    },
    features: [
      "Headless Architecture",
      "Drag-and-drop Builder",
      "Content Versioning",
      "Multi-language Support",
      "SEO Optimization",
      "Plugin System",
    ],
    challenges:
      "Creating a flexible content model that could adapt to different use cases while maintaining performance and ease of use required extensive planning and iterative development.",
    technologies: {
      Frontend: ["React", "TypeScript", "Draft.js"],
      Backend: ["Node.js", "Express", "MongoDB"],
      Storage: ["AWS S3", "CloudFront", "Elasticsearch"],
    },
  },
  {
    id: 6,
    title: "DevOps Automation Suite",
    description:
      "Comprehensive automation tools for CI/CD pipelines, infrastructure provisioning, monitoring, and deployment orchestration.",
    longDescription:
      "A complete DevOps solution automating deployment processes for multiple environments. Includes infrastructure as code, automated testing, monitoring dashboards, and alert management. The suite integrates with popular tools like Jenkins, GitLab, and AWS.",
    thumbnail:
      "/placeholder.svg?height=300&width=400&text=DevOps+Automation+Suite",
    tags: ["Python", "Terraform", "Jenkins", "Docker", "AWS", "Kubernetes"],
    category: "DevOps",
    status: "Live",
    year: "2022",
    github: "https://github.com/johnsmith/devops-suite",
    demo: "https://devops-demo.johnsmith.dev",
    featured: true,
    stats: {
      users: "1K+",
      performance: "99.5%",
      rating: 4.9,
    },
    features: [
      "Infrastructure as Code",
      "Automated CI/CD Pipelines",
      "Multi-environment Deployment",
      "Monitoring & Alerting",
      "Security Scanning",
      "Cost Optimization",
    ],
    challenges:
      "Orchestrating complex deployment workflows across multiple cloud providers while ensuring security and compliance was the primary challenge.",
    technologies: {
      Infrastructure: ["Terraform", "AWS", "Kubernetes", "Docker"],
      "CI/CD": ["Jenkins", "GitLab CI", "GitHub Actions"],
      Monitoring: ["Prometheus", "Grafana", "ELK Stack"],
    },
  },
];

export const projectStatusEnums: ProjectStatusEnum[] = [
  "LIVE",
  "INPROGRESS",
  "ARCHIVED",
  "DEVELOPMENT",
  "MAINTENANCE",
];

export const projectCategoryEnums: ProjectCategoryEnum[] = [
  "Full-Stack",
  "Frontend",
  "Backend",
  "DevOps",
  "AI/ML",
];

export const sortOptions = ["newest", "oldest", "title"] as const;
