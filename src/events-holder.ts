import { EventEmitter } from "events";

export class EventsHolder extends EventEmitter {
  private readonly video: HTMLVideoElement = null;
  private readonly events: SulfurEvent[];

  private width: number = null;
  private height: number = null;

  constructor(video: HTMLVideoElement) {
    super();
    this.video = video;
    this.events = [];
    this.generateStartEvent();
    this.checkResolution();
  }

  private generateStartEvent(): void {
    this.events.push({
      type: "start",
      timestamp: new Date().getTime(),
    });
  }

  public checkResolution(video?: HTMLVideoElement): void {
    const target = video ? video : this.video;
    if (!target) return;
    const { width, height } = target.getBoundingClientRect();
    if (this.width === width && this.height === height) return;
    this.width = width;
    this.height = height;
    this.events.push({
      type: "resulution",
      timestamp: new Date().getTime(),
      value: `${width},${height}`,
    });
  }

  public drain(): SulfurEvent[] {
    return this.events.splice(0, this.events.length);
  }

  public emit(type: SulfurEventType): boolean {
    this.events.push({
      type,
      timestamp: new Date().getTime(),
    });
    return super.emit(type);
  }
}
