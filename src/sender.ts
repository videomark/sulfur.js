import axios from "axios";
import pako from "pako";
import { SulfurData } from "../types";

export async function send(data: SulfurData, url: string): Promise<void> {
  try {
    const compress = pako.gzip(JSON.stringify(data));
    await axios.post(url, compress, {
      headers: {
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
      },
    });
  } catch (err: any) {
    throw new Error(
      `status: ${err.response.status}, message:${err.response.data}`
    );
  }
}
