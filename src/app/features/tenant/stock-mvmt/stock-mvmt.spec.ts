import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMvmt } from './stock-mvmt';

describe('StockMvmt', () => {
  let component: StockMvmt;
  let fixture: ComponentFixture<StockMvmt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMvmt],
    }).compileComponents();

    fixture = TestBed.createComponent(StockMvmt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
