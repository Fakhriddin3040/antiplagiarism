import { HttpContextToken } from '@angular/common/http';

export const SKIP_CASE_TRANSFORM      = new HttpContextToken<boolean>(() => false);
export const SKIP_REQUEST_TRANSFORM   = new HttpContextToken<boolean>(() => false);
export const SKIP_RESPONSE_TRANSFORM  = new HttpContextToken<boolean>(() => false);
