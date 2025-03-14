import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeControlComponent } from './attribute-control.component';

describe('AttributeControlComponent', () => {
  let component: AttributeControlComponent;
  let fixture: ComponentFixture<AttributeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributeControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
