function findOne<T extends RTCStats>(
  stats: RTCStats[],
  type: RTCStatsType,
  key: string,
  value: any
): T {
  const [v] = findMany<T>(stats, type, key, value);
  return v;
}

function findMany<T extends RTCStats>(
  stats: RTCStats[],
  type: RTCStatsType,
  key: string,
  value: any
) {
  const v = stats.filter((e: { [k: string]: any }) => {
    return e.type === type && key in e && e[key] === value;
  });
  return v as T[];
}

export { findOne, findMany };
