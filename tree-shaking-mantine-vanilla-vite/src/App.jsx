import { MantineProvider, Button, Container, Title, Text } from '@mantine/core'

function App() {
  const handleClick = () => {
    alert('Mantine Button clicked!')
  }

  return (
    <MantineProvider>
      <Container py="xl">
        <Title order={1} mb="md">Tree Shaking Test - Mantine + Vanilla Vite</Title>
        <Text mb="lg" c="dimmed">
          This project imports only the Button component from @mantine/core.
          Other Mantine components should be tree-shaken out of the bundle.
        </Text>
        
        <Button onClick={handleClick} variant="filled">
          Mantine Button
        </Button>
      </Container>
    </MantineProvider>
  )
}

export default App
