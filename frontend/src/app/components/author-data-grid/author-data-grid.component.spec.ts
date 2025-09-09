import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDataGridComponent } from './author-data-grid.component';

describe('AuthorDataGridComponent', () => {
  let component: AuthorDataGridComponent;
  let fixture: ComponentFixture<AuthorDataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorDataGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
