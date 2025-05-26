import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderSidebarComponent } from './folder-sidebar.component';

describe('FolderSidebarComponent', () => {
  let component: FolderSidebarComponent;
  let fixture: ComponentFixture<FolderSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
