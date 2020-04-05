import { TestBed } from '@angular/core/testing';

import { CompanyProfileService } from './company-profile.service';

describe('CompanyProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyProfileService = TestBed.get(CompanyProfileService);
    expect(service).toBeTruthy();
  });
});
