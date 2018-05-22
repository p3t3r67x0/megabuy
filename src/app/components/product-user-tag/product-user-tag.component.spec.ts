import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUserTagComponent } from './product-user-tag.component';

describe('ProductUserTagComponent', () => {
  let component: ProductUserTagComponent;
  let fixture: ComponentFixture<ProductUserTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductUserTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductUserTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
