import { TestBed } from '@angular/core/testing';

import { SvgGridComponent } from '../../components/drawing/work-board/svg-grid/svg-grid.component';
import { KEY_DOWN } from '../../constants/keyboard';
import { KeyboardKey } from '../../enums/keyboard';
import { GridManagerService } from './grid-manager.service';

describe('GridManagerService', () => {
  let service: GridManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(GridManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#setPrimaryOpacity() should return true if the opacity is valid', () => {
    const OPACITY = 0.5;
    expect(service.setPrimaryOpacity(OPACITY)).toBeTruthy();
  });
  it('#setPrimaryOpacity() should return false if the opacity is valid', () => {
    const OPACITY = -0.5;
    expect(service.setPrimaryOpacity(OPACITY)).not.toBeTruthy();
  });
  it('#setSize() should return false if the size is not valid', () => {
    const SIZE = 3;
    expect(service.setSize(SIZE)).not.toBeTruthy();
  });
  it('#setSize() should return true if the size is valid', () => {
    const SIZE = 100;
    expect(service.setSize(SIZE)).toBeTruthy();
  });
  it('#toggleIsActive() should switch the current vale of isActive', () => {
    const isActive = service.getIsActive();
    service.toggleIsActive();
    expect(service.getIsActive()).toEqual(!isActive);
  });
  it('#displayGrid() should call refresh()', () => {
    const spy = spyOn(service, 'refresh');
    service.displayGrid();
    expect(spy).toHaveBeenCalled();
  });
  it('#refresh() should call setCellSize if the grid is defined', () => {
    service.grid = new SvgGridComponent();
    const spy = spyOn(service.grid, 'setCellSize');
    service.refresh();
    expect(spy).toHaveBeenCalled();
  });
  it('#the first iteration of growGrid should return true', () => {
    expect(service.growGrid()).toBeTruthy();
  });
  it('#the first iteration of shrinkGrid should return true', () => {
    expect(service.shrinkGrid()).toBeTruthy();
  });
  it('should call toggleIsActive when G is pressed', () => {
    const spy = spyOn(service, 'toggleIsActive');
    const KEY = KeyboardKey.G;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    service.keyboardManagerService.receiveKeyboardEvent(event);
    expect(spy).toHaveBeenCalled();
  });
  it('should call growGrid when Plus is pressed', () => {
    const spy = spyOn(service, 'growGrid');
    const KEY = KeyboardKey.Plus;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    service.keyboardManagerService.receiveKeyboardEvent(event);
    expect(spy).toHaveBeenCalled();
  });
  it('should call shrinkGrid when Minus is pressed', () => {
    const spy = spyOn(service, 'shrinkGrid');
    const KEY = KeyboardKey.Minus;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    service.keyboardManagerService.receiveKeyboardEvent(event);
    expect(spy).toHaveBeenCalled();
  });
});
