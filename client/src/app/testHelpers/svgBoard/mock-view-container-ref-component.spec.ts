import {Component, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-mock-view-component',
  template: '',
})
export class MockViewContainerRefComponent {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
