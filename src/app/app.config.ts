import { InjectionToken } from '@angular/core';
import { environment } from './../environments/environment';

export let APP_CONFIG = new InjectionToken('app.config');
export interface SSRAppConfig {
  nodeBaseURL:string;
}

export const AppConfig: SSRAppConfig ={
    nodeBaseURL: environment.baseUrl
}