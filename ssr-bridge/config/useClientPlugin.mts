import { readFile } from "fs/promises";
import { glob } from "glob";
import path from "path";
import MagicString from "magic-string";
import type { Plugin } from "vite";

export const findFilesContainingUseClient = async ({
  cwd,
}: {
  cwd: string;
}): Promise<string[]> => {
  const files = await glob("**/*.{ts,tsx}", {
    cwd,
    absolute: true,
  });

  const clientFiles: string[] = [];

  for (const file of files) {
    try {
      const content = await readFile(file, "utf-8");
      const lines = content.split("\n");

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.length > 0) {
          if (
            trimmedLine.startsWith('"use client"') ||
            trimmedLine.startsWith("'use client'")
          ) {
            const relativePath = "/" + path.relative(cwd, file);
            clientFiles.push(relativePath);
          }
          break;
        }
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  }

  return clientFiles;
};

export default async function useClientPlugin({
  projectRootDir,
}: {
  projectRootDir: string;
}): Promise<Plugin> {
  const useClientFiles = new Set<string>(
    await findFilesContainingUseClient({ cwd: projectRootDir })
  );

  function hasUseClient(code: string): boolean {
    return code.includes('"use client"') || code.includes("'use client'");
  }

  async function tryTransform({
    filePath,
    code,
    env,
  }: {
    filePath: string;
    env: string;
    code?: string;
  }) {
    const contents = code ?? (await readFile(filePath, "utf8"));
    if (!hasUseClient(contents)) return null;

    useClientFiles.add(filePath);

    const lines = contents.split("\n");
    let i = 0;
    while (i < lines.length && lines[i].trim().length === 0) i++;

    if (
      lines[i]?.trim() === '"use client"' ||
      lines[i]?.trim() === "'use client'"
    ) {
      lines.splice(i, 1);
    }

    if (env === "ssr" && lines[i]?.trim().startsWith("throw ")) {
      lines.splice(i, 1);
    }

    const logLine =
      env === "rsc"
        ? `console.log('######### reached ${filePath} for RSC');`
        : `console.log('######### reached ${filePath} for SSR');`;

    lines.splice(0, 0, logLine);

    const finalCode = lines.join("\n");

    return {
      code: finalCode,
      map: null,
    };
  }

  return {
    name: "use-client-plugin",

    configEnvironment(env, config) {
      config.optimizeDeps ??= {};
      config.optimizeDeps.esbuildOptions ??= {};
      config.optimizeDeps.esbuildOptions.plugins ??= [];

      config.optimizeDeps.esbuildOptions.plugins.push({
        name: "use-client-esbuild-transform",
        setup(build) {
          build.onLoad({ filter: /\.([cm]?[jt]sx?)$/ }, async (args) => {
            const result = await tryTransform({
              filePath: args.path,
              env,
            });

            if (!result) {
              return;
            }

            return {
              contents: result.code,
              loader: path.extname(args.path).slice(1) as any,
              sourcemap: result.map ?? null,
            };
          });
        },
      });
    },

    async transform(code, id) {
      const result = await tryTransform({
        filePath: id,
        code,
        env: this.environment.name,
      });

      if (!result) {
        return;
      }

      return result;
    },

    resolveId(id) {
      if (id === "virtual:use-client-lookup") {
        return id;
      }
    },

    load(id) {
      if (id === "virtual:use-client-lookup") {
        const entries = Array.from(useClientFiles).map((filepath: string) => {
          const normalized = filepath.startsWith("/")
            ? filepath
            : "/" + filepath.replace(/\\/g, "/");
          return `  "${normalized}": () => import("${normalized}")`;
        });
        return `export const useClientLookup = {
${entries.join(",\n")}
};`;
      }
    },
  };
}
