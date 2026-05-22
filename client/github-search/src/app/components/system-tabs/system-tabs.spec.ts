import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemTabs } from './system-tabs';

describe('SystemTabs', () => {
  let component: SystemTabs;
  let fixture: ComponentFixture<SystemTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
