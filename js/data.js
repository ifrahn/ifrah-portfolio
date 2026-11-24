// ============================================================
//  All portfolio content lives here. Edit links / text freely.
//  Anything marked TODO should be replaced with your real URL.
// ============================================================
export const PROFILE = {
  name: 'Ifrah Naeem',
  role: 'Game Developer & 3D Artist',
  tagline: 'Designing interactive worlds, gameplay mechanics, and stylized 3D assets in Unity, Unreal Engine, and Blender.',
  location: 'Karachi, Pakistan',
  email: 'nifrah590@gmail.com',
  phone: '=+923322092044',
  linkedin: 'https://www.linkedin.com/in/ifrahnaeem19/',
  github: '', // TODO
};

export const ABOUT = [
  "I'm Ifrah, a Computer Science undergraduate at NED University specializing in Game Development and 3D Modeling.",
  "I focus on building responsive gameplay mechanics and atmospheric worlds—from dual-reality dungeon crawlers and sci-fi platformers to first-person horror exploration. I write game systems in C#, C++, and Unreal Blueprints, and model custom characters and props in Blender.",
  "Every project is an opportunity to blend clean code with expressive interactive design.",
];

export const STATS = [
  { value: '05', label: 'Games Built' },
  { value: '2nd', label: 'Global Game Jam Karachi' },
  { value: '4th', label: 'Dept. Game Exhibition' },
  { value: '48h', label: 'Fastest Full Build' },
];

export const SKILLS = [
  { group: 'Languages', color: 'rose', items: ['C', 'C++', 'C#', 'JavaScript'] },
  { group: 'Game Development', color: 'lav', items: ['Unity', 'Unreal Blueprints', 'OOP', 'Gameplay Design', '2D & 3D Game Logic', 'AI Pathfinding'] },
  { group: '3D Modeling', color: 'butter', items: ['Blender', '3D Modeling', 'Texturing', 'Character Rigging'] },
  { group: 'Web 3D', color: 'mint', items: ['HTML', 'CSS', 'Three.js', 'Interactive Web'] },
  { group: 'Workflow', color: 'peach', items: ['Project Management', 'Technical Documentation', 'MS Office'] },
];

