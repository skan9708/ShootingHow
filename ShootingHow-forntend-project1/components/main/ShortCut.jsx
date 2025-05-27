import styled from "styled-components";
import { Container, Title } from "../AmongStyle";

const Styled = styled.div`
  padding-bottom: 100px;
  @media (max-width: 450px) {
    padding-bottom: 0px;
  }
`;

export default function ShortCut() {
  return (
    <Styled>
      <Container>
        <Title className="title">
          <div>테마를 통해 해양 액티비티</div>
          <div>체험 스포츠를 위한</div>
          <div>다양한 서비스를 경험해보세요.</div>
        </Title>
      </Container>
    </Styled>
  );
}
