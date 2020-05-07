import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgAerosolComponent } from './svg-aerosol.component';

describe('SvgAerosolComponent', () => {
  let component: SvgAerosolComponent;
  let fixture: ComponentFixture<SvgAerosolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgAerosolComponent ] ,
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgAerosolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
