import styled from "styled-components";
import { Container, Title } from "../AmongStyle";

const Styled = styled.div`
  padding-bottom: 100px;
  @media (max-width: 450px) {
    padding-bottom: 0px;
  }
`;

export default function HowToFind() {
  return (
    <Styled>
      <Container>
        <Title className="title">
          <div>테마로 오시는 길</div>
        </Title>
        <div style={{ marginTop: "40px" }}>
          <div style={{ fontSize: "18px", fontWeight: "500", marginBottom: "20px" }}>
            경기도 오산시 청학로 286 (수청동)
          </div>
          <div style={{ marginBottom: "40px" }}>
            <a
              href="https://www.google.com/maps/place/경기도+오산시+청학로+286"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#07287C",
                textDecoration: "underline",
                fontSize: "16px",
              }}
            >
              구글 지도에서 보기
            </a>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "18px", fontWeight: "500", marginBottom: "10px" }}>
              차량 이용시 약 5분정도 소요
            </div>
            <div style={{ fontSize: "16px", color: "#666", marginBottom: "5px" }}>
              북오산IC - 북삼미로 - 도착
            </div>
            <div style={{ fontSize: "16px", color: "#666" }}>
              북오산IC - 경기대로 - 도착
            </div>
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "500", marginBottom: "10px" }}>
              대중교통 이용 시 5~10분 소요
            </div>
            <div style={{ fontSize: "16px", color: "#666" }}>
              오산대역 - 도보 - 도착
            </div>
          </div>
        </div>
      </Container>
    </Styled>
  );
}
