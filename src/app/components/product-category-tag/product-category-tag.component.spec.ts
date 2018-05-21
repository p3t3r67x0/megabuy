import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryTagComponent } from './product-category-tag.component';

describe('ProductCategoryTagComponent', () => {
  let component: ProductCategoryTagComponent;
  let fixture: ComponentFixture<ProductCategoryTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCategoryTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
