import { TestBed } from '@angular/core/testing';
import { Crayon } from './tools/crayon/crayon';
import { Ligne } from './tools/ligne/ligne';
import { Pinceau } from './tools/pinceau/pinceau';
import {Plume} from './tools/plume/plume';
import { Rectangle } from './tools/rectangle/rectangle';

import { NgModule } from '@angular/core';
import { KEY_DOWN, KEY_UP } from '../../constants/keyboard';
import {
  MOUSE_DOWN,
  MOUSE_ENTER,
  MOUSE_LEAVE,
  MOUSE_MOVE,
  MOUSE_RIGHT_BUTTON,
  MOUSE_UP, MOUSE_WHEEL,
} from '../../constants/mouse';
import { KeyboardKey } from '../../enums/keyboard';
import { MouseEventData } from '../../logic/events/mouse/mouse-event-data';
import { KeyboardManagerService } from '../events/keyboard-manager.service';
import { MouseDrawingInputsService } from '../events/mouse-drawing-inputs.service';
import { ToolManagerService } from './tool-manager.service';
import { Aerosol } from './tools/aerosol/aerosol';
import { ApplicateurDeCouleur } from './tools/applicateur-de-couleur/applicateur-de-couleur';
import { Efface } from './tools/efface/efface';
import { Ellipse } from './tools/ellipse/ellipse';
import { Pipette } from './tools/pipette/pipette';
import { Polygone } from './tools/polygone/polygone';
import { Selection } from './tools/selection/selection';

@NgModule({
  providers: [
    KeyboardManagerService,
    MouseDrawingInputsService,
  ],
})
class TestModule {}

