import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStockMvmt } from './manage-stock-mvmt';

describe('ManageStockMvmt', () => {
  let component: ManageStockMvmt;
  let fixture: ComponentFixture<ManageStockMvmt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStockMvmt],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageStockMvmt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
