# IKA Clubs

## Table of Contents
1. [Overview](#overview)
2. [Technical Stack](#technical-stack)
3. [Data Models](#data-models)
4. [Architecture](#architecture)
5. [Features](#features)
6. [Authentication & Authorization](#authentication--authorization)
7. [Database Schema](#database-schema)
8. [API Structure](#api-structure)

## Overview

The IKA Clubs is a web application designed to manage and organize various club activities, primarily focused on books, movies, and music. The platform allows users to create groups, manage clubs within those groups, and track activities and rankings for different works of art.

## Technical Stack

### Frontend
- Angular 18
- SCSS for styling
- Angular Material
- NgRx for state management
- RxJS for reactive programming

### Backend
- Firebase
  - Authentication
  - Firestore (database)
  - Cloud Storage (for images)
  - Cloud Functions (for background tasks)
  - Realtime Database (for real-time features)

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  birthdate: Date;
  groups: string[]; // References to groups
  participationHistory: ParticipationRecord[];
}
```

### Group
```typescript
interface Group {
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
```

### Club
```typescript
interface Club {
  id: string;
  groupId: string;
  name: string;
  iconUrl: string;
  description: string;
  type: 'BOOK' | 'MOVIE' | 'MUSIC';
  isPrivate: boolean;
  password?: string;
  members: string[]; // User IDs
  configuration: ClubConfiguration;
  history: ArtWork[];
  createdAt: Date;
  updatedAt: Date;
}

interface ClubConfiguration {
  requiresUrl: boolean;
  requiresGenre: boolean;
  requiresDuration: boolean;
  rankingSystem: 'CARTESIAN' | 'TRADITIONAL';
  individualRanking: boolean; // For music/chapters
}
```

### ArtWork Base
```typescript
interface ArtWorkBase {
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
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

interface LocalizedName {
  language: string;
  name: string;
}
```

### Specific Art Types
```typescript
interface Book extends ArtWorkBase {
  totalChapters: number;
  readingProgress: ReadingProgress[];
}

interface Movie extends ArtWorkBase {
  watchTogether: boolean;
  watchingProgress?: WatchingProgress[];
}

interface Music extends ArtWorkBase {
  tracks: Track[];
  isPlaylist: boolean;
}

interface Track {
  name: string;
  duration: number;
  rankings: number[]; // 0-10 rankings
}
```

### Rankings
```typescript
interface CartesianRanking {
  userId: string;
  interesting: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
  quality: number; // 1-10
  timestamp: Date;
}

interface TraditionalRanking {
  userId: string;
  score: number; // 0-10
  timestamp: Date;
}
```

## Architecture

### Module Structure
```
src/
├── app/
│   ├── core/                 # Singleton services and components
│   │   ├── auth/
│   │   ├── guards/
│   │   └── services/
│   ├── shared/              # Shared components and pipes
│   ├── features/
│   │   ├── groups/
│   │   ├── clubs/
│   │   └── artwork/
│   └── data-visualization/   # Graphics and charts
├── assets/
└── environments/
```

## Features

### Authentication
- Google Sign-in integration
- Protected routes using Angular Guards
- User profile management

### Groups
- CRUD operations for groups
- Private/Public visibility
- Member management
- Unique ID generation for private groups

### Clubs
- Modular configuration system
- Real-time updates using Firebase Realtime Database
- History tracking
- Custom ranking systems

### Data Visualization
- Interactive charts using ng2-charts
- Detailed drill-down views
- Export capabilities
- Real-time updates

### Sharing
- Deep linking system
- Image generation for rankings
- Social media integration

## Authentication & Authorization

### Firebase Authentication Setup
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-domain.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-bucket.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Guards
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.user$.pipe(
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
```

## Database Schema

### Firestore Collections
```
users/
  {userId}/
    profile: UserProfile
    history: ParticipationRecord[]

groups/
  {groupId}/
    details: GroupDetails
    members: Member[]
    clubs/
      {clubId}/
        details: ClubDetails
        artworks: ArtWork[]
        rankings: Ranking[]

shared/
  configurations/
    clubTypes: ClubType[]
    rankingSystems: RankingSystem[]
```

## API Structure

### Services

#### GroupService
```typescript
interface GroupService {
  createGroup(group: Group): Promise<string>;
  updateGroup(groupId: string, data: Partial<Group>): Promise<void>;
  deleteGroup(groupId: string): Promise<void>;
  getGroup(groupId: string): Observable<Group>;
  getGroupsByUser(userId: string): Observable<Group[]>;
  addMember(groupId: string, userId: string): Promise<void>;
  removeMember(groupId: string, userId: string): Promise<void>;
}
```

#### ClubService
```typescript
interface ClubService {
  createClub(groupId: string, club: Club): Promise<string>;
  updateClub(clubId: string, data: Partial<Club>): Promise<void>;
  deleteClub(clubId: string): Promise<void>;
  getClub(clubId: string): Observable<Club>;
  getClubsByGroup(groupId: string): Observable<Club[]>;
  addArtWork(clubId: string, artwork: ArtWork): Promise<void>;
  updateArtWork(clubId: string, artworkId: string, data: Partial<ArtWork>): Promise<void>;
  addRanking(clubId: string, artworkId: string, ranking: Ranking): Promise<void>;
}
```

#### RealTimeService
```typescript
interface RealTimeService {
  subscribeToRankings(artworkId: string): Observable<Ranking[]>;
  subscribeToProgress(artworkId: string): Observable<Progress[]>;
  subscribeToComments(artworkId: string): Observable<Comment[]>;
}
```
