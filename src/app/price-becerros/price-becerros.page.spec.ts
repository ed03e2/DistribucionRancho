import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceBecerrosPage } from './price-becerros.page';

describe('PriceBecerrosPage', () => {
  let component: PriceBecerrosPage;
  let fixture: ComponentFixture<PriceBecerrosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceBecerrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
