import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../../app.module';
import {TestSpeedUpgrader} from '../../../testHelpers/test-speed-upgrader.spec';
import { WorkBoardComponent } from './work-board.component';

describe('WorkBoardComponent', () => {
  let component: WorkBoardComponent;
  let fixture: ComponentFixture<WorkBoardComponent>;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  /*it('#determineColorShift() returns negative value when 1 of RGB values is greater than threshold', () => {
    component.backgroundColor = '#00bb00';
    expect(component.determineColorShift()).toBeLessThan(0);
  });

  it('#determineColorShift() returns positive value when none of RGB values is greater than threshold', () => {
    component.backgroundColor = '#888888';
    expect(component.determineColorShift()).toBeGreaterThan(0);
  });*/

  /*it('#getRGB() works as expected with valid input', () => {
    const RED = 'ae';
    const GREEN = '09';
    const BLUE  = 'f1';
    const COLOR = '#' + RED + GREEN + BLUE;
    const colors = component.getRGB(COLOR);

    const RED_INDEX = 0;
    const RED_AMOUNT = 174;
    const GREEN_INDEX = 1;
    const GREEN_AMOUNT = 9;
    const BLUE_INDEX = 2;
    const BLUE_AMOUNT = 241;
    expect(colors[RED_INDEX]).toBe(RED_AMOUNT);
    expect(colors[GREEN_INDEX]).toBe(GREEN_AMOUNT);
    expect(colors[BLUE_INDEX]).toBe(BLUE_AMOUNT);
  });
*/
  /*it('#getRGB() works as expected with valid input, when # is absent', () => {
    const RED = '00';
    const GREEN = '11';
    const BLUE  = '22';
    const COLOR = RED + GREEN + BLUE;
    const colors = component.getRGB(COLOR);

    const RED_INDEX = 0;
    const RED_AMOUNT = 0;
    const GREEN_INDEX = 1;
    const GREEN_AMOUNT = 17;
    const BLUE_INDEX = 2;
    const BLUE_AMOUNT = 34;
    expect(colors[RED_INDEX]).toBe(RED_AMOUNT);
    expect(colors[GREEN_INDEX]).toBe(GREEN_AMOUNT);
    expect(colors[BLUE_INDEX]).toBe(BLUE_AMOUNT);
  });

  it('#modifyColorBrightness() works as expected with valid input', () => {
    const COLOR = '#0011aa';
    const AMOUNT = 85;
    const EXPECTED_COLOR = '#5566ff';
    expect(component.modifyColorBrightness(COLOR, AMOUNT)).toBe(EXPECTED_COLOR);
  });*/

  it ('#onResize should been called on a window resize', () => {
    component.onResize();
    expect(component.maxSize).toBe(component.screenSizeService.getScreenWidth());
  });
});
