import { TestBed } from '@angular/core/testing';

import { FolderModalService } from './folder-modal.service';

describe('FolderModalService', () => {
  let service: FolderModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FolderModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
