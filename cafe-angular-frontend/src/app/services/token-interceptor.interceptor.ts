import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // debugger
    const token = localStorage.getItem('token');
    if(token){
      // request = request.clone({headers:request.headers.set('Authorization', 'Bearer ' + token)});
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
    }
    // return next.handle(request);
    
    return next.handle(request).pipe(
      catchError((error) => {
        if(error instanceof HttpErrorResponse){
          console.log(error.url);
          if(error.status == 401 || error.status == 403){
            if(this.router.url === '/'){}
            else{
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        }
        return throwError(error);
      })
    );

  }
}
