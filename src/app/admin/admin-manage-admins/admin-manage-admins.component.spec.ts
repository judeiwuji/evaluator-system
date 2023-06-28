import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageAdminsComponent } from './admin-manage-admins.component';

describe('AdminManageAdminsComponent', () => {
  let component: AdminManageAdminsComponent;
  let fixture: ComponentFixture<AdminManageAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminManageAdminsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
