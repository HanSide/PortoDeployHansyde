import amokImage from "../../Image/amok.png";
import speakImage from "../../Image/speak.png";
import memoryLeakImage from "../../Image/memoryleak.png";
import littleOceanImage from "../../Image/littleocean.png";

export const PROJECTS = [
  {
    id: "amok",
    title: "AMOK",
    role: "VFX Artist / Motion Designer",
    tools: ["Unity", "Shader Graph", "VFX Graph", "FMOD"],
    description:
      "A top-down rampage game where a bull grows from normal-sized into a city-flattening giant, smashing buildings tile by tile while the city's response escalates.",
    status: "Technical Artist · In development",
    date: "GAMESEED 2026",
    itchUrl: "https://giggsgariz.itch.io/amok",
    images: [amokImage],
  },
  {
    id: "speak-to-clean",
    title: "Speak to Clean",
    role: "Programmer & Tech Artist",
    tools: ["Unity"],
    description:
      "A KKN student's mission to reform a littering village: talk villagers down without offending them, clean trash through drag-and-drop, and sort waste at the TPA.",
    status: "Collaborator · Top 5 Winner",
    date: "Gubufest 2026 Game Jam",
    itchUrl: "https://navierry011.itch.io/speak-to-clean",
    images: [speakImage],
  },
  {
    id: "memory-leak",
    title: "Memory Leak",
    role: "Programmer & Tech Artist",
    tools: ["Unity"],
    description: "A fast, high-pressure memory challenge: recall instructions flashed on a console and execute them before rising water submerges you.",
    status: "Collaborator · Play in browser",
    date: "Under Pressure",
    itchUrl: "https://namdnta.itch.io/memory-leak",
    images: [memoryLeakImage],
  },
  {
    id: "little-ocean",
    title: "Little Ocean",
    role: "Artist",
    tools: ["Unity"],
    description: "A cozy 2D pixel RPG about Lucas learning to see the ocean through his sea-loving grandpa: catch creatures, clean the reef, and build an aquarium.",
    status: "Collaborator · Artist",
    date: "GameJam+ 2025/26",
    itchUrl: "https://s-myth.itch.io/little-ocean",
    images: [littleOceanImage],
  },
];
