import {Environment} from './environment.model';

export const environment: Environment = {
  production: true,
  apiBaseUrl: 'http://localhost:8081/api',
  authBaseUrl: 'http://localhost:8081/auth',
  socket: {
    url: 'ws://localhost:8081',
    path: '/socket',
    reconnectIntervalMs: 5000,
    heartbeatIntervalMs: 20000
  },
  featureFlags: {
    enableSockets: true,
    enableNotifications: true,
    enableDebugTools: false
  }
};
