import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgBucketComponent } from './svg-bucket.component';

describe('SvgBucketComponent', () => {
  let component: SvgBucketComponent;
  let fixture: ComponentFixture<SvgBucketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgBucketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
