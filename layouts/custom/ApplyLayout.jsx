import styled from "styled-components";
import { Center } from "../../components/AmongStyle";
import Footer from "../../components/Footer";
import { SmallMenu, SmallMenuItem } from "../../components/SmallMenu";
import TopImageLayout from "../TopImageLayout";

const Braket = styled.div`
  display: flex;
  >div {
    display: flex;
    align-items: center;
    .number {
      width: 48px;
      height: 48px;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: -0.03em;
      color: #c9c9c9;
      font-weight: 500;
      font-size: 24px;
      line-height: 100%;
      margin-right: 20px;
      background-color: #F0F0F0;
    }
    .text {
      display: flex;
      align-items: center;
      letter-spacing: -0.03em;
      font-weight: 500;
      font-size: 24px;
      line-height: 100%;
      color: #747474;
    }
    .line {
      width: 90px;
      height: 2px;
      margin: 0px 20px;
      background-color: #07287C;
    }
    &.active {
      .number {
        background: #07287C;
        color: #FFFFFF;
      }
      .text {
        color: #07287C;
      }
    }
  }
  @media (max-width: 450px) {
    >div {
      .number {
        width: 25px;
        height: 25px;
        font-size: 13px;
        margin-right: 5px;
      }
      .text {
        font-size: 16px;
      }
      .line {
        width: 20px;
      }
    }
  }
`

export default function CustomerLayout(props) {
  return (
    <TopImageLayout
      image="/next/apply/top.png"
      title="강사신청"
      desc="강사회원 등업을 위한 신청페이지 입니다."
    >
      <Center style={{ marginTop: 80 }}>
        <Braket>
          <div className={1 <= props.step && "active"}>
            <div><div className="number">1</div></div>
            <div className="text">강사회원 신청</div>
          </div>
          <div>
            <div className="line"></div>
          </div>
          <div className={2 <= props.step && "active"}>
            <div><div className="number">2</div></div>
            <div className="text">관리자 승인 진행</div>
          </div>
        </Braket>
      </Center>
      {props.children}
      <Footer />
    </TopImageLayout>
  );
}
