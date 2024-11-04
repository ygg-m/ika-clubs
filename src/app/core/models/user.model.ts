export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  birthdate: Date;
  groups: string[];
  participationHistory: ParticipationRecord[];
}

export interface ParticipationRecord {
  // Add participation record fields as needed
  timestamp: Date;
  type: string;
  reference: string;
}
