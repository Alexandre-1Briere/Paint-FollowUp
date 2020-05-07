import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPolygonComponent } from './svg-polygon.component';

describe('SvgPolygonComponent', () => {
  let component: SvgPolygonComponent;
  let fixture: ComponentFixture<SvgPolygonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgPolygonComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgPolygonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
