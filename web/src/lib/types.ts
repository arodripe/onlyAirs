export type Fan = {
  id: string;
  displayName: string;
  imageUrl: string;
  countryCode: string; // ISO 3166-1 alpha-2
  createdAt: string; // ISO timestamp
};

export type Match = {
  id: string;
  challenger1Id: string;
  challenger2Id: string;
  startAt: string; // ISO timestamp UTC
  endAt: string; // ISO timestamp UTC
  winnerFanId: string | null;
};

export type MatchWithFans = Match & {
  challenger1: Fan;
  challenger2: Fan;
  totals: {
    [fanId: string]: number;
  };
};


