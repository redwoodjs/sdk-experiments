import { readFile } from "fs/promises";
import { glob } from "glob";
import path from "path";
import type { Plugin } from "vite";

export const findFilesContainingUseClient = async ({
  cwd,
}: {
  cwd: string;
}): Promise<string[]> => {
  const files = await glob("**/*.{ts,tsx,js,jsx,mjs,mts}", {
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
    const trimmedCode = code.trim();
    return (
      trimmedCode.startsWith('"use client"') ||
      trimmedCode.startsWith("'use client'")
    );
  }

  async function tryTransform({
    filePath,
    code,
    env,
    caller,
  }: {
    filePath: string;
    env: string;
    code?: string;
    caller: string;
  }) {
    const contents = code ?? (await readFile(filePath, "utf8"));

    if (!hasUseClient(contents)) {
      return null;
    }

    console.log("################## tryTransform() start", {
      filePath,
      env,
      caller,
    });

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

    let result;

    if (env === "ssr") {
      const logLine = `console.log('######### reached ${filePath} for SSR');`;
      lines.splice(0, 0, logLine);
      result = lines.join("\n");
    } else if (env === "rsc") {
      const relativePath = path.relative(projectRootDir, filePath);
      const normalizedPath = "/" + relativePath;

      result = `\
console.log('######### reached ${normalizedPath} for RSC');\
export function __getID() { return ${JSON.stringify(normalizedPath)}; }
`;
    }

    console.log("################## tryTransform() end", {
      filePath,
      env,
      caller,
      result,
    });

    return result;
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
          build.onLoad({ filter: /.*/ }, async (args) => {
            const result = await tryTransform({
              filePath: args.path,
              env,
              caller: "esbuild",
            });

            if (!result) {
              return;
            }

            return {
              contents: result,
              loader: path.extname(args.path).slice(1) as any,
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
        caller: "vite",
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
