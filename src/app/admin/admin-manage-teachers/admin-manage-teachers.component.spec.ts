import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageTeachersComponent } from './admin-manage-teachers.component';

describe('AdminManageTeachersComponent', () => {
  let component: AdminManageTeachersComponent;
  let fixture: ComponentFixture<AdminManageTeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageTeachersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
