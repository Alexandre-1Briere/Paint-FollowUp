import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgRectangleComponent } from './svg-rectangle.component';

describe('SvgRectangleComponent', () => {
  let component: SvgRectangleComponent;
  let fixture: ComponentFixture<SvgRectangleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgRectangleComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgRectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
