import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainsSelectorComponent } from './contains-selector.component';

describe('ContainsSelectorComponent', () => {
  let component: ContainsSelectorComponent;
  let fixture: ComponentFixture<ContainsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainsSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
