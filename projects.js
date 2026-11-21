/*
  Project list for bockwurstwilly.github.io
  -----------------------------------------
  To add a project: copy one block, change the values, done.

  category  – one of the ids in CATEGORIES below
  repo      – GitHub repo name under BockwurstWilly
  asset     – regex for the release file the Download button should point to
              (null = no download button, e.g. source-only projects)
  image     – screenshot in /img (16:10 looks best); leave out for a title panel
  links     – extra links shown next to the Download button
*/

const GITHUB_USER = "BockwurstWilly";

const CATEGORIES = [
  { id: "patches", title: "Patches & launchers", blurb: "Make the original game run well on Windows 10/11." },
  { id: "mods",    title: "Mods",                blurb: "New things to play inside existing games." },
  { id: "ports",   title: "Ports",               blurb: "Console games running natively on the PC." },
];

const PROJECTS = [
  {
    category: "patches",
    repo: "Blood2-HD-Patch",
    kind: "HD patch & launcher",
    title: "Blood II: The Chosen",
    text: "An unofficial HD patch with its own launcher for the GOG release. dgVoodoo2 up to 4K, EAX sound on today’s hardware, Hor+ widescreen, a fixed mouse and steady 60 fps – one setup instead of an evening with wikis. Uninstalling restores the game folder byte for byte.",
    facts: [
      ["Game",   "Blood II: The Chosen + The Nightmare Levels (GOG)"],
      ["System", "Windows 10/11"],
    ],
    image: "img/blood2-hd.jpg",
    imageAlt: "The Blood II HD launcher, graphics settings page",
    asset: /\.(zip|exe)$/i,
    links: [["View on GitHub", "https://github.com/BockwurstWilly/Blood2-HD-Patch"]],
  },
  {
    category: "patches",
    repo: "CoC-DCotE-HD-Patch",
    kind: "HD patch & launcher",
    title: "Call of Cthulhu: Dark Corners of the Earth",
    text: "An unofficial HD patch with its own launcher for the GOG release. Your monitor’s resolution, fullscreen that survives Alt+Tab, a precise mouse, and Xbox or PlayStation controllers with the Xbox version’s layout – no Steam or DS4Windows needed. Film grain can be switched off. Uninstalling restores the game folder byte for byte.",
    facts: [
      ["Game",   "Call of Cthulhu: Dark Corners of the Earth (GOG)"],
      ["System", "Windows 10/11"],
    ],
    image: "img/coc-dcote-hd.jpg",
    imageAlt: "The Call of Cthulhu HD launcher, graphics settings page",
    asset: /\.(zip|exe)$/i,
    links: [["View on GitHub", "https://github.com/BockwurstWilly/CoC-DCotE-HD-Patch"]],
  },
  {
    category: "patches",
    repo: "Ballance-HD-Patch",
    kind: "HD patch & launcher",
    title: "Ballance",
    text: "An unofficial HD patch with its own launcher. Borderless at your native resolution, real widescreen and smooth VSync frames – and the ball rolls with an Xbox or PlayStation controller: stepless, with a free camera and button prompts in the game. No mod loader, no extra runtimes. Uninstalling restores the game folder byte for byte.",
    facts: [
      ["Game",   "Ballance (GOG or Steam)"],
      ["System", "Windows 10/11"],
    ],
    image: "img/ballance-hd.jpg",
    imageAlt: "The Ballance HD launcher, graphics settings page",
    asset: /\.zip$/i,
    links: [["View on GitHub", "https://github.com/BockwurstWilly/Ballance-HD-Patch"]],
  },
  {
    category: "patches",
    repo: "BigRace-USA-LAN",
    kind: "LAN patcher & launcher",
    title: "Pro Pinball – Big Race USA",
    text: "Head-to-head over your home network on Windows 10/11, without DirectPlay trouble. One patcher sets up window mode, a LAN launcher and the firewall rules on each PC – and removes it all again.",
    facts: [
      ["Game",   "Pro Pinball – Big Race USA (tested with GOG)"],
      ["System", "Windows 10/11, two PCs on one network"],
    ],
    asset: /\.exe$/i,
    links: [["View on GitHub", "https://github.com/BockwurstWilly/BigRace-USA-LAN"]],
    note: "Patcher and launcher are in German; the instructions on GitHub are in English.",
  },
  {
    category: "mods",
    repo: "doom-runner",
    kind: "GZDoom mod",
    title: "Doom Runner",
    text: "Those fake mobile game ads … but it’s DOOM. Runs right away with the bundled Freedoom; best played with Doom II and Brutal Doom.",
    facts: [
      ["Needs",     "Nothing extra – Freedoom included"],
      ["Best with", "DOOM2.WAD and Brutal Doom"],
    ],
    image: "img/doom-runner.webp",
    imageAlt: "Three Doom Runner screenshots in portrait format",
    asset: /windows.*\.zip$/i,
    links: [
      ["Website", "https://bockwurstwilly.github.io/doom-runner/"],
      ["GitHub",  "https://github.com/BockwurstWilly/doom-runner"],
    ],
  },
  {
    category: "ports",
    repo: "BabylonInfernalis",
    kind: "N64 recompilation · preview",
    title: "Babylon Infernalis",
    text: "A native Windows port of Indiana Jones and the Infernal Machine for the Nintendo 64, made with N64: Recompiled and drawn by RT64. Early preview: the first level plays with music, sound and speech.",
    facts: [
      ["Status", "Source only – bring your own USA ROM"],
      ["System", "Windows 10/11 x64, Direct3D 12 or Vulkan"],
    ],
    asset: null,
    links: [
      ["Build instructions", "https://github.com/BockwurstWilly/BabylonInfernalis/blob/HEAD/BUILDING.md"],
      ["GitHub", "https://github.com/BockwurstWilly/BabylonInfernalis"],
    ],
    note: "No game data included.",
  },
];