describe('ToolManagerService', () => {
  let service: ToolManagerService;
  let mouseDrawingInputsService: MouseDrawingInputsService;
  let keyboardManagerService: KeyboardManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });

    mouseDrawingInputsService = TestBed.get(MouseDrawingInputsService);
    keyboardManagerService = TestBed.get(KeyboardManagerService);
    service = TestBed.get(ToolManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should change tool for the "Crayon" tool', () => {
    service.setTool(Crayon.getInstance());
    expect(service.getTool()).toBe(Crayon.getInstance());
  });

  it('should change tool for the "Rectangle" tool', () => {
    service.setTool(Rectangle.getInstance());
    expect(service.getTool()).toBe(Rectangle.getInstance());
  });

  it('should change tool for the "Ligne" tool', () => {
    service.setTool(Ligne.getInstance());
    expect(service.getTool()).toBe(Ligne.getInstance());
  });

  it('should change tool for the "Pinceau" tool', () => {
    service.setTool(Pinceau.getInstance());
    expect(service.getTool()).toBe(Pinceau.getInstance());
  });

  it('should return the "Ligne" tool when the selected tool is "Ligne"', () => {
    service.setTool(Ligne.getInstance());
    expect(service.getTool()).toBe(Ligne.getInstance());
  });

  it('should return the "Rectangle" tool when the selected tool is "Rectangle"', () => {
    service.setTool(Rectangle.getInstance());
    expect(service.getTool()).toBe(Rectangle.getInstance());
  });

  it('should return the "Crayon" tool when the selected tool is "Crayon"', () => {
    service.setTool(Crayon.getInstance());
    expect(service.getTool()).toBe(Crayon.getInstance());
  });

  it('should return the "Pinceau" tool when the selected tool is "Pinceau"', () => {
    service.setTool(Pinceau.getInstance());
    expect(service.getTool()).toBe(Pinceau.getInstance());
  });

  it('should return the "Plume" tool when the selected tool is "Plume"', () => {
    service.setTool(Plume.getInstance());
    expect(service.getTool()).toBe(Plume.getInstance());
  });

  it('#onRigthDown should call the onRightDown method of the current tool', () => {
    service.setTool(Crayon.getInstance());
    const spyRight = spyOn(service.getTool(), 'onRightDown');
    const rightDownEvent = new MouseEvent(MOUSE_DOWN, {button: MOUSE_RIGHT_BUTTON});
    mouseDrawingInputsService.receiveMouseAction(rightDownEvent);
    expect(spyRight).toHaveBeenCalled();
  });
  it('#onRigthClick should call the onRightClick method of the current tool', () => {
    service.setTool(Crayon.getInstance());
    const spyRight = spyOn(service.getTool(), 'onRightClick');
    const rightDownEvent = new MouseEvent(MOUSE_DOWN, {button: MOUSE_RIGHT_BUTTON});
    const rightUpEvent = new MouseEvent(MOUSE_UP, {button: MOUSE_RIGHT_BUTTON});
    mouseDrawingInputsService.receiveMouseAction(rightDownEvent);
    mouseDrawingInputsService.receiveMouseAction(rightUpEvent);
    expect(spyRight).toHaveBeenCalled();
  });
  it('#onRigthUp should call the onRightUp method of the current tool', () => {
    service.setTool(Crayon.getInstance());
    const spyRight = spyOn(service.getTool(), 'onRightUp');
    const rightDownEvent = new MouseEvent(MOUSE_DOWN, {button: MOUSE_RIGHT_BUTTON});
    const rightUpEvent = new MouseEvent(MOUSE_UP, {button: MOUSE_RIGHT_BUTTON});
    mouseDrawingInputsService.receiveMouseAction(rightDownEvent);
    mouseDrawingInputsService.receiveMouseAction(rightUpEvent);
    expect(spyRight).toHaveBeenCalled();
  });

  // TODO test getToolObs()

  it('#onLeftDown() is called when mousedown event is detected', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onLeftDown');

    const leftDownEvent = new MouseEvent(MOUSE_DOWN);
    mouseDrawingInputsService.receiveMouseAction(leftDownEvent);
    expect(service.getTool().onLeftDown).toHaveBeenCalled();
  });

  it('#onLeftUp() is called when mouseup event is detected', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onLeftUp');

    const leftDownEvent = new MouseEvent(MOUSE_DOWN);
    const leftUpEvent = new MouseEvent(MOUSE_UP);
    mouseDrawingInputsService.receiveMouseAction(leftDownEvent);
    mouseDrawingInputsService.receiveMouseAction(leftUpEvent);
    expect(service.getTool().onLeftUp).toHaveBeenCalled();
  });

  it('#onLeftClick() is called when mouseclick event is detected', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onLeftClick');

    const leftUpEvent = new MouseEvent(MOUSE_UP);
    const leftDownEvent = new MouseEvent(MOUSE_DOWN);
    mouseDrawingInputsService.receiveMouseAction(leftDownEvent);
    mouseDrawingInputsService.receiveMouseAction(leftUpEvent);
    expect(service.getTool().onLeftClick).toHaveBeenCalled();
  });

  it('#onLeftDblClick() is called when mousedoubleclick event is detected', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onLeftDoubleClick');

    const leftUpEvent = new MouseEvent(MOUSE_UP);
    const leftDownEvent = new MouseEvent(MOUSE_DOWN);
    mouseDrawingInputsService.receiveMouseAction(leftDownEvent);
    mouseDrawingInputsService.receiveMouseAction(leftUpEvent);
    mouseDrawingInputsService.receiveMouseAction(leftDownEvent);
    mouseDrawingInputsService.receiveMouseAction(leftUpEvent);
    expect(service.getTool().onLeftDoubleClick).toHaveBeenCalled();
  });

  it('#onMouseMove() is called when mousemove event is detected', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onMouseMove');

    const mouseMoveEvent = new MouseEvent(MOUSE_MOVE);
    mouseDrawingInputsService.receiveMouseAction(mouseMoveEvent);
    expect(service.getTool().onMouseMove).toHaveBeenCalled();
  });

  it('#onMouseEnter() is called when mouseenter event is detected', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onMouseEnter');

    const mouseLeaveEvent = new MouseEvent(MOUSE_LEAVE);
    const mouseEnterEvent = new MouseEvent(MOUSE_ENTER);
    mouseDrawingInputsService.receiveMouseAction(mouseLeaveEvent);
    mouseDrawingInputsService.receiveMouseAction(mouseEnterEvent);
    expect(service.getTool().onMouseEnter).toHaveBeenCalled();
  });

  it('#onMouseLeave() is called when mouseleave event is detected', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onMouseLeave');

    const mouseLeaveEvent = new MouseEvent(MOUSE_LEAVE);
    mouseDrawingInputsService.receiveMouseAction(mouseLeaveEvent);
    expect(service.getTool().onMouseLeave).toHaveBeenCalled();
  });

  it('#onWheelEvent() is called when mouseWheel action is detected', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onWheelEvent');
    const mouseWheelEvent = new MouseEvent(MOUSE_WHEEL);
    mouseDrawingInputsService.receiveMouseAction(mouseWheelEvent);
    expect(service.getTool().onWheelEvent).toHaveBeenCalled();
  });

  it('#onWheelEvent() is not called after keyboard event', () => {
    service.setTool(Crayon.getInstance());
    const mouseWheelEvent = new MouseEvent(MOUSE_WHEEL);
    mouseDrawingInputsService.receiveMouseAction(mouseWheelEvent);
    const wheelSpy = spyOn(service.getTool(), 'onWheelEvent');
    keyboardManagerService.receiveKeyboardEvent(new KeyboardEvent(KEY_DOWN, {key: (KeyboardKey.I).toString()}));
    expect(wheelSpy).not.toHaveBeenCalled();
  });

  it('#onKeyPress() is called when keydown event is detected', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onKeyPress');

    const KEY = KeyboardKey.U;
    const eventDown = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(eventDown);
    expect(service.getTool().onKeyPress).toHaveBeenCalled();
  });

  it('#onKeyRelease() is called when keyup event is detected', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onKeyRelease');

    const KEY = KeyboardKey.U;
    const eventDown = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    const eventUp = new KeyboardEvent(KEY_UP, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(eventDown);
    keyboardManagerService.receiveKeyboardEvent(eventUp);
    expect(service.getTool().onKeyRelease).toHaveBeenCalled();
  });

  it('#checkForKeyboardShortcut() sets Crayon after C key event', () => {
    service.setTool(Pinceau.getInstance());

    const KEY = KeyboardKey.C;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Crayon).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets Pinceau after W key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.W;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Pinceau).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets Rectangle after Nbr1 key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.Nbr1;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Rectangle).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets Rectangle after L key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.L;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Ligne).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets Efface after E key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.E;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Efface).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets ApplicateurDeCouleur after R key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.R;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof ApplicateurDeCouleur).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets Selection after S key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.S;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Selection).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets Pipette after I key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.I;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Pipette).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets Polygon after Nbr3 key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.Nbr3;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Polygone).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets Ellipse after Nbr2 key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.Nbr2;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Ellipse).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets Aerosol after A key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.A;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Aerosol).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() sets Plume after P key event', () => {
    service.setTool(Crayon.getInstance());

    const KEY = KeyboardKey.P;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);
    expect(service.getTool() instanceof Plume).toBeTruthy();
  });

  it('#checkForKeyboardShortcut() does not call tool functions when mouseState is undefined', () => {
    service.setTool(Crayon.getInstance());
    spyOn(mouseDrawingInputsService, 'getMouseOutput').and.returnValue(undefined as unknown as MouseEventData);
    spyOn(service.getTool(), 'onKeyPress');

    mouseDrawingInputsService.receiveMouseAction(new MouseEvent(MOUSE_DOWN));
    const KEY = KeyboardKey.K;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    expect(service.getTool().onKeyPress).not.toHaveBeenCalled();
  });

  it('#checkForKeyboardShortcut() calls tool functions when mouseState is defined', () => {
    service.setTool(Crayon.getInstance());
    spyOn(service.getTool(), 'onKeyPress');

    mouseDrawingInputsService.receiveMouseAction(new MouseEvent(MOUSE_DOWN));
    const KEY = KeyboardKey.K;
    const event = new KeyboardEvent(KEY_DOWN, {key: KEY.toString()});
    keyboardManagerService.receiveKeyboardEvent(event);

    expect(service.getTool().onKeyPress).toHaveBeenCalled();
  });
});
// tslint:disable-next-line:max-file-line-count
// since we just have a long test file not a long functionality file
