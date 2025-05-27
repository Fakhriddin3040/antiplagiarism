import { TestBed } from '@angular/core/testing';

import { DynamicModalAbstractService } from './dynamic-modal-abstract.service';

describe('DynamicModalAbstractService', () => {
  let service: DynamicModalAbstractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicModalAbstractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
