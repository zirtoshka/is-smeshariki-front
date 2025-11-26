import {Environment} from './environment.model';

export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081/api',
  authBaseUrl: 'http://localhost:8081/auth',
  socket: {
    url: 'ws://localhost:8081',
    path: '/socket',
    reconnectIntervalMs: 3000,
    heartbeatIntervalMs: 10000
  },
  featureFlags: {
    enableSockets: true,
    enableNotifications: true,
    enableDebugTools: true
  }
};
