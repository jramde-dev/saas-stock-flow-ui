import {TestBed} from '@angular/core/testing';
import {CanActivateFn} from '@angular/router';

import {platformAdminGuard} from './platform-admin-guard';

describe('platformAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => platformAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
