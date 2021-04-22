import { TestBed } from '@angular/core/testing';

import { WordRandomService } from './word-random.service';

describe('WordRandomService', () => {
  let service: WordRandomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordRandomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
