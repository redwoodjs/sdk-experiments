import { initRealtimeClient } from "rwsdk/realtime/client";
import { initClientNavigation } from "rwsdk/client";

initRealtimeClient({
  key: window.location.pathname,
});

initClientNavigation();
