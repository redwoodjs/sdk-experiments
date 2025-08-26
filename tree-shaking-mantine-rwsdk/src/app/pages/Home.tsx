import { MantineProvider, Button } from '@mantine/core';

export function Home() {
  const handleClick = () => {
    alert('Mantine Button clicked!');
  };

  return (
    <MantineProvider>
      <div style={{ padding: '2rem' }}>
        <h1>Tree Shaking Test - Mantine + RedwoodSDK</h1>
        <p>
          This project imports only the Button component from @mantine/core.
          Other Mantine components should be tree-shaken out of the bundle.
        </p>
        
        <Button onClick={handleClick} variant="filled">
          Mantine Button
        </Button>
      </div>
    </MantineProvider>
  );
}
