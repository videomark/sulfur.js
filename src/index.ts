import { EventEmitter } from "events";

import Peer, { MediaConnection } from "skyway-js";

import { Builder } from "./builder";
import { StatsHolder } from "./stats-holder";
import { EventsHolder } from "./events-holder";
import { send } from "./sender";
import { validate } from "./validator";

const DEFAULT_ENDPOINT = "http://stats-aggregator.stage.gcp.skyway.io/sulfur";
const DEFAULT_COLLECT_INTERVAL = 1000;
const DEFAULT_SEND_INTERVAL = 5000;

class SulfurError extends Error {
  public type: string;
  constructor(type: string, message?: string) {
    super(message);
    this.type = type;
  }
}

class Sulfur extends EventEmitter {
  public url: string;
  public collectInterval: number;
  public sendInterval: number;

  private timerOfCollect: number = null;
  private timerOfSend: number = null;
  private isCollectInProgress = false;
  private isSendInProgress = false;
  private countsOfCollect = 0;
  private countsOfSend = 0;

  private remaining: SulfurData;

  private builder: Builder;
  private stats: StatsHolder;
  private events: EventsHolder;

  constructor(options?: {
    url?: string;
    collectInterval?: number;
    sendInterval?: number;
  }) {
    super();
    this.url = options && options.url ? options.url : DEFAULT_ENDPOINT;
    this.collectInterval =
      options && options.collectInterval
        ? options.collectInterval
        : DEFAULT_COLLECT_INTERVAL;
    this.sendInterval =
      options && options.sendInterval
        ? options.sendInterval
        : DEFAULT_SEND_INTERVAL;
  }

  public open(
    peer: Peer,
    connection: MediaConnection,
    video: HTMLVideoElement
  ) {
    if (!peer) {
      super.emit(
        "error",
        new SulfurError("open", "You must specify a valid peer.")
      );
      return;
    }
    if (!connection) {
      super.emit(
        "error",
        new SulfurError("open", "You must specify a valid connection.")
      );
      return;
    }
    if (!peer || !peer.id) {
      super.emit(
        "error",
        new SulfurError("open", "You must specify a valid Peer ID.")
      );
      return;
    }
    if (!peer || !peer.options || !peer.options.key) {
      super.emit(
        "error",
        new SulfurError("open", "You must specify a valid API Key.")
      );
      return;
    }
    if (!connection || !connection.remoteId) {
      super.emit(
        "error",
        new SulfurError("open", "You must specify a valid Remote Peer ID.")
      );
      return;
    }

    this.builder = new Builder(
      peer.id,
      peer.options.key,
      connection.remoteId,
      "additional"
    );
    this.stats = new StatsHolder(connection);
    this.events = new EventsHolder(video);

    this.timerOfCollect = window.setInterval(
      () => this.periodicalCollect(),
      this.collectInterval
    );

    this.timerOfSend = window.setInterval(
      () => this.periodicalSend(),
      this.sendInterval
    );

    super.emit("opened", this.url, this.collectInterval, this.sendInterval);
  }

  public async close() {
    window.clearInterval(this.timerOfCollect);
    window.clearInterval(this.timerOfSend);
    this.events.emit("stop");
    // send before closing
    await this.send();
    super.emit("closed", this.countsOfCollect, this.countsOfSend);
  }

  private async periodicalCollect() {
    if (this.isCollectInProgress) return;
    this.isCollectInProgress = true;
    await this.stats.collect();
    this.events.checkResolution();
    this.countsOfCollect += 1;
    this.isCollectInProgress = false;
  }

  private async periodicalSend() {
    if (this.isSendInProgress) return;
    try {
      this.isSendInProgress = true;
      await this.send();
    } finally {
      this.isSendInProgress = false;
    }
  }

  private async send() {
    const data = this.remaining
      ? this.builder.buildFromRemainig(
          this.remaining,
          this.stats.drain(),
          this.events.drain()
        )
      : this.builder.build(this.stats.drain(), this.events.drain());
    try {
      validate(data);
    } catch (e: any) {
      super.emit(
        "error",
        new SulfurError("validate", "unsupported data format ignore this data")
      );
      this.remaining = null; //validate に失敗した場合はデータを保存しない
      return;
    }
    try {
      await send(data, this.url);
      this.remaining = null;
      this.countsOfSend += 1;
    } catch (e: any) {
      super.emit(
        "error",
        new SulfurError(
          "transaction",
          "Failed to transaction with the aggregation server"
        )
      );
      this.remaining = data;
    }
  }
}

export { Sulfur, SulfurError };