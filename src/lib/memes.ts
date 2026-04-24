import memesFile from "@/data/wolves-memes.json";

export type WolvesMeme = {
  id: string;
  title: string;
  era: string;
  summary: string;
};

export function getWolvesMemes(): WolvesMeme[] {
  return memesFile.memes as WolvesMeme[];
}

export function getMemesDisclaimer(): string {
  return memesFile.disclaimer;
}
