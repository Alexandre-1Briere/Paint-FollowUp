import { Injectable } from '@angular/core';
import { SvgGridComponent } from '../../components/svgElement/svg-grid/svg-grid.component';
import { KeyboardKey } from '../../enums/keyboard';
import { SvgLayer, SvgStatus, SvgType } from '../../enums/svg';
import { KeyboardManagerService } from '../events/keyboard-manager.service';
import { SvgComponentsManagerService } from '../svg/svg-components-manager.service';
import { SvgUndoRedoService } from '../undo-redo/svg-undo-redo.service';

@Injectable({
  providedIn: 'root',
})
export class GridManagerService {

  static readonly MIN_SIZE: number = 6;
  static readonly MAX_SIZE: number = 500;
  static readonly SIZE_AUTO_MULTIPLE_OF: number = 5;
  static readonly MIN_OPACITY: number = 0.20;
  static readonly MAX_OPACITY: number = 1;
  static readonly DEFAULT_SIZE: number = 50;
  static readonly DEFAULT_PRIMARY_OPACITY: number = GridManagerService.MAX_OPACITY;

  isActive: boolean;
  size: number;
  grid: SvgGridComponent | undefined;

  primaryOpacity: number | undefined;
  secondaryOpacity: number | undefined;

  constructor(public keyboardManagerService: KeyboardManagerService,
              private svgComponentsManagerService: SvgComponentsManagerService,
              private svgUndoRedoService: SvgUndoRedoService) {
    this.setSize(GridManagerService.DEFAULT_SIZE);
    this.keyboardManagerService.getKeyboardStateObs().subscribe(() => {
      this.checkForKeyboardShortcut();
    });
    this.svgUndoRedoService.getStacksChangedObs().subscribe(() => {
      this.refreshGrid();
    });
    this.refresh();
  }

  checkForKeyboardShortcut(): void {
    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.G], [KeyboardKey.Ctrl])) {
      this.toggleIsActive();
      this.refresh();
    }
    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.Plus], [])) {
      this.growGrid();
      this.refresh();
    }
    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.Minus], [])) {
      this.shrinkGrid();
      this.refresh();
    }
  }

  shrinkGrid(): boolean {
    const scl = GridManagerService.SIZE_AUTO_MULTIPLE_OF;
    const newSizeCandidate = Math.ceil((this.getSize() - scl) / scl) * scl;
    return this.setSize(newSizeCandidate);
  }

  growGrid(): boolean {
    const scl = GridManagerService.SIZE_AUTO_MULTIPLE_OF;
    const newSizeCandidate = Math.floor((this.getSize() + scl) / scl) * scl;
    return this.setSize(newSizeCandidate);
  }

  setIsActive(isActive: boolean): void {
    this.isActive = isActive;
    this.refreshGrid();
  }

  refreshGrid(): void {
    this.removeGrid();
    if (this.isActive) { this.displayGrid(); }
  }

  removeGrid(): void {
    this.svgComponentsManagerService.resetSvgComponents(SvgLayer.Grid);
  }

  refresh(): void {
    if (!this.grid) { return; }
    this.grid.setCellSize(this.size);
    this.grid.setPrimaryOpacity(this.primaryOpacity ? this.primaryOpacity : GridManagerService.DEFAULT_PRIMARY_OPACITY);
  }

  displayGrid(): void {
    this.grid = this.svgComponentsManagerService.createSvgComponent({
      onTopOfLayer: true,
      svgStatus: SvgStatus.InProgress,
      svgLayer: SvgLayer.Grid,
      svgType: SvgType.SvgGridComponent,
    }) as SvgGridComponent;

    this.refresh();
  }

  toggleIsActive(): void {
    this.setIsActive(!this.getIsActive());
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  validateSize(size: number): boolean {
    const minValid = GridManagerService.MIN_SIZE <= size;
    const maxValid = GridManagerService.MAX_SIZE ? size <= GridManagerService.MAX_SIZE : true;
    return minValid && maxValid;
  }

  setSize(size: number): boolean {
    if (!this.validateSize(size)) {
      return false;
    }

    this.size = size;
    this.refresh();
    return true;
  }

  getSize(): number {
    return this.size;
  }

  setPrimaryOpacity(opacity: number): boolean {
    if (opacity < 0 || 1 < opacity) { return false; }
    this.primaryOpacity = opacity;
    this.refresh();
    return true;
  }

  getPrimaryOpacity(): number {
    return this.primaryOpacity ? this.primaryOpacity : GridManagerService.DEFAULT_PRIMARY_OPACITY;
  }
}
