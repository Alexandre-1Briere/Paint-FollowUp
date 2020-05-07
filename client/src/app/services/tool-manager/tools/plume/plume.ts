import { ANGLE } from '../../../../components/drawing/tool-detail/applicable-setting.class';
import { SvgFeatherComponent } from '../../../../components/drawing/work-board/svg-feather/svg-feather.component';
import {DEFAULT_BLUE, DEFAULT_OPACITY} from '../../../../constants/colors';
import { KeyboardKey } from '../../../../enums/keyboard';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import {KeyboardState} from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation, MouseWheelState } from '../../../../logic/events/mouse/mouse-event-data';
import { MAX_ANGLE_DEGREES, MIN_ANGLE_DEGREES } from '../../../color-picker/constant';
import {Coords} from '../coords';
import {Tool} from '../tool/tool';

export class Plume extends Tool {

    static readonly DEFAULT_SIZE: number = 1;
    static readonly DEFAULT_ANGLE: number = 45;
    protected isDrawing: boolean;

    protected points: Coords[] = [];
    protected coords: Coords | undefined;

    constructor() {
        super();
        super.size = Plume.DEFAULT_SIZE;
        this.isDrawing = false;
    }

    static getInstance(): Tool {
        const TOOL_TYPE = new Plume();
        return super.getInstance(TOOL_TYPE);
    }

    private createSvg(status: SvgStatus = SvgStatus.InProgress): void {
        const SVG: SvgFeatherComponent | undefined = Tool.SVG_COMPONENT_MANAGER
            .createSvgComponent({
                onTopOfLayer: true,
                svgStatus: status,
                svgLayer: SvgLayer.Stack,
                svgType: SvgType.SvgFeatherComponent,
            })  as SvgFeatherComponent;
        if (SVG === undefined) { return; }

        for (const point of this.points) { SVG.addPoint(point.x, point.y);  }

        const opacity = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryOpacity;
        SVG.setPrimaryOpacity(opacity !== undefined ? opacity : DEFAULT_OPACITY);

        const size = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
        SVG.setSizeOfLine(size !== undefined ? size : super.size);

        const importedAngle = Tool.TOOL_OPTIONS_MANAGER.getSettings().angle;
        this.angle = importedAngle ? importedAngle : Plume.DEFAULT_ANGLE;
        SVG.setRotationAngle(this.angle !== undefined ? this.angle : super.angle);

        const color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
        SVG.setPrimaryColor(color !== undefined ? color : DEFAULT_BLUE);

    }

    private computeCoords(mouseData: MouseEventData): Coords {
        return new Coords(mouseData.x, mouseData.y);
    }

    reset(): void {
        this.points = [];
        this.coords = undefined;
    }

    cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        this.reset();
    }

    onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        if (mouseData.location === MouseLocation.Outside) { return; }
        this.coords = this.computeCoords(mouseData);
        this.points.push(this.coords);
        this.isDrawing = true;
    }

    onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        if (!this.isDrawing) { return; }
        this.coords = this.computeCoords(mouseData);
        this.points.push(this.coords);
        this.createSvg(SvgStatus.Permanent);

        this.isDrawing = false;
        this.reset();
    }

    onMouseMove(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        this.coords = this.computeCoords(mouseData);
        if (this.isDrawing) {
            this.points.push(this.coords);
            this.createSvg();
        }
    }

    onMouseLeave(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        this.onLeftUp(mouseData, keyboardData);
    }

    onWheelEvent(mouseData: MouseEventData, keyboardState: KeyboardState): void {
        if (!this.angle && this.angle !== 0) { this.angle = Plume.DEFAULT_ANGLE; }

        const BIG_STEP_DEGREES = 15;
        const SMALL_STEP_DEGREES = 1;
        const dir = mouseData.wheel === MouseWheelState.WheelDown ? -1 : 1;

        const ALT_PRESSED = Tool.KEYBOARD_MANAGER_SERVICE.checkKeyboardShortcut([KeyboardKey.Alt], []);
        const unrangedAOR = this.angle + (ALT_PRESSED ? SMALL_STEP_DEGREES : BIG_STEP_DEGREES) * dir;

        this.angle = this.range(unrangedAOR, MIN_ANGLE_DEGREES, MAX_ANGLE_DEGREES);
        const ANGLE_OPTION = Tool.TOOL_OPTIONS_MANAGER.currentSettings.findOptionWithName(ANGLE);
        if (ANGLE_OPTION) { ANGLE_OPTION.default = this.angle; }

        Tool.TOOL_OPTIONS_MANAGER.getSettings().angle = this.angle;
    }

    range(val: number, min: number, max: number): number {
        const delta = max - min;
        if (val < min) { return val + delta; }
        if (max <= val) { return val - delta; }
        return val;
    }
}
