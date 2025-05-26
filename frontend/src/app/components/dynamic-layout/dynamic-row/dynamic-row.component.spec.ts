import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRowComponent } from './dynamic-row.component';

describe('DynamicRowComponent', () => {
  let component: DynamicRowComponent;
  let fixture: ComponentFixture<DynamicRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
