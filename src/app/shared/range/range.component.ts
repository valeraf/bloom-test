import { JsonPipe } from '@angular/common';
import { Component, forwardRef, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-range',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './range.component.html',
  styleUrl: './range.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeComponent),
      multi: true,
    },
  ],
})
export class RangeComponent implements ControlValueAccessor {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    from: [0],
    to: [0],
  });

  writeValue(data: any): void {
    if (data) {
      this.form.setValue(data);
    } else {
      this.form.setValue({
        from: 0,
        to: 0,
      });
    }
  }
  registerOnChange(fn: any): void {
    this.form.valueChanges.pipe(startWith(this.form.value)).subscribe(val => {
      fn(val)
    });
  }
  registerOnTouched(fn: any): void {}
}
