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

  loadEvents() {
    this.http.get<Events>('https://br-fe-assignment.github.io/customer-events/events.json').subscribe(events => {
      this.events$.next(events.events);
    });
  }
}
