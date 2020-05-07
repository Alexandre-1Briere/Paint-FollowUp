import { TestBed } from '@angular/core/testing';

import { ServerComService } from './server-com.service';

describe('ServerComService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerComService = TestBed.get(ServerComService);
    expect(service).toBeTruthy();
  });
});
