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
