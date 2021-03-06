import {ErrorHandler, LOCALE_ID, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HeaderInterceptorService} from './interceptors/header-interceptor.service';
import {environment} from '../../environments/environment';
import {ServiceWorkerModule} from '@angular/service-worker';
import {BugsnagErrorHandler} from '@bugsnag/plugin-angular';

export function errorHandlerFactory() {
  return new BugsnagErrorHandler();
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
  ], providers: [
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptorService, multi: true},
    {provide: ErrorHandler, useFactory: errorHandlerFactory}
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already imported in the AppModule');
    }
  }
}