export const PROJECTS = [
  {
    id: 'seeds',
    title: 'The Seeds',
    engine: 'Unreal Engine',
    code: 'UE // 3D',
    color: 'rose',
    badge: 'Playable Build',
    video: 'assets/video/seeds.mp4',
    blurb: 'An environmental survival shooter where you defend a botanical community from resource-hoarding robots.',
    description:
      'Gameplay built entirely through Unreal Blueprints, covering planting and watering systems, health depletion and recovery, mud terrain that slows movement, and interactive crops. Enemy robots patrol the environment, react to player noise when searching for seeds, steal water, and destroy crops. Modeled the custom robot enemy in Blender and integrated it into the engine.',
    tags: ['Unreal Engine', 'Blueprints', 'Blender', 'Gameplay Systems'],
    links: [
      {
        label: 'Download and Play Now',
        url: 'https://drive.google.com/file/d/1GhfagI1LuTHnMeUwuOhebpofthB1PD86/view?usp=sharing',
        type: 'build',
      },
      
    ],
  },
  {
    id: 'masketeer',
    title: 'Masketeer',
    engine: 'Game Jam · 48h',
    code: 'GGJ // 2D',
    color: 'lav',
    badge: '2nd Place · Global Game Jam Karachi',
    video: 'assets/video/masketeer.mp4',
    blurb: 'A 2D dual-reality dungeon crawler where equipping a mask shifts you instantly into the Underworld.',
    description:
      'Navigate a labyrinth split across two parallel dimensions. The Real World is blocked by locked doors and dead ends; the Mask mechanic shifts the player into the Underworld to uncover hidden passages, keys, and potions. Built from scratch in under 48 hours with combat, Underworld-exclusive skeleton enemies, traps, and scoring systems.',
    tags: ['2D', 'Game Jam', 'Dual Reality', 'Combat'],
    links: [
      {
        label: 'Download and Play Now',
        url: 'https://drive.google.com/file/d/1JTIvL3_4oIhIOful6adM4zGJ0IH0Fvk9/view?usp=sharing',
        type: 'build',
      },
    ],
  },
  {
    id: 'crimson',
    title: 'Crimson Bastion',
    engine: 'Unity · C#',
    code: 'UNITY // 2D',
    color: 'peach',
    badge: 'Playable Build',
    video: 'assets/video/crimson.mp4',
    blurb: 'A Mars-based 2D sci-fi action platformer centered on alien invasion and rescue missions.',
    description:
      'Fast-paced sci-fi survival gameplay featuring ranged combat, collectibles, scoring, win/lose states, enemy encounters, and timed level progression. Enhanced with custom audio cues and organized into modular Unity scenes, C# scripts, and prefabs.',
    tags: ['Unity', 'C#', 'Platformer', 'Game Audio'],
    links: [
      {
        label: 'Download and Play Now',
        url: 'https://drive.google.com/file/d/1MIPUhSsj3mWrOqw0MltTT2cvbExXzcDD/view?usp=sharing',
        type: 'build',
      },
    ],
  },
  {
    id: 'vos',
    title: 'Veil of Secrets',
    engine: 'Unity · C#',
    code: 'UNITY // 3D',
    color: 'mint',
    badge: '4th Place · Departmental Game Exhibition',
    blurb: 'First-person 3D atmospheric horror exploration driven by environmental puzzles and diary fragments.',
    description:
      'Features interactive doors, drawers, object inspection, and environmental puzzles powered by raycasting and event-based triggers. Dynamic lighting, spatial audio, and collectible diary entries gradually uncover the narrative.',
    tags: ['Unity', '3D', 'Horror', 'Raycasting'],
    links: [{ label: 'View on LinkedIn', url: 'https://lnkd.in/p/deFXw8fP', type: 'post' }], // TODO: replace with VOS post link
  },
  {
    id: 'beaky',
    title: 'Beaky Bounce',
    engine: 'C++ · SDL',
    code: 'C++ // SDL',
    color: 'butter',
    badge: 'OOP Architecture',
    blurb: 'A multi-level 2D arcade game engineered in C++ and SDL using object-oriented design patterns.',
    description:
      'Includes progressive levels, dynamic obstacles, power-ups, coins, gems, and NPC interactions. Built cleanly around encapsulation, inheritance, polymorphism, and abstraction, complete with character selection, settings, splash screens, and SDL texture/audio management.',
    tags: ['C++', 'SDL', 'OOP', '2D Arcade'],
    links: [{ label: 'View on LinkedIn', url: 'https://lnkd.in/p/dkjJu-CW', type: 'post' }], // TODO: replace with Beaky Bounce post link
  },
];

export const EDUCATION = [
  {
    when: '2023 – PRESENT',
    title: 'B.S. Computer Science · Gaming Specialization',
    place: 'NED University, Karachi',
    note: 'Focusing on game architecture, 3D graphics, and interactive systems.',
  },
  {
    when: 'A-LEVELS',
    title: 'Nixor College',
    place: 'Karachi',
    note: 'Biology A* · Chemistry A · Physics B',
  },
  {
    when: 'O-LEVELS',
    title: 'DHACSS',
    place: 'Karachi',
    note: '2 A* and 6 A grades',
  },
];

export const ACHIEVEMENTS = [
  { code: '01', title: '2nd Place — Global Game Jam Karachi (CEGA)', text: 'Awarded for Masketeer, developed from scratch in under 48 hours (Jan–Feb 2026).' },
  { code: '02', title: '4th Place — Departmental Game Exhibition', text: 'Recognized among competing student titles for Veil of Secrets.' },
  { code: '03', title: 'Academic Distinction', text: 'Achieved A* in A-Level Biology and 2 A* grades in O-Levels.' },
];