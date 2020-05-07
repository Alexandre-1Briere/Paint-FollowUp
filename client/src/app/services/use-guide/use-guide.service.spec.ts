import { TestBed } from '@angular/core/testing';
import { TOOL_NUMBER } from '../../constants/tools-list.constant';
import { UseGuideService } from './use-guide.service';

describe('UseGuideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UseGuideService = TestBed.get(UseGuideService);
    expect(service).toBeTruthy();
  });

  it('should get all the tool item', () => {
    const service: UseGuideService = TestBed.get(UseGuideService);
    let length = 0;
    for (const toolType of service.getTools()) {
      length += toolType.length;
    }
    expect(length).toBe(TOOL_NUMBER);
  });
});
