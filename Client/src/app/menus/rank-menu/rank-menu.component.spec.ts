import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankMenuComponent } from './rank-menu.component';

describe('RankMenuComponent', () => {
  let component: RankMenuComponent;
  let fixture: ComponentFixture<RankMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
