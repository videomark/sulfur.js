export type SulfurEventType =
  | "start"
  | "stop"
  | "mute"
  | "unmute"
  | "resulution";

export type SulfurEvent = {
  type: SulfurEventType;
  timestamp: number;
  value?: string;
};

export type SulfurData = {
  peerId: string;
  remoteId: string;
  apikey: string;
  additionalId: string;
  statsSeq: number;
  stats: RTCStats[][];
  events: SulfurEvent[];
};
