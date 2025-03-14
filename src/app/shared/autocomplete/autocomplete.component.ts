import {
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  input,
  OnInit,
  output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { AutocompleteOption } from './autocomplete.model';
import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { map, startWith, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    OverlayModule,
    MatIconModule,
    NgClass,
    AsyncPipe,
    NgTemplateOutlet,
    AsyncPipe,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit {
  placeholder = input();
  open = input<boolean>();
  searchPlaceholer = input('Filter options...');
  options = input.required<AutocompleteOption[]>();
  isOpen = false;

  searchCtrl = new FormControl();
  ctrl = new FormControl();

  optionSelected = output<AutocompleteOption>();

  selectedValue$ = this.ctrl.valueChanges.pipe(
    startWith(this.ctrl.value),
    map(() => {
      const selectedOption = this.options().find(o => o.value === this.ctrl.value);
      return selectedOption?.label || this.ctrl.value || this.placeholder();
    })
  );

  @ViewChild('searchInput') private searchInput: ElementRef | null = null;

  filteredOptions$ = toObservable(this.options).pipe(
    switchMap((options) => {
      return this.searchCtrl.valueChanges.pipe(
        startWith(''),
        map((value) => {
          if (!value) {
            return options;
          }
          return options.filter((option) => {
            return (
              option.label.toLowerCase().includes(value.toLowerCase()) ||
              option.value.toLowerCase().includes(value.toLowerCase())
            );
          });
        })
      );
    })
  );

  @ContentChild('customHeaderTemplate', { static: false })
  headerTemplateRef: TemplateRef<any>;

  ngOnInit(): void {
    if (this.open()) {
      this.isOpen = true;
      this.focusInput();
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.ctrl.patchValue(value);
    } else {
      this.ctrl.reset();
    }
  }
  registerOnChange(fn: any): void {
    this.ctrl.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {}

  toggle() {
    this.isOpen = !this.isOpen;
    this.searchCtrl.patchValue('')
    this.focusInput();
  }

  focusInput() {
    setTimeout(() => {
      if (this.searchInput?.nativeElement && this.isOpen) {
        this.searchInput.nativeElement.focus();
      }
    }, 100);
  }

  onSelect(option: AutocompleteOption) {
    this.optionSelected.emit(option);
    this.ctrl.patchValue(option.value);
    this.isOpen = false;
  }
}
