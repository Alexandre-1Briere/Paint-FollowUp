import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../../app.module';
import { OPTION_SLIDE_TOGGLE, OPTION_SLIDER } from '../../../constants/options-types';
import { Option } from '../../../services/tool-manager/tools-options-manager/tools-options/option';
import {TestSpeedUpgrader} from '../../../testHelpers/test-speed-upgrader.spec';
import { ApplicableSettingClass, ENABLE_POINTS, POINTS_SIZE } from './applicable-setting.class';
import { ToolDetailComponent } from './tool-detail.component';

// tslint:disable:no-any
// Reason: allow spy-on
describe('ToolDetailComponent', () => {
  let component: ToolDetailComponent;
  let fixture: ComponentFixture<ToolDetailComponent>;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
    })
    .compileComponents();
    fixture = TestBed.createComponent(ToolDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#updateBackground should emit an event', () => {
    // spy on event emitter
    spyOn(component.backgroundChanged, 'emit');
    component.updateBackground('#FFFFFF');
    fixture.detectChanges();

    expect(component.backgroundChanged.emit).toHaveBeenCalledWith('#FFFFFF');
  });

  it('applicable-setting.setValue should return a 1 for [assignee = Infinity]', () => {
    const settings = new ApplicableSettingClass();
    const value = settings.setValue(Infinity.toString());
    expect(value).toBe(1);
  });

  it('applicable-settings.setValue should return a 1 for [assignee > 0]', () => {
    const settings = new ApplicableSettingClass();
    const value = settings.setValue((0).toString());
    expect(value).toBe(1);
  });

  it('applicable-settings.getPointsSizeFromOptions returns false when' +
      ' enabled && option && enabled.default', () => {
    const settings = new ApplicableSettingClass();
    spyOn<any>(settings, 'findOptionWithName').and.callFake(
        (param: string) => {
          if (param.toLowerCase() === POINTS_SIZE.toLowerCase()) {
            return {
              name: POINTS_SIZE,
              label: 'Taille des jonctions',
              enabled: true,
              default: 15,
              choices: [],
              min: 1,
              max: 100,
              type: OPTION_SLIDER,
            } as Option;
          } else if (param.toLowerCase() === ENABLE_POINTS.toLowerCase()) {
            return {
              name: ENABLE_POINTS,
              label: 'Jonctions visibles',
              enabled: true,
              default: false,
              choices: [],
              min: undefined,
              max: undefined,
              type: OPTION_SLIDE_TOGGLE,
            } as Option;
          }
          return undefined;
        },
      );

    const value = settings.getPointsSizeFromOptions();
    expect(value).toBeFalsy();
  });

  it('applicable-settings.getPointsSizeFromOptions returns undefined' +
      ' when enabled && option && enabled.default === undefined', () => {
    const settings = new ApplicableSettingClass();
    spyOn<any>(settings, 'findOptionWithName').and.callFake(
        (param: string) => {
          if (param.toLowerCase() === POINTS_SIZE.toLowerCase()) {
            return {
              name: POINTS_SIZE,
              label: 'Taille des jonctions',
              enabled: true,
              default: 15,
              choices: [],
              min: 1,
              max: 100,
              type: OPTION_SLIDER,
            } as Option;
          } else if (param.toLowerCase() === ENABLE_POINTS.toLowerCase()) {
            return {
              name: ENABLE_POINTS,
              label: 'Jonctions visibles',
              enabled: true,
              default: undefined,
              choices: [],
              min: undefined,
              max: undefined,
              type: OPTION_SLIDE_TOGGLE,
            } as Option;
          }
          return undefined;
        },
    );

    const value = settings.getPointsSizeFromOptions();
    expect(value).toBeUndefined();
  });

  it('applicable-settings.getPointsSizeFromOptions returns undefined' +
      ' when enabled && option && enabled.default === undefined', () => {
    const settings = new ApplicableSettingClass();
    const DEFAULT_VALUE = 15;
    spyOn<any>(settings, 'findOptionWithName').and.callFake(
        (param: string) => {
          if (param.toLowerCase() === POINTS_SIZE.toLowerCase()) {
            return {
              name: POINTS_SIZE,
              label: 'Taille des jonctions',
              enabled: true,
              default: DEFAULT_VALUE,
              choices: [],
              min: 1,
              max: 100,
              type: OPTION_SLIDER,
            } as Option;
          }
          return undefined;
        },
    );

    const value = settings.getPointsSizeFromOptions();
    expect(value).toBe(DEFAULT_VALUE);
  });

});
