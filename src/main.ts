import {enableProdMode, isDevMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {Observable} from 'rxjs/Observable';


const debuggerOn = false;

Observable.prototype.debug = function (message: string){

  return this.do(
    nextValue => {
      if (debuggerOn) {
        console.log(message, nextValue);
      }
    },
    error => {
      if (debuggerOn) {
        console.error(message, error);
      }
    },
    () => {
      if (debuggerOn) {
        console.log('Observerable completed - ', message);
      }
    }
  );
};

declare module 'rxjs/Observable' {
  interface Observable<T>{
    debug: (...any) => Observable<T>;
  }
}


if (!isDevMode) {
  console.log('prodMode');
  enableProdMode();
}


platformBrowserDynamic().bootstrapModule(AppModule);
