type SulfurEventType = "start" | "stop" | "mute" | "unmute" | "resulution";

type SulfurEvent = {
  type: SulfurEventType;
  timestamp: number;
  value?: string;
};

type SulfurData = {
  peerId: string;
  remoteId: string;
  apikey: string;
  additionalId: string;
  statsSeq: number;
  stats: RTCStats[][];
  events: SulfurEvent[];
};
