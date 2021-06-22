import { findOne, findMany } from "./find";

export const filter = (stats: RTCStats[]): RTCStats[] => {
  let transport: RTCTransportStats = findOne(
    stats,
    "transport",
    "dtlsState",
    "connected"
  );
  if (transport === null) {
    transport = findOne(stats, "transport", "dtlsState", "connecting");
  }
  const candidatePair: RTCIceCandidatePairStats = findOne(
    stats,
    "candidate-pair" as RTCStatsType,
    "id",
    transport.selectedCandidatePairId
  );
  const localCandidate: any = findOne(
    stats,
    "local-candidate" as RTCStatsType,
    "id",
    candidatePair.localCandidateId
  );
  const remoteCandidate: any = findOne(
    stats,
    "remote-candidate" as RTCStatsType,
    "id",
    candidatePair.remoteCandidateId
  );
  const inboundRtp: any[] = findMany(
    stats,
    "inbound-rtp" as RTCStatsType,
    "transportId",
    transport.id
  );
  const tracks: any[] = [];
  const codecs: any[] = [];
  for (const i of inboundRtp) {
    const t = findOne(stats, "track", "id", i.trackId);
    if (t !== null) {
      tracks.push(t);
    }
    const c = findOne(stats, "codec" as RTCStatsType, "id", i.codecId);
    if (c !== null) {
      codecs.push(c);
    }
  }

  return [
    transport,
    candidatePair,
    localCandidate,
    remoteCandidate,
    ...inboundRtp,
    ...tracks,
    ...codecs,
  ];
};
