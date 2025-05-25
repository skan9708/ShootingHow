import { Container, Section, Sections } from "../../components/AmongStyle";
import IntroLayout from "../../layouts/custom/IntroLayout";
import img_graph from "./graph.svg"
import img_graph_mobile from "./mobile_member.svg"

export default function IntroMain() {
  return (
    <IntroLayout id="members">
      <Sections>
        <Section>
          <Container style={{padding: "0px 30px", textAlign: "center"}}>
          <img src={img_graph.src} style={{maxWidth: "1000px", width: "100%"}} className="computer"/>
          <img src={img_graph_mobile.src} style={{width: "100%"}} className="mobile"/>
          </Container>
        </Section>
      </Sections>
    </IntroLayout>
  )
}
