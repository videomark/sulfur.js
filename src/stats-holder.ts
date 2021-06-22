import { MediaConnection } from "skyway-js";
import { stats } from "./stats";

export class StatsHolder {
  private stats: RTCStats[][];
  private connection: MediaConnection;

  constructor(connection: MediaConnection) {
    this.stats = [];
    this.connection = connection;
  }

  async collect(): Promise<void> {
    const s = await stats(this.connection);
    if (s) this.stats.push(s);
  }

  drain(): RTCStats[][] {
    return this.stats.splice(0, this.stats.length);
  }
}
