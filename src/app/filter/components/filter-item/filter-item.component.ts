import { Component, DestroyRef, forwardRef, inject } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  ControlValueAccessor,
  FormBuilder,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Property, TType } from '../../models/events';
import { AutocompleteComponent } from '../../../shared/autocomplete/autocomplete.component';
import { AutocompleteOption } from '../../../shared/autocomplete/autocomplete.model';
import { AttributeControlComponent } from '../attribute-control/attribute-control.component';

@Component({
  selector: 'app-filter-item',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, FormsModule, AttributeControlComponent, AutocompleteComponent],
  templateUrl: './filter-item.component.html',
  styleUrl: './filter-item.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterItemComponent),
      multi: true,
    },
  ],
})
export class FilterItemComponent implements ControlValueAccessor {
  destroyRef = inject(DestroyRef);
  private eventService = inject(EventsService);
  private fb = inject(FormBuilder);
  events$ = this.eventService.events$.pipe(
    map((events) => events.map<AutocompleteOption>((event) => ({
      label: event.type,
      value: event.type
    })))
  );

  form = this.fb.group({
    key: Date.now(),
    event: this.fb.control<TType | null>(null),
    attributes: this.fb.control(null),
  });

  propertiesByEvent$: Observable<Property[]> = this.event.valueChanges.pipe(
    startWith(this.event.value),
    switchMap(() => {
      const event = this.event.value;
      if (event) {
        return this.eventService.attributesByEvent$.pipe(
          map((attributesByEvent) => {
            return attributesByEvent[event]
          })
        );
      }
      return of([]);
    })
  )

  constructor() {
    this.event.valueChanges.subscribe(() => {
      this.attributes.setValue(null);
    })
  }
  
  get attributes() {
    return this.form.controls.attributes;
  }
  get event() {
    return this.form.controls.event;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.form.patchValue({
        ...obj,
        key: Date.now()
      });
    } else {
      this.form.reset({
        key: Date.now()
      })
    }
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges
      .pipe(
        debounceTime(50),
        startWith(this.form.value),
      )
      .subscribe(f => { 
        fn(f);
      });
  }

  registerOnTouched(fn: any): void {}
}
