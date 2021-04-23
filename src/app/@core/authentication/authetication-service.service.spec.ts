import { TestBed } from '@angular/core/testing';

import { AutheticationService } from './authetication-service.service';

describe('AutheticationServiceService', () => {
  let service: AutheticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutheticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
