import { Component, inject,  } from '@angular/core';
import { EventsService } from './services/events.service';
import { FilterItemComponent } from './components/filter-item/filter-item.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FilterItemComponent, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  filters = [];
  private fb = inject(FormBuilder);
  private eventsService = inject(EventsService);

  form = this.fb.group({
    filters: this.fb.array<FormControl<any>>([])
  })

  constructor() {
    this.eventsService.loadEvents();
    this.onAddStep();
  }

  get filtersCtrl() {
    return this.form.controls.filters;
  }

  onAddStep() {
    this.filtersCtrl.push(this.fb.control(null));
  }

  onRemoveFilter(index: number) {
    this.filtersCtrl.removeAt(index);
  }

  onCopyFilter(ctrl: AbstractControl, index: number) {
    const filter = ctrl.value;
    if (filter) {
      this.filtersCtrl.insert(index + 1, this.fb.control(filter));
    }
  }

  onApply() {
    console.log(this.form.value);
  }

  onDiscard() {
    this.filtersCtrl.clear()
    this.onAddStep()
  }
}
