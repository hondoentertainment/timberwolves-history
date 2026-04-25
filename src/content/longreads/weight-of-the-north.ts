/** Editorial flagship longread. Stats elsewhere on the site remain NBA.com–sourced. */

import type { ContentGraph } from "@/types/content-graph";

export type LongreadSection = { id: string; heading: string; paragraphs: string[] };
export type LongreadPullQuote = { quote: string; attribution: string };
export type LongreadSource = { label: string; url: string };

export type Longread = {
  slug: string;
  title: string;
  dek: string;
  published: string;
  readTimeMinutes: number;
  intro: string[];
  sections: LongreadSection[];
  pullQuotes: LongreadPullQuote[];
  sources: LongreadSource[];
  /** Typed relations for discovery and future “related” surfaces (see `ContentGraphRelated`). */
  contentGraph?: ContentGraph;
  /** Display names for `contentGraph.playerIds` links. */
  contentGraphPlayerLabels?: Record<string, string>;
  /** Editorial review stamp for flagship essays. */
  lastReviewed?: string;
};

export const weightOfTheNorthLongread = {
  slug: "weight-of-the-north",
  title: "The weight of the North",
  dek: "Why Minnesota’s franchise story is never only wins and losses—and how fans, geography, and timing turned a cold-market team into one of the league’s most narrated underdogs.",
  published: "2026-04-24",
  readTimeMinutes: 14,
  intro: [
    "If you tell the Timberwolves only through standings, you will miss the point. The North is not a neutral venue for basketball history; it is a place where distance, weather, and small-market economics become characters in the story. Minnesota’s NBA chapter is therefore unusually intimate: fans remember not just who scored, but who stayed, who asked out, who returned, and who made the crowd believe the playoffs were possible again.",
    "This piece is editorial interpretation—grounded in the public record and the emotional memory of eras, not in live stats tables. Use the rest of Wolves History for numbers, rosters, and citations to primary sources where they exist. Think of what follows as a map of why the franchise feels the way it does, and where the site’s deeper layers (eras, seasons, people) connect.",
  ],
  sections: [
    {
      id: "expansion",
      heading: "Expansion is a kind of innocence",
      paragraphs: [
        "Every expansion team begins with a promise that is almost cruel in its optimism: you are in the league, but you are not yet equipped to belong. Early Wolves seasons were less about contention than about learning what an NBA week feels like when the talent gap is visible from the opening tip. The Metrodome chapter, the roster churn, the first faces fans learned to cheer for—these are not trivia. They are the foundation of a fan culture that learned to prize effort because outcomes were rarely guaranteed.",
        "When you read the 1989–90 season page on this site, look past the record for a moment. Notice how many names rotated through the door, how many rookies were asked to carry adult minutes, and how quickly the league’s pace of improvement left slow rebuilds exposed. That context is what makes later peaks feel earned rather than accidental.",
      ],
    },
    {
      id: "kg",
      heading: "The Garnett era as emotional infrastructure",
      paragraphs: [
        "Kevin Garnett did not simply raise the ceiling; he changed the vocabulary. For a generation, “Wolves basketball” meant a hyper-skilled forward who treated defense as pride, who talked to himself and the crowd with the same intensity, and who made a cold Tuesday in February feel like an event. The MVP season and the Western Conference finals run are the headline facts, but the deeper truth is continuity: a superstar who stayed long enough for Minnesota to imagine itself as a real place in the league’s imagination, not merely a waystation.",
        "That continuity matters because it is rare. Markets smaller than the coasts often experience their best players as borrowed glory—two contracts, a few playoff rounds, then departure. Garnett’s first Minnesota act gave fans a story arc long enough to raise children inside it. When you browse the Garnett era hub here, treat it as a hub in the literal sense: a junction where seasons, coaches, and roster pages become spokes around a single human center.",
      ],
    },
    {
      id: "drought",
      heading: "The drought years: narrative without trophies",
      paragraphs: [
        "The years between true contention are where most franchises lose the casual fan. Minnesota often did the opposite: it cultivated irony, memes, lottery lore, and a stubborn online community that treated fandom as craft. That is not a substitute for winning, but it is a form of cultural depth. It also explains why certain players—pass-first guards, skilled bigs, charismatic scorers—became folk heroes even when the West was unforgiving.",
        "If the site’s job is historical depth, those seasons deserve chapter blurbs and honest framing: near misses, front-office turns, coaching changes, and the slow accumulation of young talent that sometimes never coheres. A franchise archive should not flatten those years into “bad.” It should explain what they tried, what broke, and what fans clung to anyway.",
      ],
    },
    {
      id: "butler",
      heading: "The Butler year as catharsis and rupture",
      paragraphs: [
        "Jimmy Butler’s Minnesota chapter is short on calendar pages but long on emotional voltage. The end of the fourteen-year playoff drought mattered because it proved the door could open again—but the subsequent fracture reminded everyone that talent fit and locker-room trust are not solved by a single transaction. For historians, the lesson is methodological: a single season can be both a triumph and a warning, and the story is incomplete if you only keep the happy sentence.",
        "On this site, treat the Butler-adjacent seasons as a case study in how quickly identity can shift from “finally” to “what now?” That is not cynicism; it is respect for the speed at which NBA realities move.",
      ],
    },
    {
      id: "modern",
      heading: "The modern Wolves: continuity as credibility",
      paragraphs: [
        "Recent Wolves teams matter because they pair highlight culture with a more durable coaching voice and a clearer defensive philosophy. When a franchise finally stacks multiple postseason appearances, the archive’s job shifts: you are no longer only documenting pain points; you are documenting how an organization learns in public. Finch-era pages should read as part of a continuity argument—what changed tactically, who carried shot creation, how depth replaced mythic reliance on one hero.",
        "None of that replaces the numbers. It contextualizes them. The best sports sites let statistics and story argue with each other in the margins, in footnotes, in “about the data” pages, and in optional editorial modules like this one.",
      ],
    },
    {
      id: "archive",
      heading: "What an archive is for",
      paragraphs: [
        "Wolves History is built on a simple premise: a fan in 2035 should be able to answer “what was that season like?” without relying on a broken link or a forum screenshot. That requires structured facts—records, rosters, playoff lines—plus optional narrative layers that admit interpretation while citing where prose leaves the safe harbor of counting stats.",
        "If you are new here, start at seasons, pick a year that matches your memory, and walk outward into people and eras. If you are returning, use the timeline as a spine and let curiosity pull you sideways into coaches and players. Depth is not one page; it is the sum of cross-links, honest uncertainty, and the willingness to label editorial content as editorial.",
      ],
    },
  ],
  pullQuotes: [
    {
      quote:
        "A franchise archive should not flatten hard years into ‘bad.’ It should explain what they tried, what broke, and what fans clung to anyway.",
      attribution: "Wolves History editorial frame",
    },
  ],
  sources: [
    {
      label: "Wikipedia — Minnesota Timberwolves (franchise overview)",
      url: "https://en.wikipedia.org/wiki/Minnesota_Timberwolves",
    },
    {
      label: "Basketball-Reference — franchise index (statistical context)",
      url: "https://www.basketball-reference.com/teams/MIN/",
    },
  ],
  lastReviewed: "2026-04-24",
  contentGraphPlayerLabels: {
    "708": "Kevin Garnett",
    "201567": "Kevin Love",
    "201937": "Ricky Rubio",
    "202710": "Jimmy Butler",
    "1630162": "Anthony Edwards",
    "1626157": "Karl-Anthony Towns",
  },
  contentGraph: {
    themes: ["north-market", "continuity-and-rupture", "archive-ethic"],
    eraSlugs: ["expansion", "garnett", "post-kg-rebuild", "butler-era", "finch-modern"],
    seasonIds: ["1989-90", "2003-04", "2017-18"],
    playerIds: [708, 201567, 202710],
    coachIds: ["flip-saunders", "rick-adelman", "tom-thibodeau", "chris-finch"],
  },
} satisfies Longread;
