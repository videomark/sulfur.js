import { MediaConnection } from "skyway-js";
import { stats } from "./stats";

export class StatsHolder {
  private readonly stats: RTCStats[][];
  private readonly connection: MediaConnection;

  constructor(connection: MediaConnection) {
    this.stats = [];
    this.connection = connection;
  }

  public async collect(): Promise<void> {
    try {
      const s = await stats(this.connection);
      if (s) this.stats.push(s);
    } catch (err) {
      throw new Error("transport not found. closed by remote peer");
    }
  }

  public drain(): RTCStats[][] {
    return this.stats.splice(0, this.stats.length);
  }
}
