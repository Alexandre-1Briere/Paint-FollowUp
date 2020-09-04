import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DEFAULT_BACKGROUND_COLOR, DEFAULT_DRAWING_HEIGHT, DEFAULT_DRAWING_WIDTH } from '../../../../constants/drawing';
import { MOUSE_DOWN, MOUSE_ENTER, MOUSE_LEAVE, MOUSE_MOVE, MOUSE_UP, MOUSE_WHEEL } from '../../../../constants/mouse';
import { Filters } from '../../../../enums/filters';
import { DrawingBaseParameters } from '../../../../interfaces/drawing-base-parameters';
import { DrawingAccessorService } from '../../../../services/current-drawing-accessor/drawing-accessor.service';
// tslint:disable-next-line:max-line-length
import { DrawingBaseParametersAccessorService } from '../../../../services/drawing-base-parameters-accessor/drawing-base-parameters-accessor.service';
import { MouseDrawingInputsService } from '../../../../services/events/mouse-drawing-inputs.service';
import { SvgComponentsManagerService } from '../../../../services/svg/svg-components-manager.service';
import { Tool } from '../../../../services/tool-manager/tools/tool/tool';

@Component({
  selector: 'app-drawing-board',
  templateUrl: './drawing-board.component.html',
  styleUrls: ['./drawing-board.component.scss'],
})
export class DrawingBoardComponent implements AfterViewInit, OnInit, OnDestroy {
  width: number;
  height: number;
  backgroundColor: string;
  filters: typeof Filters;
  private baseParamSubs: Subscription;
  private drawingBackgroundColorSubscription: Subscription;
  private saveSubscription: Subscription;

  @ViewChild('drawingBoardElement', {static: false}) drawingBoardElement: ElementRef;
  @ViewChild('svgElement', {static: false}) svgElement: ElementRef;
  @ViewChild('rootSvg', {read: ViewContainerRef, static: false}) rootSvg: ViewContainerRef;

  constructor(public svgComponentsManagerService: SvgComponentsManagerService,
              public mouseDrawingInputsService: MouseDrawingInputsService,
              public currentDrawingAccessorService: DrawingAccessorService,
              public drawingBaseParametersAccessor: DrawingBaseParametersAccessorService,
              ) {
    this.filters = Filters;
    this.createDrawing({
        width: DEFAULT_DRAWING_WIDTH,
        height: DEFAULT_DRAWING_HEIGHT,
        backgroundColor: DEFAULT_BACKGROUND_COLOR,
    });
  }

  ngOnInit(): void {
    const parameterEmitter = this.drawingBaseParametersAccessor.getBaseParametersChangeEmitter();
    this.baseParamSubs = parameterEmitter.subscribe((param: DrawingBaseParameters) => this.createDrawing(param));
    const bgEmitter = this.drawingBaseParametersAccessor.getBackgroundColorChangeEmitter();
    this.drawingBackgroundColorSubscription = bgEmitter
                                                .subscribe((color: string) => this.updateBackgroundColor(color));
  }

  ngOnDestroy(): void {
    if (this.baseParamSubs !== undefined) {
      this.baseParamSubs.unsubscribe();
    }
    if (this.drawingBackgroundColorSubscription !== undefined) {
      this.drawingBackgroundColorSubscription.unsubscribe();
    }
    if (this.saveSubscription !== undefined) {
      this.saveSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.svgComponentsManagerService.initialiseViewContainerRef(this.rootSvg);
    this.currentDrawingAccessorService.setTrackedDrawingRef(this.svgElement);
    Tool.TRACKED_DRAWING_REF = this.svgElement;
  }

  @HostListener(MOUSE_DOWN, ['$event'])
  @HostListener(MOUSE_UP, ['$event'])
  @HostListener(MOUSE_MOVE, ['$event'])
  @HostListener(MOUSE_WHEEL, ['$event'])
  @HostListener(MOUSE_ENTER, ['$event'])
  @HostListener(MOUSE_LEAVE, ['$event'])
  sendMouseEvent(event: MouseEvent): void {
    if (this.drawingBoardElement !== undefined && this.drawingBoardElement.nativeElement !== undefined) {
      this.mouseDrawingInputsService.drawingBoardTopLeftX = this.drawingBoardElement.nativeElement.getBoundingClientRect().left;
      this.mouseDrawingInputsService.drawingBoardTopLeftY = this.drawingBoardElement.nativeElement.getBoundingClientRect().top;
    }
    event.preventDefault();
    this.mouseDrawingInputsService.receiveMouseAction(event);
  }

  private createDrawing(baseParameters: DrawingBaseParameters): void {
    this.width = baseParameters.width;
    this.height = baseParameters.height;
    this.backgroundColor = baseParameters.backgroundColor;
    this.svgComponentsManagerService.drawingBaseParameters = baseParameters;
  }

  private updateBackgroundColor(newBackgroundColor: string): void {
    this.backgroundColor = newBackgroundColor;
  }
}
