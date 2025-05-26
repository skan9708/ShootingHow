import { Container, Section, Sections } from "../../components/AmongStyle";
import IntroLayout from "../../layouts/custom/IntroLayout";
import img_intro from "./intro.png";
import img_mobile from "./hello_mobile.png"

export default function IntroMain() {
  return (
    <IntroLayout id="intro">
      <Sections>
        <Section>
          <Container>
            <img src={img_intro.src} style={{width: "100%"}} className="computer"/>
            <img src={img_mobile.src} style={{width: "100%"}} className="mobile"/>
          </Container>
        </Section>
      </Sections>
    </IntroLayout>
  )
}
