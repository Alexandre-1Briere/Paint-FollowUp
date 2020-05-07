import { Component, NgModule, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SvgFeatherComponent } from '../../../../components/drawing/work-board/svg-feather/svg-feather.component';
import { DEFAULT_BLUE } from '../../../../constants/colors';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseButtonAction, MouseEventData, MouseLocation, MouseMovement } from '../../../../logic/events/mouse/mouse-event-data';
import { SvgComponentsManagerService } from '../../../svg/svg-components-manager.service';
import { ToolsOptionsManagerService } from '../../tools-options-manager/tools-options-manager.service';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';
import { Plume } from './plume';

class PlumeTestable extends Plume {
    constructor() { super(); }
    getPoints(): Coords[] { return this.points; }
    getCoords(): Coords | undefined { return this.coords; }
    setIsDrawing(isDrawing: boolean): void { this.isDrawing = isDrawing; }
}

// tslint:disable:max-classes-per-file
@Component({
    selector: 'app-mock-view-component',
    template: '',
})
class MockViewComponent {
    constructor(public viewContainerRef: ViewContainerRef) {}
}

@NgModule({
    declarations: [
        SvgFeatherComponent,
        MockViewComponent,
    ],
    entryComponents: [
        SvgFeatherComponent,
    ],
    providers: [
        SvgComponentsManagerService,
        ToolsOptionsManagerService,
    ],
})
class TestModule {}

const DEFAULT_COLOR = '#112233';
const DEFAULT_OPACITY = 1;

