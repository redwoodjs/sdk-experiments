// ==== Start capture-all logs (expanded) ====
(function () {
  const seen = new WeakSet();
  // @ts-ignore
  const serialize = (v) => {
    try {
      if (v instanceof Error)
        return { name: v.name, message: v.message, stack: v.stack };
      if (v instanceof Map) return { __type: "Map", entries: [...v.entries()] };
      if (v instanceof Set) return { __type: "Set", values: [...v.values()] };
      // @ts-ignore
      if (v instanceof Node) return v.outerHTML || v.nodeName;
      if (typeof v === "function") return `[Function ${v.name || "anonymous"}]`;
      if (typeof v === "object" && v !== null) {
        if (seen.has(v)) return "[Circular]";
        seen.add(v);
      }
      return v;
    } catch (e) {
      // @ts-ignore
      return `[SerializationError: ${e?.message || e}]`;
    }
  };

  // @ts-ignore
  const stringify = (x) => {
    // @ts-ignore
    seen.clear?.(); // reset before each call
    return JSON.stringify(x, (k, v) => serialize(v), 2);
  };

  // @ts-ignore
  const toText = (args) =>
    // @ts-ignore
    args.map((a) => (typeof a === "string" ? a : stringify(a))).join(" ");

  const levels = ["log", "info", "warn", "error", "debug", "trace", "table"];
  const orig = {};

  // @ts-ignore
  const store = [];

  levels.forEach((lvl) => {
    // @ts-ignore
    orig[lvl] = console[lvl] ? console[lvl].bind(console) : null;
    // @ts-ignore
    console[lvl] = function (...args) {
      // Keep original behaviour
      // @ts-ignore
      orig[lvl] && orig[lvl](...args);

      // Normalise console.table so it’s still captureable
      let normalised = args;
      if (lvl === "table" && args[0]) {
        try {
          const rows = Array.isArray(args[0])
            ? args[0]
            : // @ts-ignore
              Object.entries(args[0]).map(([k, v]) => ({ key: k, ...v }));
          normalised = [rows];
        } catch {}
      }

      // Save expanded text
      store.push({
        time: new Date().toISOString(),
        level: lvl,
        text: toText(normalised),
      });
    };
  });

  // Expose helpers:
  // @ts-ignore
  window.__logCapture__ = {
    // @ts-ignore
    dumpJson: () => JSON.stringify(store, null, 2),
    // @ts-ignore
    copyAll: () => copy(JSON.stringify(store, null, 2)),
    // @ts-ignore
    copyText: () =>
      // @ts-ignore
      copy(
        // @ts-ignore
        store
          .map((e) => `[${e.time}] ${e.level.toUpperCase()} ${e.text}`)
          .join("\n")
      ),
    download: (filename = "console-log.json") => {
      // @ts-ignore
      const blob = new Blob([JSON.stringify(store, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    clear: () => {
      store.length = 0;
    },
    restore: () => {
      // put console back
      Object.entries(orig).forEach(([k, v]) => {
        // @ts-ignore
        if (v) console[k] = v;
      });
    },
  };

  console.info(
    "[log-capture] started. Use __logCapture__.copyAll() / copyText() / download() / clear() / restore()"
  );
})();
