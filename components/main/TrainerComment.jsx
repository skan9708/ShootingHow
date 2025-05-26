import styled from "styled-components";
import { Container, Title } from "../AmongStyle";

const Styled = styled.div`
  padding-bottom: 100px;
  @media (max-width: 450px) {
    padding-bottom: 0px;
  }
`;

export default function TrainerComment() {
  return (
    <Styled>
      <Container>
        <Title className="title">
          <div>20년의 노하우와 책임강사들의</div>
          <div>업그레이드된 교육으로</div>
          <div>여러분의 다이빙과 서핑 실력을</div>
          <div>향상시켜 보세요.</div>
        </Title>
      </Container>
    </Styled>
  );
}
