import { Option } from '../../../services/tool-manager/tools-options-manager/tools-options/option';

export const FULL = 'Plein';
export const BORDER = 'Contour';

export const STAY_AT_HOME = 'stay-at-home';
export const ROBOT = 'robot';
export const ANGLE = 'angle';
export const SIZE = 'size';
export const BORDER_SIZE = 'border-size';
export const STYLE = 'tracing-type';
export const POINTS_SIZE = 'points-size';
export const ENABLE_POINTS = 'enable-points';

export class ApplicableSettingClass {
  options: Option[];

  angle: number | undefined;
  size: number | undefined;
  borderSize: number | undefined;
  primaryColor: string;
  secondaryColor: string;
  tracingType: string | undefined;
  primaryOpacity: number;
  secondaryOpacity: number;
  pointsSize: number | undefined;

  constructor() {
    this.options = [];
  }

  setSize(value: string): void {
    this.size = this.setValue(value);
  }

  setBorderSize(value: string): void {
    this.borderSize = this.setValue(value);
  }

  setPointSize(value: string): void {
    this.pointsSize = this.setValue(value);
  }

  setValue(assignee: string): number | undefined {
    let assigned: number | undefined;
    assignee = assignee.trim();
    assignee = assignee.replace(/^0+/, '') || '0';
    const numberValue = Math.floor(Number(assignee));
    if (numberValue !== Infinity && numberValue > 0) {
      assigned = numberValue;
    } else {
      assigned = 1;
    }
    return assigned;
  }

  configure(config: Config): void {
    if (!config) { return; }

    if (config.size && config.size > 0) {
      this.size = config.size;
    } else {
      this.size = undefined;
    }
    if ( config.borderSize !== undefined) {
      this.borderSize = config.borderSize > 0 ? config.borderSize : undefined;
    } else {
      this.borderSize = undefined;
    }
    this.pointsSize = config.pointsSize;
    this.tracingType = config.tracingType;

  }

  configureOptions(options: Option[]): void {
    this.options = options;
  }

  configureFromOptions(): void {
    this.angle = this.getAngleFromOptions();
    this.size = this.getSizeFromOptions();
    this.borderSize = this.getBorderSizeFromOptions();
    this.tracingType = this.getTracingTypeFromOptions();
    this.pointsSize = this.getPointsSizeFromOptions();
  }

  findOptionWithName(str: string): Option | undefined {
    for (const option of this.options) {
      if (option.name.toLowerCase() === str.toLowerCase()) {
        return option;
      }
    }
    return undefined;
  }

  getAngleFromOptions(): number | undefined {
    const option = this.findOptionWithName(ANGLE);
    return option ? option.default : undefined;
  }

  getSizeFromOptions(): number | undefined {
    const option = this.findOptionWithName(SIZE);
    return option ? option.default : undefined;
  }

  getBorderSizeFromOptions(): number | undefined {
    const option = this.findOptionWithName(BORDER_SIZE);
    return option ? option.default : undefined;
  }

  getTracingTypeFromOptions(): string | undefined {
    const option = this.findOptionWithName(STYLE);
    return option && option.default ? option.default : undefined;
  }

  getPointsSizeFromOptions(): number | undefined {
    const option = this.findOptionWithName(POINTS_SIZE);
    const enabled = this.findOptionWithName(ENABLE_POINTS);
    if (enabled && option) {
      option.enabled = enabled.default;
      return enabled.default ? option.default : undefined;
    } else if (enabled === undefined && option) {
      return option.default;
    }
    return undefined;
  }

  equal(other: ApplicableSettingClass): boolean {
    return this.size === other.size &&
        this.borderSize === other.borderSize &&
        this.primaryColor === other.primaryColor &&
        this.secondaryColor === other.secondaryColor &&
        this.tracingType === other.tracingType;
  }
}

export interface Config {
  size?: number;
  borderSize?: number;
  tracingType?: string;
  pointsSize?: number | undefined;
}
