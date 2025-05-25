import { Container, Title } from "../AmongStyle";
import { Justify } from "../Justify";
import { Roadmap } from "../Roadmap";

export default function HowToFind(props) {
    return (
        <Container>
            <Justify>
                <Title>
                    <div>테마로 오시는길</div>
                </Title>
                <div></div>
            </Justify>
            <Roadmap />
        </Container>
    )
}