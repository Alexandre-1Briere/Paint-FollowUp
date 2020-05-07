import {SvgBoardJson} from './svg-json';

export interface SvgUndoRedoStacks {
  undoStack: SvgBoardJson[];
  redoStack: SvgBoardJson[];
}
