if (window.location.pathname.startsWith("/protected")) {
  import("rwsdk/realtime/client").then(({ initRealtimeClient }) => {
    initRealtimeClient({
      key: window.location.pathname,
    });
  });
} else {
  import("rwsdk/client").then(({ initClient }) => {
    initClient();
  });
}
