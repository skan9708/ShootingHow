import { Container, Section, Sections } from "../../components/AmongStyle";
import PricingLayout from "../../layouts/custom/PricingLayout";

export default function IntroMain() {
  return (
    <PricingLayout id="pricing">
      <Sections>
        <Section>
          <Container>
            인삿말 관련 내용이 들어갑니다.
          </Container>
        </Section>
      </Sections>
    </PricingLayout>
  )
}
