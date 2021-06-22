import { EventEmitter } from "events";

export class EventsHolder extends EventEmitter {
  private width: number = null;
  private height: number = null;
  private video: HTMLVideoElement = null;
  private events: SulfurEvent[];

  constructor(video: HTMLVideoElement) {
    super();
    this.video = video;
    this.events = [];
    this.generateStartEvent();
    this.checkResolution();
  }

  generateStartEvent(): void {
    this.events.push({
      type: "start",
      timestamp: new Date().getTime(),
    });
  }

  checkResolution(video?: HTMLVideoElement): void {
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

  drain(): SulfurEvent[] {
    return this.events.splice(0, this.events.length);
  }

  emit(type: SulfurEventType): boolean {
    this.events.push({
      type,
      timestamp: new Date().getTime(),
    });
    return super.emit(type);
  }
}
