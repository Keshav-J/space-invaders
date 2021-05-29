import { TestBed } from '@angular/core/testing';

import { HTTPInterceptor } from './http.interceptor';

describe('HttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HTTPInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HTTPInterceptor = TestBed.inject(HTTPInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
