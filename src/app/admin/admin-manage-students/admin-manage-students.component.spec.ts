import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageStudentsComponent } from './admin-manage-students.component';

describe('AdminManageStudentsComponent', () => {
  let component: AdminManageStudentsComponent;
  let fixture: ComponentFixture<AdminManageStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageStudentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
