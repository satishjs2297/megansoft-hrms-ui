import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiLoadingService } from './api-loading.service';

export const apiLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(ApiLoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
};
