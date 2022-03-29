import { batch, bufname, Denops, fn, fs, unknownutil } from "../deps.ts";
import { GIN_BUFFER_PROTOCOLS } from "../global.ts";
import { expand } from "../util/cmd.ts";
import { Opts } from "../util/args.ts";
import { find } from "../git/finder.ts";

async function getWorktree(denops: Denops): Promise<string> {
  const [cwd, bname, dirname] = await batch.gather(denops, async (denops) => {
    await fn.getcwd(denops);
    await fn.bufname(denops, "%");
    await fn.expand(denops, "%:h");
  });
  unknownutil.assertString(cwd);
  unknownutil.assertString(bname);
  unknownutil.assertString(dirname);
  if (bname) {
    try {
      const { scheme, expr } = bufname.parse(bname);
      if (GIN_BUFFER_PROTOCOLS.includes(scheme)) {
        return unknownutil.ensureString(
          await fn.fnamemodify(denops, expr, ":p"),
        );
      }
    } catch {
      // Ignore errors
    }
  }
  if (dirname && await fs.exists(dirname)) {
    return await find(dirname);
  }
  return await find(cwd);
}

export async function getWorktreeFromOpts(
  denops: Denops,
  opts: Opts,
): Promise<string> {
  const worktree = opts["worktree"]
    ? await find(await expand(denops, opts["worktree"]))
    : await getWorktree(denops);
  return worktree;
}
