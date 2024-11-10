import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeloginPage } from './homelogin.page';

describe('HomeloginPage', () => {
  let component: HomeloginPage;
  let fixture: ComponentFixture<HomeloginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeloginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
