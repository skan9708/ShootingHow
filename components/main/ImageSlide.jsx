import styled from "styled-components";
import { Container, Title } from "../AmongStyle";

const Styled = styled.div`
  padding-bottom: 100px;
  @media (max-width: 450px) {
    padding-bottom: 0px;
  }
`;

export default function ImageSlide() {
  return (
    <Styled>
      <Container>
        <Title className="title">
          <div>최신 시설과 쾌적한 환경에서</div>
          <div>해양 액티비티 체험의 신세계를</div>
          <div>경험해 보세요.</div>
        </Title>
      </Container>
    </Styled>
  );
}
