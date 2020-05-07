import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgSelectionComponent } from './svg-selection.component';

describe('SvgSelectionComponent', () => {
  let component: SvgSelectionComponent;
  let fixture: ComponentFixture<SvgSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgSelectionComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
