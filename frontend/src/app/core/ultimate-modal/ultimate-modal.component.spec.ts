import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimateModalComponent } from './ultimate-modal.component';

describe('UltimateModalComponent', () => {
  let component: UltimateModalComponent;
  let fixture: ComponentFixture<UltimateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UltimateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
