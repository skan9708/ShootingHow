import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { DoubleGrid } from "./DoubleGrid";
import Script from "next/script";
import { useEffect } from "react";

const Map = styled.div`
  .title {
    font-weight: 500;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: -0.03em;
    color: #000000;
    display: flex;
    justify-content: space-between;
    a {
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
      text-align: right;
      color: #000000;
    }
    margin-bottom: 24px;
    padding-bottom: 18px;
    border-bottom: 1px solid #000000;
    >div {
      display: flex;
    }
  }
  .routes {
    > div {
      margin-bottom: 50px;
      /* Title = [Icon] [Title] */
      > div:first-child {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 18px;
        line-height: 23px;
        letter-spacing: -0.03em;
        color: #000000;
        > i {
          margin-right: 10px;
        }
      }

      /* Description */
      > div.desc {
        font-weight: 400;
        font-size: 16px;
        line-height: 150%;
        letter-spacing: -0.03em;
        color: #383838;
        margin-left: 47px;
      }

      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
`;

const Styled = styled.div`
  .mapframe {
    width: 70%;
    margin-right: min(40px, 5%);
  }
  @media (max-width: 450px) {
    .mapframe {
      width: 100%;
      margin-right: 0px;
      iframe {
        height: 250px;
      }
      margin-bottom: 30px !important;
    }
    .title {
      font-weight: 500;
      font-size: 16px;
    }
    .gogogo {
      display: none;
    }
    img.marker {
      width: 14px;
      height: 18px;
    }
    .routes {
      >div {
        margin-bottom: 20px;
      }
    }
  }
`

export function Roadmap(props) {
  return (
    <Styled>
      <DoubleGrid mobile>
        <div className="mapframe">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12717.349803280025!2d127.05438907364659!3d37.16845072640724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b46e9c7fe1f9b%3A0x4377b8cdb8daa030!2z6rK96riw64-EIOyYpOyCsOyLnCDsiJjssq3rj5k!5e0!3m2!1sko!2skr!4v1661616506547!5m2!1sko!2skr"
            width="100%"
            height="450"
            style={{ "border": 0 }}
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <Map>
          <div className="title">
            <div>
              <img src="/next/images/pivot.svg" style={{ marginRight: 10 }}  className="marker"/>
              <span>경기도 오산시 청학로 286 (수청동)</span>
            </div>
            <a href="https://goo.gl/maps/8zQHT1CebSbMWMbAA" target="_blank" rel="noreferrer" className="gogogo">
              구글 지도에서 보기 <img src="/next/images/right.svg" />
            </a>
          </div>
          <div className="routes">
            <div>
              <div>
                <img src="/next/images/car.svg" style={{ marginRight: 10, width: 35 }} />{" "}
                <div>차량 이용시 약 5분정도 소요</div>
              </div>
              <div className="desc">
                <div>북오산IC - 북삼미로 - 도착</div>
                <div>북오산IC - 경기대로 - 도착 </div>
              </div>
            </div>
            <div>
              <div>
                <img src="/next/images/subway.svg" style={{ marginRight: 10, width: 35 }} />{" "}
                <div>대중교통 이용 시 5~10분 소요</div>
              </div>
              <div className="desc">
                <div>오산대역 - 도보 - 도착</div>
              </div>
            </div>
          </div>
        </Map>
      </DoubleGrid>
    </Styled>
  );
}
