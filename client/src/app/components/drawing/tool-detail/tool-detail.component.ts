import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {
  OPTION_RADIO_BUTTONS,
  OPTION_SELECT,
  OPTION_SLIDE_TOGGLE,
  OPTION_SLIDER,
} from '../../../constants/options-types';
import { ToolsOptionsManagerService } from '../../../services/tool-manager/tools-options-manager/tools-options-manager.service';
import { Option } from '../../../services/tool-manager/tools-options-manager/tools-options/option';
import { ApplicableSettingClass, Config } from './applicable-setting.class';

@Component({
  selector: 'app-tool-detail',
  templateUrl: './tool-detail.component.html',
  styleUrls: ['./tool-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolDetailComponent implements OnInit, OnChanges {

  static readonly DEFAULT_DISPLAY_MODE: boolean = false;

  // making the constants accessible from the html
  readonly OPTION_RADIO_BUTTONS: string = OPTION_RADIO_BUTTONS;
  readonly OPTION_SLIDE_TOGGLE: string = OPTION_SLIDE_TOGGLE;
  readonly OPTION_SLIDER: string = OPTION_SLIDER;
  readonly OPTION_SELECT: string = OPTION_SELECT;

  @Input() inputConfig: Config;

  @Output() settingChanged: EventEmitter<ApplicableSettingClass> = new EventEmitter();
  @Output() backgroundChanged: EventEmitter<string> = new EventEmitter();

  options: Option[];

  constructor(public toolOptionManager: ToolsOptionsManagerService) {
    this.toolOptionManager.getOptionsObs().subscribe(() => {
      this.updateOptions();
    });
  }

  ngOnInit(): void {
    this.updateOptions();
  }

  ngOnChanges(): void {
    this.toolOptionManager.configure(this.inputConfig);
    this.toolOptionManager.configureFromOptions();
  }

  updateOptions(): void {
    this.options = this.toolOptionManager.getOptions();
    this.toolOptionManager.configureFromOptions();
  }

  updateBackground(color: string): void {
      this.backgroundChanged.emit(color);
  }
}
