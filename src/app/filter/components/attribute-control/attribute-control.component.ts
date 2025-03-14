import { Component, forwardRef, inject, input, computed, signal } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Property, TType } from '../../models/events';
import { MatIconModule } from '@angular/material/icon';
import { startWith } from 'rxjs';
import { ComparatorComponent } from '../../../shared/comparator/comparator.component';
import { AutocompleteComponent } from '../../../shared/autocomplete/autocomplete.component';
import { AutocompleteOption } from '../../../shared/autocomplete/autocomplete.model';

@Component({
  selector: 'app-attribute-control',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ComparatorComponent, MatIconModule, AutocompleteComponent],
  templateUrl: './attribute-control.component.html',
  styleUrl: './attribute-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AttributeControlComponent),
      multi: true,
    },
  ],
})
export class AttributeControlComponent implements ControlValueAccessor {
  currentEvent = input.required();
  properties = input.required<Property[]>();
  propertieNames = computed(() => this.properties().map((p) => ({value: p.property, label: p.property})));
  propertyNameTypeMap = computed(() => {
    return this.properties().reduce((acc, p) => {
      return {
        ...acc,
        [p.property]: p.type
      }
    }, {} as Record<string, TType>)
  })
  private fb = inject(FormBuilder);

  attributes = this.fb.array<typeof this.attributeControls>([]);

  autoOpen = signal(false);

  writeValue(attr: any[]): void {
    this.attributes.clear({ emitEvent: false });
    if (attr) {
      this.attributes.clear({ emitEvent: false });
      attr.forEach((a, i) => {
        const ctrl = this.attributeControls;
        ctrl.setValue({
          property: a.property,
          type: a.type,
          comparator: {
            comparator: a.comparator,
            value: a.value
          },
          key: Date.now() + i,
        });
        this.attributes.push(ctrl);
      })
    }
  }
  registerOnChange(fn: any): void {
      this.attributes.valueChanges.pipe(startWith(this.attributes.value)).subscribe(value => {
        if (value.length) {
          fn(value.map(v => ({
            property: v.property,
            comparator: v.comparator?.comparator,
            value: v.comparator?.value,
            type: v.type
          })))
        } else {
          fn(null);
        }
      });
  }
  registerOnTouched(fn: any): void {
      
  }

  onAttributeSelected(value: AutocompleteOption, ctrl: typeof this.attributeControls) {
    ctrl.get('comparator')?.setValue(null);
    if (value) {
      ctrl.get('type')?.patchValue(this.propertyNameTypeMap()[value.value]);
    }
  }

  get attributeControls() {
    return this.fb.group({
      key: Date.now(),
      property: [''],
      comparator: this.fb.control<any>(null),
      type: this.fb.control<TType>('string'),
    });
  }

  onRemove(index: number) {
    this.attributes
      .removeAt(index);
  }

  onAddAttribute() {
    this.attributes.push(this.attributeControls);
    this.autoOpen.set(true);
  }
}
