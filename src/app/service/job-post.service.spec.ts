import { TestBed } from '@angular/core/testing';

import { JobPostService } from './job-post.service';

describe('JobPostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobPostService = TestBed.get(JobPostService);
    expect(service).toBeTruthy();
  });
});
