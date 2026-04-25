import pathsFile from "@/data/guided-paths.json";

export type GuidedPath = {
  title: string;
  description?: string;
  href: string;
};

export function getGuidedPaths(): GuidedPath[] {
  return pathsFile.paths as GuidedPath[];
}
