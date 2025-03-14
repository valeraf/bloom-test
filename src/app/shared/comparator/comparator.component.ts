import { Component, computed, forwardRef, inject, input, signal } from '@angular/core';
import { TType } from '../../filter/models/events';
import {
  ControlValueAccessor,
  FormBuilder,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { RangeComponent } from '../range/range.component';
import { ContainsSelectorComponent } from '../contains-selector/contains-selector.component';
import { debounceTime, startWith } from 'rxjs';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { JsonPipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface TypeItem {
  label: string;
  value: TType;
  icon: string;
}

@Component({
  selector: 'app-comparator',
  standalone: true,
  imports: [
    RangeComponent,
    ReactiveFormsModule,
    FormsModule,
    ContainsSelectorComponent,
    AutocompleteComponent,
    NgClass,
    MatIconModule,
  ],
  templateUrl: './comparator.component.html',
  styleUrl: './comparator.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComparatorComponent),
      multi: true,
    },
  ],
})
export class ComparatorComponent implements ControlValueAccessor {
  type = input.required<TType>();
  localType = signal<TType | null>(null);
  inputType = computed(() => (this.type() === 'string' ? 'text' : 'number'));
  options = {
    string: [
      {
        label: 'equals',
        value: 'eq',
      },
      {
        label: 'does not equal',
        value: 'ne',
      },
      {
        label: 'contains',
        value: 'contains',
      },
      {
        label: 'does not contains',
        value: 'notContains',
      },
    ],
    number: [
      {
        label: 'equal to',
        value: 'eq',
      },
      {
        label: 'in between',
        value: 'between',
      },
      {
        label: 'less than',
        value: 'lt',
      },
      {
        label: 'greater than',
        value: 'gt',
      },
    ],
  };

  availableTypes: TypeItem[] = [
    {
      label: 'String',
      value: 'string',
      icon: 'title'
    },
    {
      label: 'Number',
      value: 'number',
      icon: 'tag'
    }
  ]

  _type = computed(() => {
    return this.localType() || this.type()
  });
  optionsByType = computed(() => {
    const d = this.options[this._type()];
    return d;
  });

  private fb = inject(FormBuilder);

  form = this.fb.group({
    comparator: ['eq'],
    value: this.fb.control<any>(null),
  });

  constructor() {
    this.comparatorCtrl.valueChanges.pipe(
      debounceTime(10)
    ).subscribe(value => {
      if (this._type() === 'number') {
        this.form.controls.value.patchValue(0);  
      } else {
        this.form.controls.value.setValue(null);
      }
    })
  }

  get comparatorCtrl() {
    return this.form.controls.comparator;
  }

  get helper() {
    return '';
  }


  writeValue(obj: any): void {
    if (obj) {
      this.form.patchValue(obj, {emitEvent: false});
    } else {
      this.form.reset({
        comparator: 'eq',
      });
    }
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.pipe(startWith(this.form.value)).subscribe(val => {
      fn(val)
    });
  }

  registerOnTouched(fn: any): void {}

  onOptionsByType(type: TType) {
    this.localType.set(type);
  }
}
