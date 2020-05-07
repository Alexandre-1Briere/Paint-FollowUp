import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgPencilComponent } from './svg-pencil.component';

describe('SvgPencilComponent', () => {
  let component: SvgPencilComponent;
  let fixture: ComponentFixture<SvgPencilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgPencilComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgPencilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
