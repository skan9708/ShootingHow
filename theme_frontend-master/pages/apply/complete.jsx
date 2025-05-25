import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Checkbox } from "semantic-ui-react";
import styled from "styled-components";
import {
  Button,
  Center,
  Container,
  Section,
  Sections,
  WarningBox,
} from "../../components/AmongStyle";
import { ShadowBox } from "../../components/ShadowBox";
import { TextTable } from "../../components/Table";
import ApplyLayout from "../../layouts/custom/ApplyLayout";

const Title = styled.div`
  font-weight: 500;
  font-size: 24px;
  letter-spacing: -0.03em;
  color: #07287c;
  margin-top: 30px;
`;

const Description = styled.div`
  margin-top: 20px;
  font-weight: 400;
  font-size: 18px;
  line-height: 26px;
  text-align: center;
  letter-spacing: -0.03em;
  color: #000000;
`;

export default function ApplyForm(props) {
  const router = useRouter();
  const [user, setUser] = useState({ loading: true })

  useEffect(() => {
    axios.get("/api/account/").then((res) => setUser(res.data)).catch((e) => {
      toast.error(e.response.data.error)
      router.push("/")
      return
    })
  }, [])


  if (user.loading) return

  let status = user?.role?.id === "waiting_instructor_request" ? "REQUESTED" : "SUCCESS"

  return (
    <ApplyLayout step="2">
      <Sections>
        <Section>
          <Container>
            <Center>
              {status === "REQUESTED" && (
                <>
                  <WarningBox
                    style={{
                      textAlign: "center",
                      width: "100%",
                      maxWidth: "900px",
                    }}
                  >
                    <img
                      src="/next/apply/swimming.svg"
                      style={{ maxWidth: "300px", width: "100%" }}
                    />
                    <Title>강사신청 완료</Title>
                    <Description>
                      입력해주신 정보를 관리자가 검토중입니다.
                      <br />
                      승인 진행까지 약 2일 소요됩니다.
                    </Description>
                  </WarningBox>
                </>
              )}
              {status === "SUCCESS" && user?.role?.id === "instructor" && (
                <div style={{ width: "100%", maxWidth: "900px" }}>
                  <WarningBox style={{ textAlign: "center" }}>
                    <img
                      src="/next/apply/success.svg"
                      style={{ maxWidth: "300px", width: "100%" }}
                    />
                    <Title>강사신청이 승인되었습니다.</Title>
                    <Description>
                      강사신청이 승인되었습니다.
                      <br />
                      등록강사를 신청하여 더 많은 혜택을 받아보세요!
                    </Description>
                  </WarningBox>
                  <br />
                  <br />
                  <div>연회비 납부시 인원수 할인 혜택을 제공해드립니다.</div>
                  <br />
                  <TextTable>
                    <tbody>
                      <tr>
                        <td className="left header">연회비 가격</td>
                        <td>분기 등록 : 80,000원 1년 등록 : 240,000원</td>
                      </tr>
                      <tr>
                        <td className="left header">혜택</td>
                        <td>결제 시 (전체인원수-1)로 결제</td>
                      </tr>
                    </tbody>
                  </TextTable>
                  <br />
                  <br />
                  <Center>
                    <Button onClick={() => router.push("/apply/payment")}>등록강사 신청 바로가기</Button>
                  </Center>
                </div>
              )}
              {status === "SUCCESS" && user?.role?.id === "registered_instructor" && (
                <div style={{ width: "100%", maxWidth: "900px" }}>
                  <WarningBox style={{ textAlign: "center" }}>
                    <img
                      src="/next/apply/success.svg"
                      style={{ maxWidth: "300px", width: "100%" }}
                    />
                    <Title>등록강사로 승인되었습니다.</Title>
                    <Description>
                      *만료일: 2022.12.30 까지
                    </Description>
                  </WarningBox>
                  <br />
                  <br />
                  <div>연회비 납부시 인원수 할인 혜택을 제공해드립니다.</div>
                  <br />
                  <TextTable>
                    <tbody>
                      <tr>
                        <td className="left header">연회비 가격</td>
                        <td>분기 등록 (90일) :  80,000원    1년 등록 : 240,000원</td>
                      </tr>
                      <tr>
                        <td className="left header">혜택</td>
                        <td>결제 시 (전체인원수-1)로 결제</td>
                      </tr>
                    </tbody>
                  </TextTable>
                  <br />
                  <br />
                  <Center>
                    <Button onClick={() => router.push("/apply/payment")}>등록강사 신청 연장하기</Button>
                  </Center>
                </div>
              )}

              {/* 등록강사 */}
              {status === "SUCCESS" && user?.role?.id === "x" && (
                <div style={{ width: "100%", maxWidth: "900px" }}>
                  <WarningBox style={{ textAlign: "center" }}>
                    <img
                      src="/next/apply/success.svg"
                      style={{ maxWidth: "300px", width: "100%" }}
                    />
                    <Title>등록강사로 승인되었습니다.</Title>
                    <Description>
                      *만료일: 2022.12.30 까지
                    </Description>
                  </WarningBox>
                  <br />
                  <br />
                  <div>연회비 납부시 인원수 할인 혜택을 제공해드립니다.</div>
                  <br />
                  <TextTable>
                    <tbody>
                      <tr>
                        <td className="left header">연회비 가격</td>
                        <td>분기 등록 (90일) :  80,000원    1년 등록 : 240,000원</td>
                      </tr>
                      <tr>
                        <td className="left header">혜택</td>
                        <td>결제 시 (전체인원수-1)로 결제</td>
                      </tr>
                    </tbody>
                  </TextTable>
                  <br />
                  <br />
                  <Center>
                    <Button>등록강사 신청 연장하기</Button>
                  </Center>
                </div>
              )}
            </Center>
          </Container>
        </Section>
      </Sections>
    </ApplyLayout>
  );
}
