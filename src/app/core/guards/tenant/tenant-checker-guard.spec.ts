import {TestBed} from '@angular/core/testing';
import {CanActivateFn} from '@angular/router';

import {tenantCheckerGuard} from './tenant-checker-guard';

describe('tenantCheckerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => tenantCheckerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
