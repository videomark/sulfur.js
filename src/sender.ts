import msgpack from "msgpack-lite";

export async function send(data: SulfurData, url: string): Promise<void> {
  try {
    const packed = msgpack.encode(data);
    const ret = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/msgpack",
      },
      body: packed,
    });
    if (!ret.ok) throw new Error("response was not ok.");
  } catch (e: any) {
    throw new Error();
  }
}
