// File: app\app.component.ts
// --------------------------------------------------------------------------------

import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from './store/auth/auth.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private store = inject(Store);
  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  constructor() {}
}


// File: app\core\guards\auth.guard.ts
// --------------------------------------------------------------------------------

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';

export const authGuard = () => {
  const router = inject(Router);
  const store = inject(Store);

  return store.select(selectIsAuthenticated).pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/login']);
      }
    }),
    map((isAuthenticated) => isAuthenticated)
  );
};


// File: app\core\models\club.model.ts
// --------------------------------------------------------------------------------

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


// File: app\core\models\group.model.ts
// --------------------------------------------------------------------------------

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


// File: app\core\models\user.model.ts
// --------------------------------------------------------------------------------

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


// File: app\core\services\auth.service.ts
// --------------------------------------------------------------------------------

import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, from, of, switchMap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$: Observable<User | null> = new Observable((subscriber) => {
    return onAuthStateChanged(this.auth, (firebaseUser) => {
      if (firebaseUser) {
        this.getUserData(firebaseUser.uid).subscribe(subscriber);
      } else {
        subscriber.next(null);
      }
    });
  });

  googleSignIn() {
    return from(
      signInWithPopup(this.auth, new GoogleAuthProvider()).then(
        async (credential) => {
          if (credential.user) {
            const user: User = {
              id: credential.user.uid,
              email: credential.user.email!,
              displayName: credential.user.displayName!,
              avatarUrl: credential.user.photoURL!,
              birthdate: new Date(), // Should be collected separately
              groups: [],
              participationHistory: [],
            };

            await this.updateUserData(user);
            return user;
          }
          throw new Error('No user found');
        }
      )
    );
  }

  signOut() {
    return from(signOut(this.auth));
  }

  private getUserData(uid: string): Observable<User> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDocRef)).pipe(
      switchMap((docSnap) => {
        if (docSnap.exists()) {
          return of(docSnap.data() as User);
        } else {
          throw new Error('User document not found');
        }
      })
    );
  }

  private async updateUserData(user: User) {
    const userRef = doc(this.firestore, `users/${user.id}`);
    return setDoc(userRef, user, { merge: true });
  }
}


// File: app\core\services\groups.service.ts
// --------------------------------------------------------------------------------

import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  setDoc,
  query,
  where 
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from '../models/group.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  getGroups(): Observable<Group[]> {
    const groupsCollection = collection(this.firestore, 'groups');
    return collectionData(groupsCollection, { idField: 'id' }) as Observable<Group[]>;
  }

  createGroup(group: Omit<Group, 'id'>): Observable<Group> {
    const groupsCollection = collection(this.firestore, 'groups');
    const newGroupRef = doc(groupsCollection);
    const newGroup = {
      ...group,
      id: newGroupRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return from(setDoc(newGroupRef, newGroup)).pipe(
      map(() => newGroup)
    );
  }
}

// File: app\features\auth\login\login.component.ts
// --------------------------------------------------------------------------------

import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  template: `
    <div
      class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
      <div class="p-8 bg-white rounded-lg shadow-md">
        <h1 class="mb-6 text-2xl font-bold text-center">
          Welcome to IKA Clubs
        </h1>
        <button
          (click)="login()"
          [disabled]="loading$ | async"
          class="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {{ (loading$ | async) ? 'Signing in...' : 'Sign in with Google' }}
        </button>

        <div *ngIf="error$ | async as error" class="mt-4 text-red-600 text-sm">
          {{ error }}
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  error$ = this.store.select(AuthSelectors.selectAuthError);

  constructor(private store: Store) {}

  login() {
    this.store.dispatch(AuthActions.login());
  }
}


// File: app\features\groups\components\create-group-form.component.ts
// --------------------------------------------------------------------------------

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Group } from '../../../core/models/group.model';

@Component({
  selector: 'app-create-group-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form
      [formGroup]="groupForm"
      (ngSubmit)="onSubmit()"
      class="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <div class="space-y-4">
        <!-- Name Field -->
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Group Name*
          </label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            [class.border-red-500]="isFieldInvalid('name')"
          />
          <div *ngIf="isFieldInvalid('name')" class="text-red-500 text-sm mt-1">
            Group name is required
          </div>
        </div>

        <!-- Description Field -->
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Description*
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            [class.border-red-500]="isFieldInvalid('description')"
          ></textarea>
          <div
            *ngIf="isFieldInvalid('description')"
            class="text-red-500 text-sm mt-1"
          >
            Description is required
          </div>
        </div>

        <!-- Icon URL Field -->
        <div>
          <label
            for="iconUrl"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Icon URL
          </label>
          <input
            id="iconUrl"
            type="text"
            formControlName="iconUrl"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Privacy Toggle -->
        <div class="flex items-center space-x-2">
          <input
            id="isPrivate"
            type="checkbox"
            formControlName="isPrivate"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="isPrivate" class="text-sm font-medium text-gray-700">
            Make this group private
          </label>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            [disabled]="groupForm.invalid || isSubmitting"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Creating...' : 'Create Group' }}
          </button>
        </div>
      </div>
    </form>
  `,
})
export class CreateGroupFormComponent {
  @Output() groupCreated = new EventEmitter<Omit<Group, 'id'>>();

  groupForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      iconUrl: [''],
      isPrivate: [false],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.groupForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.groupForm.valid) {
      this.isSubmitting = true;

      const now = new Date();
      const newGroup = {
        ...this.groupForm.value,
        members: [], // Initialize with empty members array
        clubs: [], // Initialize with empty clubs array
        uniqueId: this.generateUniqueId(), // Generate unique ID for private groups
        createdAt: now,
        updatedAt: now,
      };

      this.groupCreated.emit(newGroup);
      this.groupForm.reset({
        name: '',
        description: '',
        iconUrl: '',
        isPrivate: false,
      });
      this.isSubmitting = false;
    } else {
      Object.keys(this.groupForm.controls).forEach((key) => {
        const control = this.groupForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  private generateUniqueId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}


// File: app\features\groups\components\group-card.component.ts
// --------------------------------------------------------------------------------

import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Group } from '@core/models/group.model';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center mb-4">
        <img
          [src]="group.iconUrl || '/assets/default-group.png'"
          [alt]="group.name"
          class="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h2 class="text-xl font-semibold">{{ group.name }}</h2>
          <p class="text-gray-600">{{ group.members.length }} members</p>
        </div>
      </div>

      <p class="text-gray-700 mb-4">{{ group.description }}</p>

      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">
          {{ group.isPrivate ? 'Private' : 'Public' }}
        </span>
        <a
          [routerLink]="['/groups', group.id]"
          class="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
        >
          View Details
        </a>
      </div>
    </div>
  `,
})
export class GroupCardComponent {
  @Input({ required: true }) group!: Group;
}


// File: app\features\groups\components\group-list.component.ts
// --------------------------------------------------------------------------------

import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Group } from '@core/models/group.model';
import { Store } from '@ngrx/store';
import * as GroupsActions from '@store/groups/groups.actions';
import * as GroupsSelectors from '@store/groups/groups.selectors';
import { Observable } from 'rxjs';
import { CreateGroupFormComponent } from './create-group-form.component';
import { GroupCardComponent } from './group-card.component';

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    GroupCardComponent,
    CreateGroupFormComponent,
  ],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">My Groups</h1>
        <button
          (click)="showCreateForm = !showCreateForm"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {{ showCreateForm ? 'Cancel' : 'Create Group' }}
        </button>
      </div>

      <app-create-group-form
        *ngIf="showCreateForm"
        (groupCreated)="onCreateGroup($event)"
      />

      <div *ngIf="loading$ | async" class="text-center py-4">
        Loading groups...
      </div>

      <div *ngIf="error$ | async as error" class="text-red-600 mb-4">
        {{ error }}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-group-card *ngFor="let group of groups$ | async" [group]="group" />
      </div>
    </div>
  `,
})
export class GroupListComponent implements OnInit {
  groups$: Observable<Group[]> = this.store.select(
    GroupsSelectors.selectAllGroups
  );
  loading$: Observable<boolean> = this.store.select(
    GroupsSelectors.selectGroupsLoading
  );
  error$: Observable<any> = this.store.select(
    GroupsSelectors.selectGroupsError
  );
  showCreateForm = false;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(GroupsActions.loadGroups());
  }

  onCreateGroup(group: Omit<Group, 'id'>) {
    this.store.dispatch(GroupsActions.createGroup({ group }));
    this.showCreateForm = false;
  }
}


