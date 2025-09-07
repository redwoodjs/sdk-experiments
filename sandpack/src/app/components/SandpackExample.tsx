"use client";
import { Sandpack } from "@codesandbox/sandpack-react";

export function SandpackExample() {
  const files = {
    "/App.js": `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('World');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hello {name}!</h1>
      <p>You clicked {count} times</p>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{ 
            padding: '8px', 
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Click me
      </button>
      
      <button
        onClick={() => setCount(0)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        Reset
      </button>
    </div>
  );
}`,
    "/index.js": `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);`,
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <h2 style={{ marginBottom: "20px" }}>Interactive React Example</h2>
      <Sandpack
        template="react"
        files={files}
        options={{
          showNavigator: true,
          showTabs: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: 400,
        }}
        theme="light"
      />
    </div>
  );
}
