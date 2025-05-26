import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorModelPickerComponent } from './author-model-picker.component';

describe('AuthorModelPickerComponent', () => {
  let component: AuthorModelPickerComponent;
  let fixture: ComponentFixture<AuthorModelPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorModelPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorModelPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
