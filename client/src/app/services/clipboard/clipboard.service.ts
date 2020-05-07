import {Injectable} from '@angular/core';
import {Point} from 'src/app/interfaces/point';
import {KeyboardKey} from '../../enums/keyboard';
import {ClipboardContent} from '../../interfaces/clipboard-content';
import {SvgBasicProperties} from '../../logic/svg/base-svg/svg-basic-properties';
import {DrawingBaseParametersAccessorService} from '../drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import {KeyboardManagerService} from '../events/keyboard-manager.service';
import {SvgComponentsManagerService} from '../svg/svg-components-manager.service';
import {ToolManagerService} from '../tool-manager/tool-manager.service';
import {Selection} from '../tool-manager/tools/selection/selection';

const OFFSET_AMOUNT = 5;

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  private content: ClipboardContent;
  private offset: Point;
  private toolManagerService: ToolManagerService;

  constructor(public svgComponentsManagerService: SvgComponentsManagerService,
              public keyboardManagerService: KeyboardManagerService,
              public drawingBaseParametersService: DrawingBaseParametersAccessorService) {
    this.reset();
  }

  initialise(toolManagerService: ToolManagerService): void {
    this.toolManagerService = toolManagerService;
    this.keyboardManagerService.getKeyboardStateObs().subscribe(this.onKeyPressEvent);
  }

  private onKeyPressEvent = (): void => {
    if (this.keyboardManagerService.checkKeyboardShortcut([KeyboardKey.Ctrl, KeyboardKey.V], [])) {
      this.tryToPasteContent();
    }
  } // tslint:disable-next-line:semicolon
  ;

  reset(): void {
    this.content = {
      svgJsons: [],
      reference: {x: 0, y: 0},
    };
    this.resetOffset();
  }

  replaceContent(components: SvgBasicProperties[], reference: Point): void {
    this.content.svgJsons = [];
    for (const component of components) {
      this.content.svgJsons.push(component.createSvgJson());
    }
    this.content.reference = {x: reference.x, y: reference.y};
    this.resetOffset();
  }

  ctrlVIsAvailable(): boolean {
    return this.content.svgJsons.length > 0;
  }

  ctrlCIsAvailable(): boolean {
    return this.ctrlCDXAndDeleteAreAvailable();
  }

  ctrlDIsAvailable(): boolean {
    return this.ctrlCDXAndDeleteAreAvailable();
  }

  ctrlXIsAvailable(): boolean {
    return this.ctrlCDXAndDeleteAreAvailable();
  }

  deleteIsAvailable(): boolean {
    return this.ctrlCDXAndDeleteAreAvailable();
  }

  getSelectionIfAvailable(): Selection | undefined {
    const tool = this.toolManagerService.getTool();
    if (tool instanceof Selection) {
      return tool;
    } else {
      return undefined;
    }
  }

  tryToPasteContent(): void {
    if (this.ctrlVIsAvailable()) {
      let selectionTool = this.getSelectionIfAvailable();
      if (!selectionTool) {
        selectionTool = Selection.getInstance() as Selection;
        this.toolManagerService.setTool(selectionTool);
        this.toolManagerService.updateTool();
      }
      selectionTool.selectSvgComponents(this.pasteContent());
    }
  }

  duplicateComponents(components: SvgBasicProperties[], reference: Point): SvgBasicProperties[] {
    const svgJsons = [];
    for (const component of components) {
      svgJsons.push(component.createSvgJson());
    }
    return this.svgComponentsManagerService.createMultipleSvgComponents(svgJsons,
      (component) => {
        if (reference.x + OFFSET_AMOUNT < this.drawingBaseParametersService.width &&
            reference.y + OFFSET_AMOUNT < this.drawingBaseParametersService.height) {
          component.translate({x: OFFSET_AMOUNT, y: OFFSET_AMOUNT});
        }
      }
    );
  }

  private pasteContent(): SvgBasicProperties[] {
    this.adaptOffset();
    return this.svgComponentsManagerService.createMultipleSvgComponents(this.content.svgJsons,
      (component) => { component.translate(this.offset); });
  }

  private adaptOffset(): void {
    this.offset.x += OFFSET_AMOUNT;
    this.offset.y += OFFSET_AMOUNT;

    if (this.content.reference.x + this.offset.x >= this.drawingBaseParametersService.width ||
        this.content.reference.y + this.offset.y >= this.drawingBaseParametersService.height) {
      this.offset.x = 0;
      this.offset.y = 0;
    }
  }

  private ctrlCDXAndDeleteAreAvailable(): boolean {
    const selection = this.getSelectionIfAvailable();
    if (selection) {
      return selection.clipboardActionsAreAvailable();
    } else {
      return false;
    }
  }

  private resetOffset(): void {
    this.offset = {x: 0, y: 0};
  }
}
