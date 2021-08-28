import { Denops } from "./deps.ts";
import { main as mainNative } from "./feature/native/main.ts";
import { main as mainStatus } from "./feature/status/main.ts";

export async function main(denops: Denops): Promise<void> {
  await mainNative(denops);
  await mainStatus(denops);
}