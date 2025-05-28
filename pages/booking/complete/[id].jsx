import { useRouter } from "next/router";
import { Grid, Icon } from "semantic-ui-react";
import styled, { css } from "styled-components";
import {
  Button,
  Center,
  Container,
  ImageContent,
  Section,
  Sections,
  WarningBox,
} from "../../../components/AmongStyle";
import { GridCards } from "../../../components/Cards";
import Footer from "../../../components/Footer";
import Menu from "../../../components/Menu";
import { Table } from "../../../components/Table";

const TextTitle = styled(Center)`
  flex-direction: column;
  .title {
    font-weight: 700;
    font-size: 32px;
    line-height: 100%;
    letter-spacing: -0.03em;
    color: #07287c;
    margin-bottom: 58px;
  }
  @media (max-width: 450px) {
    .title {
        margin-right: auto;
        font-size: 22px;
        margin-bottom: 35px;
    }
  }
`;

const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: -0.03em;
  color: #07287c;
  margin-top: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid #07297c;
  ${(props) => {
    if (props.center) {
      return css`
        text-align: center;
      `;
    }
  }}
`;

const CustomTable = styled(Table)`
  tbody > tr > td:first-child {
    width: 150px;
  }
`;

export default function BookingOrder(props) {
  const router = useRouter();
  return (
    <div>
      <Menu flatten block />
      <Sections>
        <Section>
          <Container>
            {/* TITLE */}
            <TextTitle>
              <div className="title">슈팅어때 필드예약</div>
            </TextTitle>

            {/* 예약시 유의사항 */}
            <>
              <WarningBox style={{ textAlign: "center" }}>
                <br />
                <div className="title">
                  <Icon name="check circle" size="big" />
                  <br />
                  <br />
                  예약이 완료 되었습니다.
                </div>
                <div className="desc">
                  슈팅어때에서 재미있는 스포츠와 즐거운 추억을 쌓길 바랍니다.
                </div>
                <br />
              </WarningBox>
            </>

            {/* Confirm */}
            <>
              <SectionTitle style={{ marginTop: 50 }}>
                예약신청 내용
              </SectionTitle>
              <CustomTable>
                <tbody>
                  <tr>
                    <td>예약번호</td>
                    <td>TEST-12345</td>
                  </tr>
                  <tr>
                    <td>예약상태</td>
                    <td>예약완료</td>
                  </tr>
                  <tr>
                    <td>예약자</td>
                    <td>최진혁</td>
                  </tr>
                  <tr>
                    <td>이용날짜</td>
                    <td>2025년 05월 30일</td>
                  </tr>
                  <tr>
                    <td>이용종류</td>
                    <td>PK풋살장</td>
                  </tr>
                  <tr>
                    <td>이용시간</td>
                    <td>12:00 ~ 15:00</td>
                  </tr>
                  <tr>
                    <td>이용인원</td>
                    <td>남성 6인, 여성 0인</td>
                  </tr>
                  <tr>
                    <td>예약신청일</td>
                    <td>2025년 05월 28일 09시 50분</td>
                  </tr>
                  <tr>
                    <td>결제방식</td>
                    <td>카드결제</td>
                  </tr>
                </tbody>
              </CustomTable>
            </>

            <Center style={{ marginTop: 50 }}>
              <Button>예약목록</Button>
            </Center>
          </Container>
        </Section>
      </Sections>
      <Footer />
    </div>
  );
}
