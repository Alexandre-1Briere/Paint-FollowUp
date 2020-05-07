import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgEllipseComponent } from './svg-ellipse.component';

describe('SvgEllipseComponent', () => {
  let component: SvgEllipseComponent;
  let fixture: ComponentFixture<SvgEllipseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgEllipseComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgEllipseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
