import { useRouter } from "next/router";
import styled from "styled-components";
import {
  Container,
  Label,
  Section,
  Sections,
  WarningBox,
} from "../../../components/AmongStyle";
import { TextTable } from "../../../components/Table";
import MypageLayout from "../../../layouts/custom/MypageLayout";

const Styled = styled(Container)`
  max-width: 900px;
  margin-top: 42px;
  letter-spacing: -0.03em;
  .title {
    margin-top: 50px;
    font-weight: 500;
    font-size: 18px;
    line-height: 23px;
    letter-spacing: -0.03em;
    margin-bottom: 12px;
  }

  .dashboardWrapper {
    display: flex;
    align-items: center;
    .dashboard {
      margin-left: 18px;
      margin-right: auto;
      font-weight: 400;
      font-size: 16px;
      line-height: 26px;
      color: #07287c;
    }
  }
  .point b {
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    color: #07287c;
  }
  .buttons {
    display: flex;
    >div {
      margin-right: 5px;
      &:last-child {
        margin-right: 0px;
      }
    }
    button {
      background: #07287c;
      color: #fff;
      border: 0px solid;
      border-radius: 5px;
      padding: 10px;
    }
  }
`;

export default function MypageBooked(props) {
  const router = useRouter();
  return (
    <MypageLayout id="point">
      <Styled>
        <WarningBox style={{ backgroundColor: "#E5EDFF" }}>
          <div className="dashboardWrapper">
            <img src="/next/point.svg" className="logo" />
            <div className="dashboard">
              <div className="label">현재 나의 포인트</div>
              <div className="point">
                <b>500,000</b> P
              </div>
            </div>
            <div className="buttons">
              <div>
                <button>충전하기</button>
              </div>
              <div>
                <button>선물하기</button>
              </div>
            </div>
          </div>
        </WarningBox>
        <div className="title">포인트 사용내역</div>
        <TextTable>
          <thead>
            <tr>
              <th style={{width: 80}}>번호</th>
              <th>포인트 내용</th>
              <th style={{width: 100}}>상태</th>
              <th style={{width: 100}}>날짜</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7].map((item, key) => {
              const id = key;
              return (
                <tr key={key} style={{ textAlign: "center" }}>
                  <td>{key}</td>
                  <td style={{ textAlign: "left" }}>500,000 P 선물</td>
                  <td style={{ textAlign: "right" }}>
                    {key % 2 == 0 ? (
                      <>
                        <Label>사용</Label>
                      </>
                    ) : (
                      <>
                        <Label background>
                          충전
                        </Label>
                      </>
                    )}
                  </td>
                  <td>2022.12.16</td>
                </tr>
              );
            })}
          </tbody>
        </TextTable>
      </Styled>
    </MypageLayout>
  );
}
