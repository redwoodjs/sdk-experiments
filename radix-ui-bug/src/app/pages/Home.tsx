import { RequestInfo } from "rwsdk/worker";

export function Home({ ctx }: RequestInfo) {
  if (!import.meta.env.VITE_IS_DEV_SERVER) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>RedwoodSDK Application</h1>
        <p>Welcome to the RedwoodSDK application.</p>
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/radix-demo"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007acc",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            View All Components
          </a>
          <a
            href="/portal-demo"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#dc3545",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            Portal Components (Test Focus)
          </a>
          <a
            href="/useid-demo"
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            useId Test
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Development Server</h2>
        <p
          style={{
            margin: "0.5rem 0 0 0",
            fontSize: "0.875rem",
            color: "#666",
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/radix-demo"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007acc",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          >
            All Components
          </a>
          <a
            href="/portal-demo"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          >
            Portal Focus
          </a>
          <a
            href="/useid-demo"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "0.875rem",
            }}
          >
            useId Test
          </a>
        </p>
      </div>
    </div>
  );
}
