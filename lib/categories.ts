export type Category = {
  slug: string;
  label: string;
  description: string;
  categoryValue: string;
  // hex colours for gradient — intentionally muted to match site's dark navy theme
  gradientFrom: string;
  gradientTo: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "worker",
    label: "Worker Courses",
    description:
      "Essential safety courses for workers in construction, shipyard, and industrial environments.",
    categoryValue: "Worker",
    gradientFrom: "#1c3d5a",
    gradientTo: "#2e6a9e",
  },
  {
    slug: "supervisor",
    label: "Supervisor Courses",
    description:
      "Courses for safety supervisors responsible for managing workplace hazards and teams.",
    categoryValue: "Supervisor",
    gradientFrom: "#1a4d3a",
    gradientTo: "#2e7d5e",
  },
  {
    slug: "professional",
    label: "Professional Courses",
    description:
      "Advanced WSH courses for safety professionals, managers, and consultants.",
    categoryValue: "Professional",
    gradientFrom: "#2d1b4e",
    gradientTo: "#4a3080",
  },
  {
    slug: "mewp-forklift",
    label: "MEWP & Forklift",
    description:
      "Operate mobile elevating work platforms and forklifts safely and in compliance with MOM regulations.",
    categoryValue: "MEWP & Forklift operator course",
    gradientFrom: "#4a2c0a",
    gradientTo: "#7a4e1a",
  },
];

export const CATEGORY_BY_SLUG: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);

export const CATEGORY_BY_VALUE: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.categoryValue, c])
);
