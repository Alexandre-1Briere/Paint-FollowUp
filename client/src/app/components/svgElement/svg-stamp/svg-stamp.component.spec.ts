import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgStampComponent } from './svg-stamp.component';

describe('SvgStampComponent', () => {
  let component: SvgStampComponent;
  let fixture: ComponentFixture<SvgStampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgStampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
