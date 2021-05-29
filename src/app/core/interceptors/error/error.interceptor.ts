import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RESPONSE_STATUS_CODE } from '../../constants/responseStatusCodes';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      let errorMessage: string = err.error.message || err.statusText;

      switch (err.status) {
        case RESPONSE_STATUS_CODE.BADREQUEST:
          errorMessage = 'Required params missing/invalid';
          break;

        case RESPONSE_STATUS_CODE.UNAUTHORIZED:
          errorMessage = 'User is Unauthorized';
          break;

        case RESPONSE_STATUS_CODE.FORBIDDEN:
          errorMessage = 'User is Forbidden';
          break;

        case RESPONSE_STATUS_CODE.NOTFOUND:
          errorMessage = 'Requested resources not found';
          break;

        case RESPONSE_STATUS_CODE.INTERNALSERVERERROR:
          errorMessage = 'Internal Server Error';
          break;

        case RESPONSE_STATUS_CODE.BADGATEWAY:
          errorMessage = 'Bad Gateway';
          break;
      }

      return throwError(errorMessage);
    }));
  }
}
