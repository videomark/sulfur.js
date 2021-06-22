import { MediaConnection } from "skyway-js";
import { filter } from "./filter";

export async function stats(
  mediaConnection: MediaConnection
): Promise<RTCStats[]> {
  if (!mediaConnection || !mediaConnection.getPeerConnection()) return null;
  const rtcStatsReport = await mediaConnection.getPeerConnection().getStats();
  const rtcStatsArray: RTCStats[] = [];
  rtcStatsReport.forEach((stat) => rtcStatsArray.push(stat));
  if (!rtcStatsArray) return null;
  return filter(rtcStatsArray);
}
