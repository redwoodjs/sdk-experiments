import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
} from "@react-email/components";
import { RenderEmail } from "./RenderEmail";

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <RenderEmail>
      <Html>
        <Head />
        <Preview>Hello</Preview>
        <Body>
          <Container>
            <Heading>Hello</Heading>
          </Container>
        </Body>
      </Html>
    </RenderEmail>
  );
}
