import Ajv from "ajv";

import schema from "../schema.json";

export class DataHolder {
  private readonly apiKey: string;
  private readonly peerId: string;
  private readonly remoteId: string;
  private readonly additionalId: string;

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

  public addStatsSeq(count: number) {
    this.statsSeq += count;
  }

  public build(stats: RTCStats[][], events: SulfurEvent[]): SulfurData {
    const data: SulfurData = {
      peerId: this.peerId,
      remoteId: this.remoteId,
      apikey: this.apiKey,
      additionalId: this.additionalId,
      statsSeq: this.statsSeq,
      stats,
      events,
    };
    return data;
  }

  public buildFromRemainig(
    remaining: SulfurData,
    stats: RTCStats[][],
    events: SulfurEvent[]
  ): SulfurData {
    const mergeStats = remaining.stats;
    const mergeEvents = remaining.events;
    mergeStats.push(...stats);
    mergeEvents.push(...events);
    const data: SulfurData = {
      peerId: this.peerId,
      remoteId: this.remoteId,
      apikey: this.apiKey,
      additionalId: this.additionalId,
      statsSeq: this.statsSeq,
      stats: mergeStats,
      events: mergeEvents,
    };
    return data;
  }
}
