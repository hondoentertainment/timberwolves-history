import figuresFile from "@/data/wolves-figures.json";

export type FigureSource = { label: string; url: string };

export type FigureRecord = {
  slug: string;
  title: string;
  role: string;
  yearsLabel: string;
  paragraphs: string[];
  sources: FigureSource[];
};

export function getAllFigures(): FigureRecord[] {
  return figuresFile.figures as FigureRecord[];
}

export function getFigureBySlug(slug: string): FigureRecord | undefined {
  return getAllFigures().find((f) => f.slug === slug);
}

export function figuresAttribution(): string {
  return figuresFile.attribution;
}
