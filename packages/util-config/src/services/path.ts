export type pathType = "team" | "organ" | "article" | "class" | "item" | "lesson";

export const path: { [key in pathType]: string } = {
  team: "/team",
  organ: "/organ",
  article: "/article",
  class: "/class",
  item: "/item",
  lesson: "/lesson",
};
