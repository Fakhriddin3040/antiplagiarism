import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorDataTableComponent } from './author.data-table.component';

describe('AuthorDataTableComponent', () => {
  let component: AuthorDataTableComponent;
  let fixture: ComponentFixture<AuthorDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
