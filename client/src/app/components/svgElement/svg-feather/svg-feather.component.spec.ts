import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgFeatherComponent } from './svg-feather.component';

describe('SvgFeatherComponent', () => {
  let component: SvgFeatherComponent;
  let fixture: ComponentFixture<SvgFeatherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgFeatherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgFeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
