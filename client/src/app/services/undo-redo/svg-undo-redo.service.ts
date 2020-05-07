import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { KeyboardKey } from '../../enums/keyboard';
import { SvgUndoRedoChange } from '../../enums/svg';
import { SvgBoardJson } from '../../interfaces/svg-json';
import { SvgUndoRedoStacks } from '../../interfaces/svg-undo-redo-stacks';
import { KeyboardManagerService } from '../events/keyboard-manager.service';
import { SvgComponentsManagerService } from '../svg/svg-components-manager.service';

@Injectable({
  providedIn: 'root',
})
export class SvgUndoRedoService {
  svgComponentsManagerService: SvgComponentsManagerService | undefined;
  private undoStack: SvgBoardJson[];
  private redoStack: SvgBoardJson[];
  private stacksWillChangeOutput: Subject<SvgUndoRedoChange>;
  private stacksChangedOutput: Subject<SvgUndoRedoChange>;
  private userChangesNotChecked: boolean;

  constructor(public keyboardManagerService: KeyboardManagerService) {
    this.svgComponentsManagerService = undefined;
    this.undoStack = [];
    this.ensureUndoStackIsNotEmpty();
    this.redoStack = [];
    this.stacksWillChangeOutput = new Subject();
    this.stacksChangedOutput = new Subject();
    this.userChangesNotChecked = false;
  }

  initialize(svgComponentsManagerService: SvgComponentsManagerService): void {
    this.svgComponentsManagerService = svgComponentsManagerService;

    this.keyboardManagerService.getKeyboardStateObs().subscribe(() => {
      this.checkForKeyboardShortcut();
    });
  }

  checkForKeyboardShortcut(): void {
    if (this.keyboardManagerService.checkKeyboardShortcut([
        KeyboardKey.Ctrl,
        KeyboardKey.Z], [KeyboardKey.LShift])) {
      this.undo();
    }
    if (this.keyboardManagerService.checkKeyboardShortcut([
      KeyboardKey.Ctrl,
      KeyboardKey.LShift,
      KeyboardKey.Z], [])) {
      this.redo();
    }
  }

  checkIfAnyUserChanges(forgetUserChanges: boolean): boolean {
    const userChanges = this.userChangesNotChecked;
    if (forgetUserChanges) {
      this.userChangesNotChecked = false;
    }
    return userChanges;
  }

  saveSvgBoard(): void {
    if (this.svgComponentsManagerService !== undefined) {
      this.stacksWillChange(SvgUndoRedoChange.SaveCalled);
      this.undoStack.push(this.svgComponentsManagerService.getSvgBoard());
      this.redoStack = [];
      this.stacksHasChanged(true, SvgUndoRedoChange.SaveCalled);
    }
  }

  undoIsAvailable(): boolean {
    this.ensureLatestBoardChangesAreSaved();
    return this.undoStack.length > 1;
  }

  undo(): void {
    if (this.svgComponentsManagerService !== undefined && this.undoIsAvailable()) {
      this.stacksWillChange(SvgUndoRedoChange.UndoCalled);
      const lastSvgBoard = this.undoStack.pop();

      if (lastSvgBoard !== undefined) {
        this.redoStack.push(lastSvgBoard);
        const newUndoStackTop = this.undoStack[this.undoStack.length - 1];
        this.svgComponentsManagerService.loadSvgBoard(newUndoStackTop);
        this.stacksHasChanged(true, SvgUndoRedoChange.UndoCalled);
      }
    }
  }

  redoIsAvailable(): boolean {
    this.ensureLatestBoardChangesAreSaved();
    return this.redoStack.length > 0;
  }

  redo(): void {
    if (this.svgComponentsManagerService !== undefined && this.redoIsAvailable()) {
      this.stacksWillChange(SvgUndoRedoChange.RedoCalled);
      const newSvgBoard = this.redoStack.pop();

      if (newSvgBoard !== undefined) {
        this.svgComponentsManagerService.loadSvgBoard(newSvgBoard);
        this.undoStack.push(newSvgBoard);
        this.stacksHasChanged(true, SvgUndoRedoChange.RedoCalled);
      }
    }
  }

  getStacksWillChangeObs(): Observable<SvgUndoRedoChange> {
    return this.stacksWillChangeOutput.asObservable();
  }

  getStacksChangedObs(): Observable<SvgUndoRedoChange> {
    return this.stacksChangedOutput.asObservable();
  }

  getStacks(): SvgUndoRedoStacks {
    this.ensureLatestBoardChangesAreSaved();
    return {
      undoStack: this.undoStack,
      redoStack: this.redoStack,
    };
  }

  reset(): void {
    this.loadStacks({undoStack: [], redoStack: []});
  }

  loadStacks(undoRedoStacks: SvgUndoRedoStacks): void {
    this.userChangesNotChecked = false;
    this.stacksWillChange(SvgUndoRedoChange.LoadCalled);
    this.undoStack = undoRedoStacks.undoStack;
    this.ensureUndoStackIsNotEmpty();
    this.redoStack = undoRedoStacks.redoStack;
    this.stacksHasChanged(false, SvgUndoRedoChange.LoadCalled);
  }

  private stacksWillChange(svgUndoRedoChange: SvgUndoRedoChange): void {
    this.stacksWillChangeOutput.next(svgUndoRedoChange);
  }

  private stacksHasChanged(userChanges: boolean, svgUndoRedoChange: SvgUndoRedoChange): void {
    if (userChanges) {
      this.userChangesNotChecked = true;
    }
    this.stacksChangedOutput.next(svgUndoRedoChange);
  }

  private ensureLatestBoardChangesAreSaved(): boolean {
    if (this.svgComponentsManagerService !== undefined) {
      this.svgComponentsManagerService.saveBoardIfRequired();
      return true;
    }
    return false;
  }

  private ensureUndoStackIsNotEmpty(): void {
    if (this.undoStack.length === 0) {
      this.undoStack.push({components: []});
    }
  }
}
