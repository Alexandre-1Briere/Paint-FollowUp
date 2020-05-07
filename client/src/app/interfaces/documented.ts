import {Option} from '../services/tool-manager/tools-options-manager/tools-options/option';

export class Documented {
  icon: string | undefined;
  name: string;
  category: string;
  description: string;
  usage: string;
  options: Option[];
}
