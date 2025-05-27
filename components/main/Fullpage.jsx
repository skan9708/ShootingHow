import { useRouter } from "next/router";
import { Container, Icon } from "semantic-ui-react";
import styled from "styled-components";
import img_right from "./right.svg"

const Styled = styled.div`
  background-image: url("/next/main/background.png");
  height: 100vh;
  background-position: center center;
  background-size: cover;
  .center {
    height: 100%;
    max-width: 1400px;
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    font-family: 'Spoqa Han Sans Neo';
    font-style: normal;
    color: #FFFFFF;
    .title {
        font-weight: 700;
        font-size: 70px;
        line-height: 130%;
        letter-spacing: -0.01em;
    }
    .subtitle {
        margin-top: 40px;
        font-weight: 500;
        font-size: 24px;
        line-height: 36px;
    }
    .buttons {
        margin-top: 60px;
        >button {
            cursor: pointer;
            padding: 30px 68px;
            padding-right: 50px;
            font-weight: 500;
            font-size: 18px;
            line-height: 23px;
            color: #FFFFFF;
            background: #07287C;
            border: 0px solid;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
            @media (max-width: 450px) {
              padding: 15px 30px;
              font-size: 15px;
            }
        }
    }
  }
  
  .mobile {
    display: none;
  }
  
  @media (max-width: 450px) {
    height: 100vh;
    .mobile {
      display: inline-block;
    }
    .center {
      padding: 0px 20px;
    }
    .title {
      font-weight: 700;
      font-size: 40px !important;
      line-height: 130%;
    }
    .subtitle {
      margin-top: 12px !important;
      font-weight: 500;
      font-size: 18px !important;
      line-height: 30px !important;
    }
  }
`;

export default function Fullpage(props) {
  const router = useRouter()
  return (
    <Styled>
      <div className="center">
        <div id="main-title"> <br className="mobile"/></div>
        <div className="title">
            <div>축구인의 꿈이 <br className="mobile"/>실행되는 곳</div>
            <div>슈팅어때입니다.</div>
        </div>
        <div className="subtitle">
            <div>슈팅어때는 아이부터 어른들까지 즐길 수 있는</div>
            <div>필드 예약서비스 입니다.</div>
        </div>
        <div className="buttons">
            <button onClick={() => router.push("/booking")}>예약하러 가기<img src={img_right.src} style={{marginLeft: 12, height: 13}}/></button>
        </div>
      </div>
    </Styled>
  );
}
