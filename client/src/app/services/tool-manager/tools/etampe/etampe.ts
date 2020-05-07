import { ANGLE } from '../../../../components/drawing/tool-detail/applicable-setting.class';
import { SvgStampComponent } from '../../../../components/drawing/work-board/svg-stamp/svg-stamp.component';
import { KeyboardKey } from '../../../../enums/keyboard';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation, MouseWheelState } from '../../../../logic/events/mouse/mouse-event-data';
import { MAX_ANGLE_DEGREES, MIN_ANGLE_DEGREES } from '../../../color-picker/constant';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';

export class Etampe extends Tool {

    static readonly DEFAULT_SIZE: number = 4;
    static readonly DEFAULT_ANGLE: number = 45;

    origin: Coords | undefined;
    coords: Coords | undefined;
    protected angleOfRotation: number | undefined = undefined;

    constructor() {
        super();
        super.size = Etampe.DEFAULT_SIZE;
        this.reset();
    }

    static getInstance(): Tool {
        const TOOL_TYPE = new Etampe();
        return super.getInstance(TOOL_TYPE);
    }

    createStamp(status: SvgStatus = SvgStatus.InProgress): void {
        if (this.origin === undefined || this.coords === undefined) { return; }

        const svgStamp: SvgStampComponent | undefined = Tool.SVG_COMPONENT_MANAGER
            .createSvgComponent({
                onTopOfLayer: true,
                svgStatus: status,
                svgLayer: SvgLayer.Stack,
                svgType: SvgType.SvgStampComponent,
            }) as SvgStampComponent;
        if (svgStamp === undefined) { return; }
        const size = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
        svgStamp.setScaleOfStamp(size !== undefined ? size : super.size);

        const stampType = Tool.TOOL_OPTIONS_MANAGER.getSettings().tracingType;

        this.angleOfRotation = Tool.TOOL_OPTIONS_MANAGER.getSettings().angle;
        svgStamp.setRotationAngle(this.angleOfRotation !== undefined ? this.angleOfRotation : super.angle);

        svgStamp.placeOnScreen(this.coords.x, this.coords.y, stampType);
        this.angleOfRotation = Tool.TOOL_OPTIONS_MANAGER.getSettings().angle;
        svgStamp.setRotationAngle(this.angleOfRotation !== undefined ? this.angleOfRotation : super.angle);
    }

    reset(): void {
        this.origin = undefined;
        this.coords = undefined;
    }

    computeCoords(mouseData: MouseEventData): Coords|undefined {
        if (this.origin === undefined) {
            return undefined;
        }
        return new Coords(mouseData.x, mouseData.y);
    }

    cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        this.reset();
        this.createStamp(SvgStatus.Permanent);
    }

    onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        if (mouseData.location === MouseLocation.Outside) { return; }
        if (this.origin === undefined) {
            this.origin = new Coords(mouseData.x, mouseData.y);
        }
    }

    onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        if (this.origin !== undefined) {
            this.coords = this.computeCoords(mouseData);
            this.createStamp(SvgStatus.Permanent);
            this.reset();
        }
    }
    onWheelEvent(mouseData: MouseEventData, keyboardState: KeyboardState): void {
        if (!this.angle && this.angle !== 0) { this.angle = Etampe.DEFAULT_ANGLE; }

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
