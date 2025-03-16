import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Events, Event, Property } from '../models/events';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  events$ = new BehaviorSubject<Event[]>([]);
  
  attributesByEvent$ = this.events$.pipe(
    map(events => events.reduce((acc, event) => {
      return {
        ...acc,
        [event.type]: event.properties
      };
    }, {} as Record<string, Property[]>))
  )
  constructor(private http: HttpClient) { }

  /**
   * This could be stored in a Store (like NGRX)
   * but for this small task - I didn't see the point, however bigger application will require some State management
   */
  loadEvents() {
    this.http.get<Events>('https://br-fe-assignment.github.io/customer-events/events.json').subscribe(events => {
      this.events$.next(events.events);
    });
  }
}
