const keyFor = (inviteCode: string) =>
  `pikone:decision-room:${inviteCode.toUpperCase()}:participant-token`;

export const readDecisionRoomParticipantToken = (inviteCode: string) => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(keyFor(inviteCode));
};

export const writeDecisionRoomParticipantToken = (inviteCode: string, token: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(keyFor(inviteCode), token);
};

export const removeDecisionRoomParticipantToken = (inviteCode: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(keyFor(inviteCode));
};
