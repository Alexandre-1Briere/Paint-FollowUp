import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { KEY_DOWN } from '../../constants/keyboard';
import { KeyboardManagerService } from '../../services/events/keyboard-manager.service';
import {TestSpeedUpgrader} from '../../testHelpers/test-speed-upgrader.spec';
import { UseGuideComponent } from './use-guide.component';

describe('UseGuideComponent', () => {
  let component: UseGuideComponent;
  let fixture: ComponentFixture<UseGuideComponent>;

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
    fixture = TestBed.createComponent(UseGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the index 0 in the flatten dictionary of tools', () => {
    component.documented = component.flattenToolsDictionary[0];
    const index1 = component.findCurrentToolIndex();
    expect(index1).toBe(0);
  });

  it('should return the length-1 of the tool in the flatten dictionary of tools', () => {
    const length = component.flattenToolsDictionary.length;

    component.documented = component.flattenToolsDictionary[length - 1];
    const index = component.findCurrentToolIndex();
    expect(index).toBe(length - 1);
  });

  it('\'should become the previous tool. It is the first tool, it remains the first tool\'', () => {
    component.toolIndex = 0;
    component.documented = component.flattenToolsDictionary[component.toolIndex];
    component.updateToolStatus();
    component.setPreviousTool();
    expect(component.toolIndex).toBe(0);
  });

  it('should become the previous tool. It is the third tool, it should become the second tool', () => {
    component.toolIndex = 2;
    component.documented = component.flattenToolsDictionary[component.toolIndex];
    component.updateToolStatus();
    component.setPreviousTool();
    expect(component.toolIndex).toBe(1);
  });

  it('should become the previous tool. It is the last tool, it should become the previous-to-last tool', () => {
    const TOOLS_LEN = component.flattenToolsDictionary.length;

    component.toolIndex = TOOLS_LEN - 1;
    component.documented = component.flattenToolsDictionary[component.toolIndex];
    component.updateToolStatus();
    component.setPreviousTool();
    expect(component.toolIndex).toBe(TOOLS_LEN - 2);
  });

  it('should become the next tool. It is the first tool, it should become the second tool', () => {
    component.toolIndex = 0;
    component.documented = component.flattenToolsDictionary[component.toolIndex];
    component.updateToolStatus();
    component.setNextTool();
    expect(component.toolIndex).toBe(1);
  });

  it('should become the next tool. It is the second-to-last tool, it should become the last tool', () => {
    const TOOLS_LEN = component.flattenToolsDictionary.length;

    component.toolIndex = TOOLS_LEN - 2;
    component.documented = component.flattenToolsDictionary[component.toolIndex];
    component.updateToolStatus();
    component.setNextTool();
    expect(component.toolIndex).toBe(TOOLS_LEN - 1);
  });

  it('should become the next tool. It is the last tool, it remains the last tool', () => {
    const TOOLS_LEN = component.flattenToolsDictionary.length;

    component.toolIndex = TOOLS_LEN - 1;
    component.documented = component.flattenToolsDictionary[component.toolIndex];
    component.updateToolStatus();
    component.setNextTool();
    expect(component.toolIndex).toBe(TOOLS_LEN - 1);
  });

  it('should update the hasPrevious and hasNext values', () => {
    component.toolIndex = 0;
    component.updateToolStatus();
    expect(component.hasPrevious).toBe(false);
    expect(component.hasNext).toBe(true);
  });

  it('should update the hasPrevious and hasNext values', () => {
    component.toolIndex = 1;
    component.updateToolStatus();
    expect(component.hasPrevious).toBe(true);
    expect(component.hasNext).toBe(true);
  });

  it('should update the hasPrevious and hasNext values', () => {
    component.toolIndex = component.flattenToolsDictionary.length - 1;
    component.updateToolStatus();
    expect(component.hasPrevious).toBe(true);
    expect(component.hasNext).toBe(false);
  });

  it('#onkeyboardEvent() calls keyboardManagerService.receiveKeyboardEvent after keydown event', () => {
    const keyboardManagerService = TestBed.get(KeyboardManagerService);
    spyOn(keyboardManagerService, 'receiveKeyboardEvent');
    window.dispatchEvent(new KeyboardEvent(KEY_DOWN));
    expect(keyboardManagerService.receiveKeyboardEvent).toHaveBeenCalled();
  });

  it('#previousPage() calls location.back', () => {
    spyOn(component.location, 'back');
    component.previousPage();
    expect(component.location.back).toHaveBeenCalled();
  });

  it('should find the index of the currently selected tool. The selected tool is the first tool', () => {
    const index = 0;
    component.onToolClick(component.flattenToolsDictionary[index]);
    expect(component.toolIndex).toBe(index);

  });

  it('should find the index of the currently selected tool. The selected tool is the last tool', () => {
    const index = component.flattenToolsDictionary.length - 1;
    component.onToolClick(component.flattenToolsDictionary[index]);
    expect(component.toolIndex).toBe(index);
  });
});
