import styled from "styled-components";
import { Container, Title } from "../AmongStyle";
import { useRouter } from "next/router";

const Styled = styled.div`
  padding-top: 80px;
  padding-bottom: 100px;
  @media (max-width: 450px) {
    padding-top: 40px;
    padding-bottom: 0px;
  }
`;

const FlexWrap = styled.div`
  display: flex;
  gap: 32px;
  align-items: stretch;
  margin-top: 40px;
  @media (max-width: 700px) {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
`;

const FutsalImg = styled.img`
  width: 100%;
  max-width: 700px;
  border-radius: 12px;
  display: block;
`;

const SectorWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
  min-width: 200px;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
`;

const SectorBtn = styled.button`
  padding: 24px 0;
  font-size: 2.5rem;
  font-weight: 800;
  background: transparent;
  border: none;
  border-radius: 0;
  color: #07287C;
  cursor: pointer;
  transition: color 0.2s;
  box-shadow: none;
  outline: none;
  &:hover {
    color: #0051a8;
    background: transparent;
  }
`;

const SmallText = styled.p`
  font-size: 1.3rem;
  color: #666;
  margin-top: 4px;
  text-align: center;
  white-space: nowrap;
`;

export default function Theme() {
  const router = useRouter();
  return (
    <Styled>
      <Container>
        <Title className="title">
          <div>남녀노소 즐길 수 있는</div>
          <div>필드에서 신나는 하루를 즐겨보세요!</div>
        </Title>
        <FlexWrap>
          <FutsalImg 
            src="/futsal.jpg" 
            alt="풋살장 사진"
          />
          <SectorWrap>
            <div>
              <SectorBtn onClick={() => router.push('/booking?type=indoor')}>실내 풋살장 예약하러 가기</SectorBtn>
              <SmallText>날씨에 상관없이 풋살을 즐기실 수 있도록, 실내 풋살장을 예약해 보세요!</SmallText>
            </div>
            <div>
              <SectorBtn onClick={() => router.push('/booking?type=outdoor')}>야외 풋살장 예약하러 가기</SectorBtn>
              <SmallText>야외에서만 즐길수 있는 매력! 야외 풋살장을 예약해보세요!</SmallText>
            </div>
            <div>
              <SectorBtn onClick={() => router.push('/booking?type=soccer')}>야외 축구장 예약하러 가기</SectorBtn>
              <SmallText>넓은 필드에서의 짜릿함! 야외 축구장을 예약해보세요!</SmallText>
            </div>
          </SectorWrap>
        </FlexWrap>
      </Container>
    </Styled>
  );
}
