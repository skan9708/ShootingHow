import Link from "next/link";
import { Container, Icon } from "semantic-ui-react";
import styled from "styled-components";
import img_insta from "./insta.svg";
import img_kakao from "./kakao.svg";

const Styled = styled.div`
  margin-top: 100px;
  background: #f0f0f0;
  padding: 36px 0px 48px 0px;
  .center {
    max-width: 1400px;
    margin: auto;
    display: flex;
    .logo {
      margin-right: 200px;
    }
    .justify {
      display: flex;
      > div:first-child {
        margin-right: auto;
      }
      font-weight: 400;
      font-size: 12px;
      line-height: 170%;
      color: #000000;
      a {
        color: #000000;
      }
    }
  }

  .icons {
    display: flex;
    align-items: center;
    >* {
      margin-left: 20px;
      &:first-child {
        margin-left: 0px;
      }
    }
  }

  position: absolute;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid #dee5e7;

  @media (max-width: 450px) {
    position: static;
    margin-top: 60px;
    padding: 40px 20px;
    .center {
      display: block;
    }
    .logo {
      margin: 0px;
      margin-bottom: 20px;
      display: flex;
      align-content: space-between;
      margin-right: 0px !important;
      img {
        margin-right: auto;
      }
    }
    .justify {
      flex-direction: column;
    }
    .links {
      a {
        font-weight: bold;
      }
      margin-bottom: 10px;
    }
  }
`;

export default function Footer(props) {
  return (
    <Styled>
      <div className="center">
        <div className="logo">
          <img src="/next/logo.png"/>
          <div className="mobile">
            <div className="icons">
              <a href="http://pf.kakao.com/_xeCAxhxj" target="_blank" rel="noreferrer"><img src={img_kakao.src}/></a>
              <a href="https://www.instagram.com/0516roy0223" target="_blank" rel="noreferrer"><img src={img_insta.src}/></a>
            </div>
          </div>
        </div>
        <div style={{width: "100%"}}>
          <div className="justify">
            <div>
              <div className="links">
                <Link href="/terms/privacy_policy">개인정보처리방침</Link>
                　|　
                <Link href="/terms/terms_of_service">이용약관</Link>
                　|　
                <Link href="/terms/instructor">강사회원 이용약관</Link>
                {/* 　|　
                <Link href="/terms/privacy_policy">이메일주소 무단수집거부</Link> */}
              </div>
              <div>
                상호명 : (주)테마　
                사업자번호 : 353-86-02003　
                대표자명 : 이필근　
                통신판매신고번호 : 제 2022-서울강동-2309호　
              </div>
            </div>
            <div>
              <div className="icons, computer">
                <a href="http://pf.kakao.com/_xeCAxhxj" target="_blank" rel="noreferrer"><img src={img_kakao.src}/></a>
                <a href="https://www.instagram.com/0516roy0223" target="_blank" rel="noreferrer"><img src={img_insta.src}/></a>
              </div>
            </div>
          </div>
          <br className="computer"/>
          <div className="justify">
            <div>
              <div>
                Tel : 1660-0667
                　
                주소 : 경기도 오산시 청학로 286 (수청동)
              </div>
            </div>
            <div>
              <div>Copyright © Theme.com All rights reserved.</div>
            </div>
          </div>
        </div>
      </div>
    </Styled>
  );
}
