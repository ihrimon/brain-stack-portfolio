import { Blocks, BrainCircuit, PencilLine } from "lucide-react"

export const processData = {
  badge: "How We Engineer",

  title: "Engineering modern digital solutions.",

  description:
    "Our engineering process combines strategy, design, and cutting-edge technologies to deliver scalable digital products that solve real business problems.",

  items: [
    {
      icon: Blocks,
      title: "End-to-End Development",
      description:
        "From planning and architecture to deployment and maintenance, we build reliable web and mobile solutions with performance, scalability, and long-term growth in mind.",
      tags: ["Mobile", "Web", "Desktop"],
    },

    {
      icon: BrainCircuit,
      title: "Integrating New Technologies",
      description:
        "We leverage AI, automation, cloud computing, IoT, and emerging technologies to create smarter products that improve efficiency and user experience.",
      tags: ["AI Features", "Automation", "Cloud"],
    },

    {
      icon: PencilLine,
      title: "Analysis & Design",
      description:
        "Every successful product starts with research. We analyze business goals, user needs, and market trends before crafting intuitive UI/UX experiences.",
      tags: ["Research", "UI/UX", "Discovery"],
    },
  ],
}
