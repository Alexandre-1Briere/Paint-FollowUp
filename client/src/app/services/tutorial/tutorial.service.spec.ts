import { TestBed } from '@angular/core/testing';
import { DEACTIVATED, DISABLE, ENABLE,
  NOT_DEACTIVATED, TUTORIAL} from '../../../../../common/constant/client/service/cookies/constant';
import { StorageService } from '../storage/storage.service';
import { TutorialService } from './tutorial.service';

describe('TutorialService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
      ],
    });
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    const service: TutorialService = TestBed.get(TutorialService);
    expect(service).toBeTruthy();
  });

  it('state should create a cookie and set his value depending on the parameter value', () => {
    const service: TutorialService = TestBed.get(TutorialService);
    service.state(DEACTIVATED);
    expect(localStorage.getItem(TUTORIAL)).toMatch(DISABLE);
    service.state(NOT_DEACTIVATED);
    expect(localStorage.getItem(TUTORIAL)).toMatch(ENABLE);
  });

  it('isDeactivated should true if tutorial is deactivated or else false', () => {
    const service: TutorialService = TestBed.get(TutorialService);
    expect(service.isDeactivated()).toBeFalsy();
    service.state(DEACTIVATED);
    expect(service.isDeactivated()).toBeTruthy();
    service.state(NOT_DEACTIVATED);
    expect(service.isDeactivated()).toBeFalsy();
  });

});
