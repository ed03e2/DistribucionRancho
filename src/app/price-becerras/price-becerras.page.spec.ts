import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceBecerrasPage } from './price-becerras.page';

describe('PriceBecerrasPage', () => {
  let component: PriceBecerrasPage;
  let fixture: ComponentFixture<PriceBecerrasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceBecerrasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
