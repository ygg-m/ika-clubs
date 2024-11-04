import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NetworkStatusService {
  private online$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe(this.online$);
  }

  isOnline() {
    return this.online$.asObservable();
  }
}
