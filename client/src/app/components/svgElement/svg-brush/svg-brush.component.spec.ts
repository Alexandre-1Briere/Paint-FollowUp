import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgBrushComponent } from './svg-brush.component';

describe('SvgBrushComponent', () => {
  let component: SvgBrushComponent;
  let fixture: ComponentFixture<SvgBrushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgBrushComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgBrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
