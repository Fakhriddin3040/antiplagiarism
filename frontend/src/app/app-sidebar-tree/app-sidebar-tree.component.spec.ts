import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSidebarTreeComponent } from './app-sidebar-tree.component';

describe('AppSidebarTreeComponent', () => {
  let component: AppSidebarTreeComponent;
  let fixture: ComponentFixture<AppSidebarTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSidebarTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSidebarTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
