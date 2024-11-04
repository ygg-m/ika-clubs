export interface Group {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
  isPrivate: boolean;
  uniqueId: string; // For private group access
  members: string[]; // User IDs
  clubs: string[]; // Club IDs
  createdAt: Date;
  updatedAt: Date;
}
