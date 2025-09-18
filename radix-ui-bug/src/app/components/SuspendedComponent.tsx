import React from 'react';

// Helper to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const SuspendedComponent = async () => {
  await sleep(2000); // Simulate a 2-second data fetch
  return (
    <div style={{ border: '1px solid grey', padding: '1rem', marginTop: '1rem' }}>
      <h2>Suspended Content</h2>
      <p>This content was loaded after a 2-second delay.</p>
    </div>
  );
};
