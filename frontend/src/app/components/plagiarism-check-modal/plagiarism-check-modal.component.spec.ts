import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlagiarismCheckModalComponent } from './plagiarism-check-modal.component';

describe('PlagiarismCheckModalComponent', () => {
  let component: PlagiarismCheckModalComponent;
  let fixture: ComponentFixture<PlagiarismCheckModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlagiarismCheckModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlagiarismCheckModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
