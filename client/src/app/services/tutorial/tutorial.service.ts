import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/services/storage/storage.service';
import { DISABLE, ENABLE, NOT_DEACTIVATED, TUTORIAL } from '../../../../../common/constant/client/service/cookies/constant';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {

  constructor(public storage: StorageService) { }

  state(state: boolean): void {
    this.storage.add(TUTORIAL, state ? DISABLE : ENABLE);
  }

  isDeactivated(): boolean {
    return this.storage.exist(TUTORIAL) ?
    (this.storage.get(TUTORIAL) === DISABLE) :
    NOT_DEACTIVATED;
  }
}
