export type NbaResultSet = {
  name: string;
  headers: string[];
  rowSet: unknown[][];
};

export type NbaStatsJson = {
  resource?: string;
  parameters?: Record<string, unknown>;
  resultSets?: NbaResultSet[];
};

export type TeamYearRow = Record<string, string | number | null>;

export type RosterPlayerRow = {
  PLAYER_ID: number;
  PLAYER: string;
  NUM: string;
  POSITION: string;
  HEIGHT: string;
  WEIGHT: string;
  BIRTH_DATE: string;
  COUNTRY: string;
  SEASON: string;
};

export type PlayerCareerSeasonRow = Record<string, string | number | null>;

export type PlayerInfoRow = Record<string, string | number | null>;
