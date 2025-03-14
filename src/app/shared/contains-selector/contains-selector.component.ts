import { Component, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contains-selector',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './contains-selector.component.html',
  styleUrl: './contains-selector.component.scss',
  providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ContainsSelectorComponent),
        multi: true,
      },
  ],
})
export class ContainsSelectorComponent implements ControlValueAccessor {
  private fb = inject(FormBuilder);
  ctrl = this.fb.control('');

  writeValue(data: any): void {
      if (data) {
        this.ctrl.setValue(data);
      }
  }
  registerOnChange(fn: any): void {
    this.ctrl.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
      
  }

}
