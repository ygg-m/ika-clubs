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