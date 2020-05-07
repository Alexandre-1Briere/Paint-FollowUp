import {CommonModule} from '@angular/common';
import {Component, NgModule, ViewContainerRef} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {SvgSelectionComponent} from '../../../../components/svgElement/svg-selection/svg-selection.component';
import { SvgStampComponent } from '../../../../components/svgElement/svg-stamp/svg-stamp.component';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import {KeyboardManagerService} from '../../../events/keyboard-manager.service';
import {SvgComponentsManagerService} from '../../../svg/svg-components-manager.service';
import {ToolsOptionsManagerService} from '../../tools-options-manager/tools-options-manager.service';
import { Coords } from '../coords';
import {Tool} from '../tool/tool';
import { Etampe } from './etampe';

const DEFAULT_SIZE = 0.1;
const DEFAULT_ANGLE = 0;
class EtampeTestable extends Etampe {
    constructor() { super(); }
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
    imports: [
        CommonModule,
    ],
    declarations: [
        SvgStampComponent,
        SvgSelectionComponent,
        MockViewComponent,
    ],
    entryComponents: [
        SvgStampComponent,
        SvgSelectionComponent,
    ],
    providers: [
        SvgComponentsManagerService,
        ToolsOptionsManagerService,
        KeyboardManagerService,
    ],
})
class TestModule {}

describe('Etampe', () => {
    let etampe: EtampeTestable;
    let mockViewComponent: MockViewComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestModule],
        })
            .compileComponents();

        etampe = new EtampeTestable();

        Tool.SVG_COMPONENT_MANAGER = TestBed.get(SvgComponentsManagerService);
        Tool.TOOL_OPTIONS_MANAGER = TestBed.get(ToolsOptionsManagerService);
        Tool.KEYBOARD_MANAGER_SERVICE = TestBed.get(KeyboardManagerService);

        const fixture = TestBed.createComponent(MockViewComponent);
        mockViewComponent = fixture.componentInstance;
        Tool.SVG_COMPONENT_MANAGER.initialiseViewContainerRef(mockViewComponent.viewContainerRef);
    });

    it('should create an instance', () => {
        expect(new Etampe()).toBeTruthy();
    });

    it('should return the instance of a "Ellipse" type', () => {
        const etampeInstance = Etampe.getInstance();
        expect(etampeInstance instanceof Etampe).toBeTruthy();
    });

    it('#createSvg() should call createSvgComponent properly', () => {
        spyOn(Tool.SVG_COMPONENT_MANAGER, 'createSvgComponent');
        etampe.onLeftDown(new MouseEventData(), new KeyboardState());
        etampe.onLeftUp(new MouseEventData(), new KeyboardState());
        expect(Tool.SVG_COMPONENT_MANAGER.createSvgComponent).toHaveBeenCalled();

    });

    it('#createSvg() sets Scale Of Stamp correctly ', () => {
        etampe.onLeftDown(new MouseEventData(), new KeyboardState());
        etampe.onLeftUp(new MouseEventData(), new KeyboardState());

        const CREATED_SVG_INDEX = 0;
        let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgStampComponent) as SvgStampComponent;
        let toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
        let testedSize = toolSize !== undefined ? toolSize : DEFAULT_SIZE;
        expect(drawnSvg.getScaleOfStamp()).toEqual(testedSize);
        Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
        etampe.onLeftDown(new MouseEventData(), new KeyboardState());
        etampe.onLeftUp(new MouseEventData(), new KeyboardState());

        drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgStampComponent) as SvgStampComponent;
        toolSize = Tool.TOOL_OPTIONS_MANAGER.getSettings().borderSize;
        testedSize = toolSize !== undefined ? toolSize : DEFAULT_SIZE;
        expect(drawnSvg.getScaleOfStamp()).toEqual(testedSize);
    });

    it('#createSvg() sets Angle Of Stamp correctly ', () => {
        etampe.onLeftDown(new MouseEventData(), new KeyboardState());
        etampe.onLeftUp(new MouseEventData(), new KeyboardState());

        const CREATED_SVG_INDEX = 0;
        let drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgStampComponent) as SvgStampComponent;
        let toolAngle = Tool.TOOL_OPTIONS_MANAGER.getSettings().angle;
        let testedAngle = toolAngle !== undefined ? toolAngle : DEFAULT_ANGLE;
        expect(drawnSvg.getRotationAngle()).toEqual(testedAngle);
        Tool.SVG_COMPONENT_MANAGER.resetSvgComponents();
        etampe.onLeftDown(new MouseEventData(), new KeyboardState());
        etampe.onLeftUp(new MouseEventData(), new KeyboardState());

        drawnSvg = Tool.SVG_COMPONENT_MANAGER.getSvgComponent(CREATED_SVG_INDEX, SvgStampComponent) as SvgStampComponent;
        toolAngle = Tool.TOOL_OPTIONS_MANAGER.getSettings().borderSize;
        testedAngle = toolAngle !== undefined ? toolAngle : DEFAULT_ANGLE;
        expect(drawnSvg.getRotationAngle()).toEqual(testedAngle);
    });

    it('#onLeftDown() does not change origin when outside drawing board', () => {
        const mouseData = new MouseEventData();
        mouseData.location = MouseLocation.Outside;
        etampe.onLeftDown(mouseData, new KeyboardState());
        expect(etampe.origin).toBeUndefined();
    });

    it('#onLeftDown() does not set origin when already defined', () => {
        etampe.onLeftDown(new MouseEventData(), new KeyboardState());
        const mouseData = new MouseEventData();
        const POSITION = 10;
        mouseData.x = POSITION;
        etampe.onLeftDown(mouseData, new KeyboardState());

        const EXPECTED_POSITION = 0;
        expect(etampe.origin).toBeDefined();
        const X = etampe.origin !== undefined ? etampe.origin.x : POSITION;
        expect(X).toBe(EXPECTED_POSITION);
    });

    it('#onLeftUp() does not call reset when origin is undefined', () => {
        spyOn(etampe, 'reset');
        etampe.onLeftUp(new MouseEventData(), new KeyboardState());
        expect(etampe.reset).not.toHaveBeenCalled();
    });

    it('#cancelOnGoing() calls to reset', () => {
        spyOn(etampe, 'reset');
        etampe.cancelOnGoing(new MouseEventData(), new KeyboardState());
        expect(etampe.reset).toHaveBeenCalled();
    });

    it('#computeCoords() returns undefined when origin is undefined', () => {
        etampe.computeCoords(new MouseEventData());
        expect(etampe.coords).toBeUndefined();
    });

    it('#computeCoords() should return instance of Coords', () => {
        if ( etampe.origin !== undefined) {
            expect(etampe.computeCoords(new MouseEventData()) instanceof Coords).toBe(true,
                'instance of Coords');
        }
    });
});
