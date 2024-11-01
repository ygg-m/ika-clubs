import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private afAuth = inject(AngularFireAuth);
  private afs = inject(AngularFirestore);

  user$: Observable<User | null>;

  constructor() {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    if (credential.user) {
      return this.updateUserData(credential.user);
    }
  }

  async signOut() {
    await this.afAuth.signOut();
  }

  private updateUserData(user: any) {
    const userRef = this.afs.doc(`users/${user.uid}`);

    const data = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.photoURL,
      groups: [],
      participationHistory: [],
    };

    return userRef.set(data, { merge: true });
  }
}
