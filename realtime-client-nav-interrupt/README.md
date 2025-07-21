# minimal-rwsdk-rsc
Minimal RedwoodSDK starter for testing [realtime sync](https://docs.rwsdk.com/core/realtime/) and [client-side navigation](https://docs.rwsdk.com/guides/frontend/client-side-nav/) (SPA mode.) Toggles between SPA and normal navigation.

https://minimal-rwsdk-rsc.jldec.workers.dev/

<img width="740" alt="Screenshot 2025-06-30 at 13 00 02" src="https://github.com/user-attachments/assets/12f58811-820b-4ab5-b9ee-da8feb32f940" />


### package.json scripts
```json
{
  "dev": "vite dev",
  "build": "vite build",
  "preview": "vite build && vite preview",
  "ship": "vite build && wrangler deploy",
  "types": "wrangler types --include-runtime false --strict-vars false",
  "tail": "wrangler tail"
}
```
Includes tailwindcss, minimal pnpm scripts (no DB), no lockfile (see `.npmrc`), no runtime types in worker-configuration.d.ts (too noisy).

### Further Reading
- [RedwoodSDK Docs](https://docs.rwsdk.com/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
