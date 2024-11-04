export interface Club {
  id: string;
  groupId: string;
  name: string;
  iconUrl: string;
  description: string;
  type: ClubType;
  isPrivate: boolean;
  password?: string;
  members: string[]; // User IDs
  configuration: ClubConfiguration;
  history: ArtWork[];
  createdAt: Date;
  updatedAt: Date;
}

export type ClubType = 'BOOK' | 'MOVIE' | 'MUSIC';

export interface ClubConfiguration {
  requiresUrl: boolean;
  requiresGenre: boolean;
  requiresDuration: boolean;
  rankingSystem: RankingSystem;
  individualRanking: boolean; // For music/chapters
}

export type RankingSystem = 'CARTESIAN' | 'TRADITIONAL';

export interface ArtWork {
  id: string;
  names: LocalizedName[];
  author: string;
  genre?: string;
  year: number;
  suggestedBy: string; // User ID
  url?: string;
  duration?: number;
  meetingDate: Date;
  rankings: Ranking[];
  status: ArtWorkStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocalizedName {
  language: string;
  name: string;
}

export type ArtWorkStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface CartesianRanking {
  userId: string;
  interesting: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
  quality: number; // 1-10
  timestamp: Date;
}

export interface TraditionalRanking {
  userId: string;
  score: number; // 0-10
  timestamp: Date;
}

export type Ranking = CartesianRanking | TraditionalRanking;
