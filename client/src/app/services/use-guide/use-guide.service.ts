import {Injectable} from '@angular/core';
import {TOOL_LIST} from '../../constants/tools-list.constant';
import {Documented} from '../../interfaces/documented';
import {Tool} from '../tool-manager/tools/tool/tool';
import {tools} from '../tool-manager/tools/tools';

@Injectable({
  providedIn: 'root',
})
export class UseGuideService {
  toolsArray: Documented[][];

  constructor() {
    this.toolsArray = [];
    this.loadTools(TOOL_LIST);
  }

  loadTools(TOOLS: Documented[][]): void {
    for (let categoryIndex = 0; categoryIndex < TOOLS.length; categoryIndex++) {
      this.toolsArray.push([]);
      for (const info of TOOLS[categoryIndex]) {
        if (tools.has(info.name.toLowerCase())) {
          const tool: Tool = tools.get(info.name.toLowerCase());
          tool.setToolInfo(
            info.icon,
            info.category,
            info.name,
            info.description,
            info.usage,
            info.options,
          );
          this.toolsArray[categoryIndex].push(tool);
        } else {
          this.toolsArray[categoryIndex].push(info);
        }
      }
    }
  }

  getTools(loadWelcome: boolean = true): Documented[][] {
    return loadWelcome ? this.toolsArray.slice() : this.toolsArray.slice(1);
  }
}
