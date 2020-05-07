import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPolylineComponent } from './svg-polyline.component';

describe('SvgPolylineComponent', () => {
  let component: SvgPolylineComponent;
  let fixture: ComponentFixture<SvgPolylineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgPolylineComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgPolylineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
