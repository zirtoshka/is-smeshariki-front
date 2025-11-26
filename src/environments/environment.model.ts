export interface SocketConfig {
  url: string;
  path: string;
  reconnectIntervalMs: number;
  heartbeatIntervalMs: number;
}

export interface FeatureFlags {
  enableSockets: boolean;
  enableNotifications: boolean;
  enableDebugTools: boolean;
}

export interface Environment {
  production: boolean;
  apiBaseUrl: string;
  authBaseUrl: string;
  socket: SocketConfig;
  featureFlags: FeatureFlags;
}
