import Ajv from "ajv";

import schema from "../schema.json";

export class Builder {
  private apiKey: string;
  private peerId: string;
  private remoteId: string;
  private additionalId: string;
  private statsSeq: number;

  constructor(
    peerId: string,
    apiKey: string,
    remoteId: string,
    additionalId: string
  ) {
    this.peerId = peerId;
    this.apiKey = apiKey;
    this.remoteId = remoteId;
    this.additionalId = additionalId;
    this.statsSeq = 0;
  }

  build(stats: RTCStats[][], events: SulfurEvent[]): SulfurData {
    this.statsSeq += stats.length;
    return {
      peerId: this.peerId,
      remoteId: this.remoteId,
      apikey: this.apiKey,
      additionalId: this.additionalId,
      statsSeq: this.statsSeq,
      stats,
      events,
    };
  }

  buildFromRemainig(
    remaining: SulfurData,
    stats: RTCStats[][],
    events: SulfurEvent[]
  ): SulfurData {
    const mergeStats = remaining.stats;
    const mergeEvents = remaining.events;
    mergeStats.push(...stats);
    mergeEvents.push(...events);
    const statsSeq = remaining.statsSeq + mergeStats.length;
    const data: SulfurData = {
      peerId: this.peerId,
      remoteId: this.remoteId,
      apikey: this.apiKey,
      additionalId: this.additionalId,
      statsSeq,
      stats: mergeStats,
      events: mergeEvents,
    };
    return data;
  }
}
