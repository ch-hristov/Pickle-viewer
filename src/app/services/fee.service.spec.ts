import { TestBed } from '@angular/core/testing';

import { FeeService } from './fee.service';

describe('FeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeeService = TestBed.get(FeeService);
    expect(service).toBeTruthy();
  });
});
