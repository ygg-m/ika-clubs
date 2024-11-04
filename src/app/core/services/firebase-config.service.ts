import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  persistentLocalCache,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseConfigService {
  constructor() {}

  initializeFirestore(app: FirebaseApp) {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
      }),
      experimentalForceLongPolling: true, // More reliable than WebSocket for unstable connections
    });
  }
}
