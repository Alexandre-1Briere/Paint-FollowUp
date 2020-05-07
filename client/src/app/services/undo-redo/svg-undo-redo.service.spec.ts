import { TestBed } from '@angular/core/testing';

import { SvgComponentsManagerService } from '../svg/svg-components-manager.service';
import { SvgUndoRedoService } from './svg-undo-redo.service';

describe('SvgUndoRedoService', () => {
  let service: SvgUndoRedoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SvgUndoRedoService,
        SvgComponentsManagerService
      ],
    });

    service = TestBed.get(SvgUndoRedoService);
    service.initialize(TestBed.get(SvgComponentsManagerService));
  });

  it('should be created', () => {
    const undoRedoService: SvgUndoRedoService = TestBed.get(SvgUndoRedoService);
    expect(undoRedoService).toBeTruthy();
  });

  it('undoStack is not empty', () => {
    expect(service.getStacks().undoStack.length).toBe(1);
  });

  it('#checkForKeyboardShortcut() calls undo when shortcut is pressed', () => {
    spyOn(service.keyboardManagerService, 'checkKeyboardShortcut').and.returnValue(true);
    spyOn(service, 'undo');
    service.checkForKeyboardShortcut();
    expect(service.undo).toHaveBeenCalled();
  });

  it('#checkForKeyboardShortcut() calls redo when shortcut is pressed', () => {
    spyOn(service.keyboardManagerService, 'checkKeyboardShortcut').and.returnValue(true);
    spyOn(service, 'redo');
    service.checkForKeyboardShortcut();
    expect(service.redo).toHaveBeenCalled();
  });

  it('#checkIfAnyUserChanges() returns false by default', () => {
    expect(service.checkIfAnyUserChanges(false)).toBeFalsy();
  });

  it('#checkIfAnyUserChanges() returns true after saveSvgBoard', () => {
    service.saveSvgBoard();
    expect(service.checkIfAnyUserChanges(false)).toBeTruthy();
  });

  it('#checkIfAnyUserChanges() returns true after undo', () => {
    service.saveSvgBoard();
    expect(service.checkIfAnyUserChanges(true)).toBeTruthy();
    expect(service.checkIfAnyUserChanges(true)).toBeFalsy();
    service.undo();
    expect(service.checkIfAnyUserChanges(false)).toBeTruthy();
  });

  it('#checkIfAnyUserChanges() returns true after redo', () => {
    service.saveSvgBoard();
    service.undo();
    expect(service.checkIfAnyUserChanges(true)).toBeTruthy();
    expect(service.checkIfAnyUserChanges(true)).toBeFalsy();
    service.redo();
    expect(service.checkIfAnyUserChanges(false)).toBeTruthy();
  });

  it('#saveSvgBoard() adds board to undoStack', () => {
    expect(service.getStacks().undoStack.length).toBe(1);
    service.saveSvgBoard();
    expect(service.getStacks().undoStack.length).toBe(2);

    service.saveSvgBoard();
    service.saveSvgBoard();
    const EXPECT_UNDO_STACK_SIZE = 4;
    expect(service.getStacks().undoStack.length).toBe(EXPECT_UNDO_STACK_SIZE);
  });

  it('#saveSvgBoard() should do nothing if the component manager is undefined', () => {
    // spyOn any utiliser pour faire un spy sur une methode privé
    // tslint:disable-next-line:no-any
    const spy = spyOn<any>(service, 'stacksHasChanged');
    service.svgComponentsManagerService = undefined;
    service.saveSvgBoard();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#undo() should do nothing if the pop return an undefined value', () => {
    service.saveSvgBoard();
    expect(service.getStacks().undoStack.length).toBe(2);
    const stackName = 'undoStack';
    const spy = spyOn(service[stackName], 'pop').and.callThrough().and.returnValue(undefined);
    service.undo();
    expect(spy).toHaveBeenCalled();
    expect(service.getStacks().undoStack.length).toBe(2);
    expect(service.getStacks().redoStack.length).toBe(0);
  });

  it('#redo() removes board to redoStack and adds it to undoStack', () => {
    service.saveSvgBoard();
    service.undo();
    service.redo();
    expect(service.getStacks().undoStack.length).toBe(2);
    expect(service.getStacks().redoStack.length).toBe(0);
  });

  it('#redo() should do nothing if the pop return an undefined value', () => {
    service.saveSvgBoard();
    expect(service.getStacks().undoStack.length).toBe(2);
    const stackName = 'redoStack';
    const spy = spyOn(service[stackName], 'pop').and.callThrough().and.returnValue(undefined);
    service.undo();
    service.redo();
    expect(spy).toHaveBeenCalled();
    expect(service.getStacks().undoStack.length).toBe(1);
    expect(service.getStacks().redoStack.length).toBe(1);
  });

  it('#Complex use of undo redo is working as expected', () => {
    const REPETITIONS = 3;
    for (let n = 0; n < REPETITIONS; ++n) {
      for (let m = 0; m < REPETITIONS; ++m) {
        service.saveSvgBoard();
        service.undo();
      }
      service.redo();
    }
    expect(service.getStacks().undoStack.length).toBe(1 + REPETITIONS);
    expect(service.getStacks().redoStack.length).toBe(0);
  });

  it('#ensureLatestBoardChangesAreSaved() should not call saveBoardIfRequired if the component manager is undefined', () => {
    const functionName = 'ensureLatestBoardChangesAreSaved';
    service.svgComponentsManagerService = undefined;
    const value = service[functionName]();
    expect(value).not.toBeTruthy();
  });

  it('#loadStacks() is working properly, and undoStack is not empty', () => {
    service.saveSvgBoard();
    service.saveSvgBoard();
    service.undo();
    const STACKS = {
      undoStack: [],
      redoStack: [],
    };
    service.loadStacks(STACKS);
    expect(service.getStacks().undoStack.length).toBe(1);
    expect(service.getStacks().redoStack.length).toBe(0);
  });
});
