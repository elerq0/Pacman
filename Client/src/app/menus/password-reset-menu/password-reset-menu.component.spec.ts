import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetMenuComponent } from './password-reset-menu.component';

describe('PasswordResetMenuComponent', () => {
  let component: PasswordResetMenuComponent;
  let fixture: ComponentFixture<PasswordResetMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