// File: app\store\auth\auth.actions.ts
// --------------------------------------------------------------------------------

import { createAction, props } from '@ngrx/store';
import { User } from '../../core/models/user.model';

export const login = createAction('[Auth] Login');

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');


// File: app\store\auth\auth.effects.ts
// --------------------------------------------------------------------------------

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(() =>
        this.authService.googleSignIn().pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          // Ensure we're navigating to the root route after successful login
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  // Auto-login effect to handle page refreshes
  autoLogin$ = createEffect(() =>
    this.authService.user$.pipe(
      map((user) => {
        if (user) {
          return AuthActions.loginSuccess({ user });
        }
        return AuthActions.loginFailure({ error: null });
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.signOut().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}


// File: app\store\auth\auth.reducer.ts
// --------------------------------------------------------------------------------

import { createReducer, on } from '@ngrx/store';
import { User } from '../../core/models/user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User | null;
  loading: boolean;
  error: any;
}

export const initialState: State = {
  user: null,
  loading: false,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    loading: false,
    error: null,
  }))
);


// File: app\store\groups\groups.actions.ts
// --------------------------------------------------------------------------------

import { Group } from '@core/models/group.model';
import { createAction, props } from '@ngrx/store';

export const loadGroups = createAction('[Groups] Load Groups');

export const loadGroupsSuccess = createAction(
  '[Groups] Load Groups Success',
  props<{ groups: Group[] }>()
);

export const loadGroupsFailure = createAction(
  '[Groups] Load Groups Failure',
  props<{ error: any }>()
);

export const createGroup = createAction(
  '[Groups] Create Group',
  props<{ group: Omit<Group, 'id'> }>()
);

export const createGroupSuccess = createAction(
  '[Groups] Create Group Success',
  props<{ group: Group }>()
);

export const createGroupFailure = createAction(
  '[Groups] Create Group Failure',
  props<{ error: any }>()
);


// File: app\store\groups\groups.effects.ts
// --------------------------------------------------------------------------------

import { Injectable } from '@angular/core';
import { GroupsService } from '@core/services/groups.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as GroupsActions from './groups.actions';

@Injectable()
export class GroupsEffects {
  loadGroups$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.loadGroups),
      mergeMap(() =>
        this.groupsService.getGroups().pipe(
          map((groups) => GroupsActions.loadGroupsSuccess({ groups })),
          catchError((error) => of(GroupsActions.loadGroupsFailure({ error })))
        )
      )
    )
  );

  createGroup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupsActions.createGroup),
      mergeMap(({ group }) =>
        this.groupsService.createGroup(group).pipe(
          map((createdGroup) =>
            GroupsActions.createGroupSuccess({ group: createdGroup })
          ),
          catchError((error) => of(GroupsActions.createGroupFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private groupsService: GroupsService
  ) {}
}


// File: app\store\groups\groups.reducer.ts
// --------------------------------------------------------------------------------

import { Group } from '@core/models/group.model';
import { createReducer, on } from '@ngrx/store';
import * as GroupsActions from './groups.actions';

export interface State {
  groups: Group[];
  loading: boolean;
  error: any;
  selectedGroupId: string | null;
}

export const initialState: State = {
  groups: [],
  loading: false,
  error: null,
  selectedGroupId: null,
};

export const reducer = createReducer(
  initialState,
  on(GroupsActions.loadGroups, (state) => ({
    ...state,
    loading: true,
  })),
  on(GroupsActions.loadGroupsSuccess, (state, { groups }) => ({
    ...state,
    groups,
    loading: false,
    error: null,
  })),
  on(GroupsActions.loadGroupsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(GroupsActions.createGroupSuccess, (state, { group }) => ({
    ...state,
    groups: [...state.groups, group],
    error: null,
  }))
);


