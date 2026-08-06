export interface AuthSessionResponse {
  id: number;
  deviceName: string;
  lastActiveAt: string;
  expiresAt: string;
  current: boolean;
}

export interface SessionRevocationResponse {
  currentSession: boolean;
}
