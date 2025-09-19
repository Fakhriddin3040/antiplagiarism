import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { ApiEndpointEnum } from '../../shared/enums/routing/api-endpoint.enum';
import { RegistrationRequest } from '../../core/features/auth/types/registration-request.type';
import { RegistrationResponse } from '../../core/features/auth/types/registration-response.type';
import { AuthRequest } from '../../core/features/auth/types/auth-request.type';
import { AuthResponse } from '../../core/features/auth/types/auth-response.type';
import { switchMap, tap } from 'rxjs/operators';

/* ------------------------- helpers: GUID & data ------------------------- */

function guid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function makeUniqueUser() {
  const id = guid();
  const email = `${id}@test.local`;
  const password = guid();
  const firstName = `FN_${id.slice(0, 8)}`;
  const lastName = `LN_${id.slice(9, 13)}`;
  return { email, password, firstName, lastName };
}

/* -------------------------------- tests -------------------------------- */

describe('AuthService (register → login, unique data)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClientTesting(), // вместо HttpClientTestingModule
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  it('should register a new user and then login successfully', (done) => {
    const u = makeUniqueUser();

    const registrationReq = new RegistrationRequest(u.firstName, u.lastName, u.email, u.password);
    const loginReq = new AuthRequest(u.email, u.password); // username = email

    service.register(registrationReq)
      .pipe(
        tap((regResp: RegistrationResponse) => {
          expect(regResp).toBeTruthy();
          expect(typeof regResp.accessToken).toBe('string');
          expect(regResp.accessToken.length).toBeGreaterThan(0);
        }),
        switchMap(() => service.login(loginReq)),
      )
      .subscribe({
        next: (loginResp: AuthResponse) => {
          expect(loginResp).toBeTruthy();
          expect(typeof loginResp.accessToken).toBe('string');
          expect(loginResp.accessToken.length).toBeGreaterThan(0);
          done();
        },
        error: (err) => done.fail(err),
      });

    // ---- REGISTER ----
    const regReqCall = httpMock.expectOne(ApiEndpointEnum.REGISTER);
    expect(regReqCall.request.method).toBe('POST');

    const regBody: any = regReqCall.request.body;
    expect(regBody._firstName).toBe(u.firstName);
    expect(regBody._lastName).toBe(u.lastName);
    expect(regBody._email).toBe(u.email);
    expect(regBody._password).toBe(u.password);

    const fakeRegistrationResponse: RegistrationResponse = new RegistrationResponse(`reg-${guid()}`);
    regReqCall.flush(fakeRegistrationResponse);

    // ---- LOGIN ----
    const loginReqCall = httpMock.expectOne(ApiEndpointEnum.LOGIN);
    expect(loginReqCall.request.method).toBe('POST');

    const loginBody: any = loginReqCall.request.body;
    expect(loginBody._username).toBe(u.email);
    expect(loginBody._password).toBe(u.password);

    const fakeLoginResponse: AuthResponse = new AuthResponse(`login-${guid()}`);
    loginReqCall.flush(fakeLoginResponse);
  });

  it('should generate unique data each run (sanity)', () => {
    const a = makeUniqueUser();
    const b = makeUniqueUser();
    expect(a.email).not.toBe(b.email);
    expect(a.password).not.toBe(b.password);
  });
});
