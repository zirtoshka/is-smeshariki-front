import {HttpContextToken} from '@angular/common/http';

/**
 * When set to true in request context, error interceptor will not show user notifications.
 */
export const SKIP_ERROR_NOTIFICATION = new HttpContextToken<boolean>(() => false);

/**
 * List of HTTP status codes for which the error interceptor should stay silent.
 */
export const IGNORE_ERROR_NOTIFICATION_STATUSES = new HttpContextToken<number[]>(() => []);
