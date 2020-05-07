import {TestBed} from '@angular/core/testing';
import {SvgCollisionsService} from '../../services/collisions/svg-collisions.service';
import {DrawingAccessorService} from '../../services/current-drawing-accessor/drawing-accessor.service';
import {MouseDrawingInputsService} from '../../services/events/mouse-drawing-inputs.service';
import {SvgTransformationService} from '../../services/svg-transformation/svg-transformation.service';
import {SvgComponentsManagerService} from '../../services/svg/svg-components-manager.service';
import {ToolsOptionsManagerService} from '../../services/tool-manager/tools-options-manager/tools-options-manager.service';
import {Tool} from '../../services/tool-manager/tools/tool/tool';
import {SvgUndoRedoService} from '../../services/undo-redo/svg-undo-redo.service';

export class BoardUtilities {
  static readyAllToolServices(): void {
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.MOUSE_MANAGER_SERVICE = TestBed.get(MouseDrawingInputsService);
    Tool.SVG_COLLISIONS_SERVICE = TestBed.get(SvgCollisionsService);
    Tool.SVG_TRANSFORMATION_SERVICE = TestBed.get(SvgTransformationService);
    Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
    Tool.CANVAS_SERVICE = TestBed.get(DrawingAccessorService);
    Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
    Tool.UNDO_REDO_SERVICE = TestBed.get(SvgUndoRedoService);
  }
}
