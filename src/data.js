// Personal content sourced from ../portfolio and ../portfolio-2. Missing years and LinkedIn remain unset.
export const profile = {
  name: 'Kittinan Boonkoom', initials: 'KB', role: 'Computer Engineering\nStudent & Developer',
  introduction: 'Seeking a co-op internship in frontend, full stack, or mobile development. Project experience with React, Next.js, React Native, and TypeScript.',
  seeking: 'Seeking a co-op internship',
  interests: ['Frontend Development', 'Full Stack Development', 'Mobile Development'],
  about: "I'm a Computer Engineering student with hands-on experience from personal and team projects. My work includes web and mobile interfaces, API integration, and database-backed features.",
  details: "I've contributed to course scheduling, realtime notifications, and OCR-based timetable imports. I'm seeking a co-op placement where I can apply these skills, learn from code reviews and team workflows, and contribute under the guidance of experienced developers.",
  portrait: `${import.meta.env.BASE_URL}images/portraits/portrait-9204.png`, email: 'azazxxc147896325@gmail.com',
  github: 'https://github.com/azazxxc147896325-beep', linkedin: null,
  line: 'https://line.me/ti/p/y2--UgvvMr', resume: `${import.meta.env.BASE_URL}files/Resume_Kittinan.pdf`,
  skills: [
    { category: 'Frontend', items: ['HTML · CSS · JavaScript · TypeScript', 'React · Next.js · React Router', 'Tailwind CSS'] },
    { category: 'Mobile', items: ['React Native · Expo · Expo Router', 'Axios · AsyncStorage', 'REST API Integration · State Management'] },
    { category: 'Backend', items: ['Node.js · Express · NestJS', 'Python · REST APIs', 'Socket.IO'] },
    { category: 'Databases & auth', items: ['PostgreSQL · Supabase · Prisma ORM', 'Cloud Firestore', 'Firebase Authentication'] },
    { category: 'Tools & testing', items: ['Git · GitHub · GitHub Pages', 'npm · Vite · ESLint', 'Vitest · React Testing Library'] },
    { category: 'Computer engineering', items: ['RISC-V CPU Design', 'Digital Logic Simulation'] },
  ],
};
export const projects = [
  { id: 'classping', title: 'ClassPing', category: 'Camera-based automatic attendance', purpose: "ClassPing uses classroom cameras to match faces against students’ registered data and record attendance automatically. Instructors manage attendance on the web, and students use the mobile app.",
    responsibilities: [
      "Developed the mobile ID verification and face enrollment flow for students who gave consent.",
      "Built OCR features to read class schedules, verify schedule ownership, and help draft leave requests from supporting attachments.",
      "Built the leave request review page and separate attendance reports for class and exam sessions, with PDF and CSV exports.",
      "Connected the AI assistant to a knowledge base to answer student questions.",
    ],
    technologies: 'TypeScript, Next.js, React Native (Expo), NestJS, Supabase, Typhoon OCR',
    evidence: [{label: 'Timetable & identity checks', url: 'https://github.com/Benz-Strb/ClassPing/commit/3834393'}, {label: 'Sign-in & access flows', url: 'https://github.com/Benz-Strb/ClassPing/commit/b13cf1d'}], year: null, status: 'In development', description: 'The timetable import reads class schedules from documents, checks the student name and ID, and saves the verified timetable for display in the mobile app.', image: `${import.meta.env.BASE_URL}images/ClassPing.jpg`, url: null, source: 'https://github.com/Benz-Strb/ClassPing', placeholder: false },
  { id: 'quotemate', title: 'QuoteMate', category: 'Social web application', contribution: 'A React and Firebase application for quotes, friend discovery, likes, and comments.', year: null, status: 'In development', description: 'A social web application for sharing quotes and thoughts, discovering friends, and interacting through likes and comments. Built with React, Firebase, and Tailwind CSS.', image: `${import.meta.env.BASE_URL}images/QuoteMate.jpg`, url: 'https://azazxxc147896325-beep.github.io/projectMidterm-IG342/', source: 'https://github.com/azazxxc147896325-beep/projectMidterm-IG342', placeholder: false },
  { id: 'longdo', title: 'Longdo', category: 'Movie discovery', contribution: 'Developed a movie search and preview interface with React and TypeScript.', year: null, status: 'In development', description: 'Developed a web application for searching and previewing movies using React and TypeScript with a component-based architecture.', image: `${import.meta.env.BASE_URL}images/LongDo.jpg`, url: 'https://azazxxc147896325-beep.github.io/LongDo/#/', source: 'https://github.com/azazxxc147896325-beep/LongDo', placeholder: false },
  { id: 'dpu-unilife', title: 'DPU UniLife', category: 'Mobile & API integration', contribution: 'Team contribution: React Native screens, schedule APIs, and realtime notifications.', evidence: [{label: 'Schedule implementation', url: 'https://github.com/Benz-Strb/DPU_UniLife/commit/35350d4d86'}, {label: 'Notification integration', url: 'https://github.com/Benz-Strb/DPU_UniLife/commit/4c35fdbeab'}], year: null, status: 'Completed · Not deployed', description: 'A university life management team project. Contributed React Native screens, API integration, and parts of the Express backend, including course schedules, reusable application hooks, and Socket.IO notifications. Development has concluded for now; the project has not been deployed.', image: `${import.meta.env.BASE_URL}images/DPU_Unilife.jpg`, url: null, source: 'https://github.com/Benz-Strb/DPU_UniLife.git', placeholder: false },
];
