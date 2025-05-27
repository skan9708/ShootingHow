import { Container, Section, Sections } from "../../components/AmongStyle";
import { Roadmap } from "../../components/Roadmap";
import IntroLayout from "../../layouts/custom/IntroLayout";

export default function IntroRoadmap(props) {
  return (
    <IntroLayout id="roadmap">
      <Sections>
        <Section>
          <Container>
            <Roadmap />
          </Container>
        </Section>
      </Sections>
    </IntroLayout>
  )
}
