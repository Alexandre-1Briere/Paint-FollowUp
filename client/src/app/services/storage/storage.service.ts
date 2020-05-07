import { Injectable } from '@angular/core';
import { ERROR } from '../../../../../common/constant/client/service/cookies/constant';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  add(name: string, value: string, type: boolean = false): void {
    (type ? sessionStorage : localStorage).setItem(name, value);
  }

  delete(name: string, type: boolean = false): void {
    (type ? sessionStorage : localStorage).removeItem(name);
  }

  deleteAll(type: boolean = false): void {
    (type ? sessionStorage : localStorage).clear();
  }

  get(name: string, type: boolean = false): string {
    const info: string | null = (type ? sessionStorage : localStorage).getItem(name);
    return info ? info : ERROR;
  }

  exist(name: string, type: boolean = false): boolean {
    return this.get(name, type) !== ERROR;
  }

}
