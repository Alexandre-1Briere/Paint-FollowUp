import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KeypressService {

  constructor() { return; }

  isNumber(event: KeyboardEvent): boolean {
    const key = Number(event.key);
    return !(isNaN(key) || key === null);
  }

  rangeValidator(event: KeyboardEvent, value: number,  max: number): boolean {
    if (this.isNumber(event)) {
      return (value + Number(event.key)) <= max && Number(event.key + value) <= max;
    }

    return false;
  }
}
