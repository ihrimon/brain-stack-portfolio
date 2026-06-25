export const caseStudies = [
  {
    main_image_src:
      "https://res.cloudinary.com/dieth2xb3/image/upload/v1756356325/Screenshot_2025-08-28_at_10.14.32_AM_vndeou.png",
    project_title: "Reimagining business insurance with a data-driven, AI-powered platform design.",
    logo_src:
      "/logo.jpeg",
    description:
      "We designed, built & deployed on Standard Draft, an AI-powered legal signing platform. It was a multi-year journey.",
    features: [
      "R&D-ed & built first-of-it's kind legal contract templating engine to draft & negotiate enterprise-ready NDAs in minutes via wizard-style interface.",
      "Cut down contract creation time from ~31 days to hours. >10x faster. Several times cheaper.",
    ],
    case_study_link: "#",
    name: "Standard Draft",
    demo_images: [
      "https://res.cloudinary.com/dieth2xb3/image/upload/v1756356325/Screenshot_2025-08-28_at_10.14.32_AM_vndeou.png",
      "https://res.cloudinary.com/dieth2xb3/image/upload/v1756356325/Screenshot_2025-08-28_at_10.14.32_AM_vndeou.png",
      "https://res.cloudinary.com/dieth2xb3/image/upload/v1756356325/Screenshot_2025-08-28_at_10.14.32_AM_vndeou.png",
    ],
    test_img:
      "https://cdn.prod.website-files.com/62528d398a42424ab6390ee1/667adecbe7684da501b70952_image%2014.jpg",
    testimonial: `"Ionio didn't disappear after the MVP was built. They continued to work with us to fix bugs and make improvements based on user feedback."`,
    founder_name: "Ryan Samii",
    position: "Founder & CEO",
  },
];

export interface CaseStudyType {
  main_image_src: string;
  project_title: string;
  logo_src: string;
  description: string;
  features: string[];
  case_study_link: string;
  name: string;
  demo_images: string[];
  project_link?: string | null;
  cta_links?: {
    "let's talk": string;
    "read case study": string;
  };
  test_img?: string;
  testimonial?: string;
  founder_name?: string;
  position?: string;
}
