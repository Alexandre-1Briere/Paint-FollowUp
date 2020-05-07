import { SvgBucketComponent } from '../../../../components/drawing/work-board/svg-bucket/svg-bucket.component';
import { DEFAULT_BLUE, DEFAULT_OPACITY } from '../../../../constants/colors';
import { SvgLayer, SvgStatus, SvgType } from '../../../../enums/svg';
import { KeyboardState } from '../../../../logic/events/keyboard/keyboard-state';
import { MouseEventData, MouseLocation } from '../../../../logic/events/mouse/mouse-event-data';
import { ColorManipulator } from '../../../color-picker/color-manipulator/color-manipulator';
import { MAX_HEX_VALUE, PIXEL_SIZE } from '../../../color-picker/constant';
import { Coords } from '../coords';
import { Tool } from '../tool/tool';

interface HashTable {
    [key: string]: boolean;
}

export class PotDePeinture extends Tool {

    coords: Coords | undefined;

    colorRed: number[];
    colorBlue: number[];
    colorGreen: number[];
    edges: Coords[];
    similarMap: boolean[][];
    tolerance: number;
    ctx: CanvasRenderingContext2D;

    buttonPressed: boolean;

    static getInstance(): Tool {
        const TOOL_TYPE = new PotDePeinture();
        return super.getInstance(TOOL_TYPE);
    }

    static computeCoords(mouseData: MouseEventData): Coords {
        return new Coords(mouseData.x, mouseData.y);
    }

    static getTolerance(): number {
        const MAX_OVER_100 = 100;
        const tolerance = Tool.TOOL_OPTIONS_MANAGER.getSettings().size;
        return ColorManipulator.scale(tolerance ? tolerance : 0, 0, MAX_OVER_100, 0, MAX_HEX_VALUE);
    }

    constructor() {
        super();
        this.reset();
    }

    reset(): void {
        this.coords = undefined;
        this.edges = [];
        this.colorRed = [];
        this.colorBlue = [];
        this.colorGreen = [];
        this.tolerance = 0;
        this.buttonPressed = false;
    }

    onLeftDown(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        if (mouseData.location === MouseLocation.Outside) {
            return;
        }
        this.buttonPressed = true;
    }

    onLeftUp(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        if (!this.buttonPressed) {
            return;
        }
        this.coords = PotDePeinture.computeCoords(mouseData);
        this.buildCanvas();
    }

    cancelOnGoing(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        this.reset();
    }

    onSettingTool(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        this.reset();
    }

    onRemovingTool(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        this.cancelOnGoing(mouseData, keyboardData);
    }

    private createSVG(status: SvgStatus = SvgStatus.InProgress): void {
        const SVG: SvgBucketComponent | undefined = Tool.SVG_COMPONENT_MANAGER
            .createSvgComponent({
                onTopOfLayer: true,
                svgStatus: status,
                svgLayer: SvgLayer.Stack,
                svgType: SvgType.SvgBucketComponent,
            }) as SvgBucketComponent;
        if (SVG === undefined) {
            return;
        }

        SVG.createPaths(this.similarMap);

        const opacity = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryOpacity;
        SVG.setPrimaryOpacity(opacity !== undefined ? opacity : DEFAULT_OPACITY);

        const color = Tool.TOOL_OPTIONS_MANAGER.getSettings().primaryColor;
        SVG.setPrimaryColor(color !== undefined ? color : DEFAULT_BLUE);
    }

    onMouseLeave(mouseData: MouseEventData, keyboardData: KeyboardState): void {
        this.buttonPressed = false;
    }

    private resetSimilarMap(): void {
        if (!this.ctx) {
            return;
        }

        this.similarMap = [];
        for (let x = 0; x < this.ctx.canvas.width; x++) {
            this.similarMap.push([]);
            for (let y = 0; y < this.ctx.canvas.height; y++) {
                this.similarMap[x].push(false);
            }
        }
    }

    private buildCanvas(): void {
        if (!this.coords) {
            return;
        }
        Tool.CANVAS_SERVICE.accessAsCanvas(
            Tool.CANVAS_SERVICE.getCurrentDrawingElement(),
            (canvas) => {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    this.ctx = ctx;
                }
            }).then(() => {
            this.mapSimilarColors();
        });
    }

    private colorIsSimilar(currentValue: number, targetValue: number[]): boolean {
        return currentValue >= targetValue[0] && currentValue <= targetValue[1];
    }

    private isSimilar(coords: Coords, width: number, colorArray: Uint8Array): boolean {
        const COLORS_PER_PIXEL = 4;
        const index = (coords.y * width + coords.x) * COLORS_PER_PIXEL;
        const redIsSimilar = this.colorIsSimilar(colorArray[index], this.colorRed);
        const greenIsSimilar = this.colorIsSimilar(colorArray[index + 1], this.colorGreen);
        const blueIsSimilar = this.colorIsSimilar(colorArray[index + 2], this.colorBlue);
        return redIsSimilar && greenIsSimilar && blueIsSimilar;
    }

    private isNeighbor(coords: Coords, visited: HashTable, width: number, colorArray: Uint8Array): boolean {
        if (visited.hasOwnProperty(coords.toString())) {
            return false;
        }
        this.similarMap[coords.x][coords.y] = this.isSimilar(coords, width, colorArray);
        return this.similarMap[coords.x][coords.y];
    }

    private mapSimilarColors(): void {
        if (!this.coords) {
            return;
        }
        this.tolerance = PotDePeinture.getTolerance();

        this.resetSimilarMap();
        const data = this.ctx.getImageData(this.coords.x, this.coords.y, PIXEL_SIZE, PIXEL_SIZE).data;
        this.colorRed[0] = data[0] - this.tolerance;
        this.colorRed[1] = data[0] + this.tolerance;
        this.colorGreen[0] = data[1] - this.tolerance;
        this.colorGreen[1] = data[1] + this.tolerance;
        this.colorBlue[0] = data[2] - this.tolerance;
        this.colorBlue[1] = data[2] + this.tolerance;

        const todo: Coords[] = [this.coords];
        const visited: HashTable = {};
        visited[this.coords.toString()] = true;
        const width = this.ctx.canvas.width;
        const height = this.ctx.canvas.height;

        const imageData = this.ctx.getImageData(0, 0, width, height);
        const colorArray = new Uint8Array(imageData.data.buffer);
        while (0 < todo.length) {
            const coords = todo[0];
            let newCoords;
            const left = coords.x - 1;
            const right = coords.x + 1;
            const top = coords.y - 1;
            const bottom = coords.y + 1;
            if (0 <= left) {
                newCoords = new Coords(left, coords.y);

                if (this.isNeighbor(newCoords, visited, width, colorArray)) {
                    todo.push(newCoords);
                    visited[newCoords.toString()] = true;
                }
            }
            if (0 <= top) {
                newCoords = new Coords(coords.x, top);
                if (this.isNeighbor(newCoords, visited, width, colorArray)) {
                    todo.push(newCoords);
                    visited[newCoords.toString()] = true;
                }
            }
            if (right < width) {
                newCoords = new Coords(right, coords.y);
                if (this.isNeighbor(newCoords, visited, width, colorArray)) {
                    todo.push(newCoords);
                    visited[newCoords.toString()] = true;
                }
            }
            if (bottom < height) {
                newCoords = new Coords(coords.x, bottom);
                if (this.isNeighbor(newCoords, visited, width, colorArray)) {
                    todo.push(newCoords);
                    visited[newCoords.toString()] = true;
                }
            }
            todo[0] = todo[todo.length - 1];
            todo.pop();
        }
        this.createSVG(SvgStatus.Permanent);
    }
}
