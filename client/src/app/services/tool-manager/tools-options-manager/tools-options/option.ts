import { Choice } from './choice';

export class Option {
  name: string;
  label: string | undefined;
  enabled: boolean | undefined;
  // It can take any type and none will break the application (in theory)
  // tslint:disable-next-line:no-any
  default: any | undefined;
  choices: Choice[] | undefined;
  min: number | undefined;
  max: number | undefined;
  type: string;

  static getOptionByName(options: Option[], str: string): Option | undefined {

    for (const option of options) {
      if (option.name === str) { return option; }
    }
    return undefined;
  }
}