describe('Plume', () => {
    let plume: PlumeTestable;
    let mockViewComponent: MockViewComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestModule],
        })
            .compileComponents();

        plume = new PlumeTestable();

        Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
        Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);

        const fixture = TestBed.createComponent(MockViewComponent);
        mockViewComponent = fixture.componentInstance;
        Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
    });

    it('should create an instance', () => {
        expect(new Plume()).toBeTruthy();
    });

    it('#getInstance() should return the instance of a "Plume" type', () => {
        const crayonInstance = Plume.getInstance();
        expect(crayonInstance instanceof Plume).toBeTruthy();
    });

    it('#createSvg() should call createSvgComponent properly', () => {
        spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
        const IS_DRAWING = true;
        plume.setIsDrawing(IS_DRAWING);
        plume.onLeftUp(new MouseEventData(), new KeyboardState());
        expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).toHaveBeenCalled();
    });

    it('#createSvg() sets color correctly', () => {
        const IS_DRAWING = true;
        plume.setIsDrawing(IS_DRAWING);
        plume.onLeftUp(new MouseEventData(), new KeyboardState());

        const CREATED_SVG_INDEX = 0;
        let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgFeatherComponent) as SvgFeatherComponent;
        let color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
        let testedColor = color !== undefined ? color : DEFAULT_BLUE;
        expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);

        Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
        Tool.TOOL_OPTIONS_MANAGER.setPrimaryColor(DEFAULT_COLOR);
        plume.setIsDrawing(IS_DRAWING);
        plume.onLeftUp(new MouseEventData(), new KeyboardState());

        drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX,  SvgFeatherComponent) as  SvgFeatherComponent;
        color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
        testedColor = color !== undefined ? color : DEFAULT_BLUE;
        expect(drawnSvg.getPrimaryColor()).toEqual(testedColor);
    });

    it('#createSvg() sets opacity correctly', () => {
        const IS_DRAWING = true;
        plume.setIsDrawing(IS_DRAWING);
        plume.onLeftUp(new MouseEventData(), new KeyboardState());

        const CREATED_SVG_INDEX = 0;
        let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgFeatherComponent) as SvgFeatherComponent;
        let opacity = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryOpacity;
        let testedOpacity = opacity !== undefined ? opacity : DEFAULT_OPACITY;
        expect(drawnSvg.getPrimaryOpacity()).toEqual(testedOpacity);

        Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
        Tool.TOOL_OPTIONS_MANAGER.setOpacity(DEFAULT_OPACITY, true);
        plume.setIsDrawing(IS_DRAWING);
        plume.onLeftUp(new MouseEventData(), new KeyboardState());

        drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX,  SvgFeatherComponent) as  SvgFeatherComponent;
        opacity = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryOpacity;
        testedOpacity = opacity !== undefined ? opacity : DEFAULT_OPACITY;
        expect(drawnSvg.getPrimaryOpacity()).toEqual(testedOpacity);
    });

    it('#cancelOnGoing() should resets coords and points', () => {
        plume.cancelOnGoing(new MouseEventData(), new KeyboardState());
        const NO_POINTS = 0;
        expect(plume.getPoints().length).toBe(NO_POINTS);
        expect(plume.getCoords()).toBeUndefined();
    });

    it('#onLeftDown() should update coords and points', () => {
        const initialNumberPoints = plume.getPoints().length;
        const mouseEventData = new MouseEventData();
        mouseEventData.leftButton.action = MouseButtonAction.Click;
        const X = 3;
        const Y = 4;
        mouseEventData.x = X;
        mouseEventData.y = Y;

        plume.onLeftDown(mouseEventData, new KeyboardState());
        const WRONG = -1;
        let xTested = WRONG;
        let yTested = WRONG;
        const coords = plume.getCoords();
        if (coords !== undefined) {
            xTested = coords.x;
            yTested = coords.y;
        }

        expect(xTested).toBe(X);
        expect(yTested).toBe(Y);
        const EXPECTED_NUMBER_POINTS = initialNumberPoints + 1;
        expect(plume.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
    });

    it('#onLeftDown() when outside drawing board does not add points', () => {
        const mouseData = new MouseEventData();
        mouseData.location = MouseLocation.Outside;
        plume.onLeftDown(mouseData, new KeyboardState());
        const NO_POINTS = 0;
        expect(plume.getPoints().length).toBe(NO_POINTS);
    });

    it('#onLeftUp() should resets coords and points', () => {
        const mouseEventData = new MouseEventData();
        const X = 3;
        const Y = 4;
        mouseEventData.x = X;
        mouseEventData.y = Y;

        plume.onLeftUp(mouseEventData, new KeyboardState());

        const EXPECTED_NUMBER_POINTS = 0;
        expect(plume.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
        expect(plume.getCoords()).toBeUndefined();
    });

    it('#onMouseMove() should update coords and points', () => {
        const initialNumberPoints = plume.getPoints().length;
        const mouseEventData = new MouseEventData();
        mouseEventData.movement = MouseMovement.Moved;
        const X = 40;
        const Y = 50;
        mouseEventData.x = X;
        mouseEventData.y = Y;

        const CURRENTLY_DRAWING = true;
        plume.setIsDrawing(CURRENTLY_DRAWING);
        plume.onMouseMove(mouseEventData, new KeyboardState());
        const WRONG = -1;
        let xTested = WRONG;
        let yTested = WRONG;
        const coords = plume.getCoords();
        if (coords !== undefined) {
            xTested = coords.x;
            yTested = coords.y;
        }

        expect(xTested).toBe(X);
        expect(yTested).toBe(Y);
        const EXPECTED_NUMBER_POINTS = initialNumberPoints + 1;
        expect(plume.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
    });

    it('#onMouseMove() does not update points when isDrawing=false', () => {
        plume.onMouseMove(new MouseEventData(), new KeyboardState());

        const NO_POINTS_ADDED = 0;
        expect(plume.getPoints().length).toBe(NO_POINTS_ADDED);
    });

    it('#onMouseLeave() should resets coords and points', () => {
        plume.onMouseLeave(new MouseEventData(), new KeyboardState());

        const EXPECTED_NUMBER_POINTS = 0;
        expect(plume.getPoints().length).toBe(EXPECTED_NUMBER_POINTS);
        expect(plume.getCoords()).toBeUndefined();
    });
});
