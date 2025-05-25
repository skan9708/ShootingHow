import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Card, Computer, Container, Image, Mobile, SlideCards, Title } from "../AmongStyle";
import { Justify } from "../Justify";
import { TopLeftRightButton } from "../TopLeftRightButton";
import Slider from "react-slick";

const ImageCard = styled(Card)`
  padding-right: 20px;
  .image {
    width: 100%;
    padding-top: 100%;
    background-size: cover;
    background-position: center center;
    ${(props) => {
      return css`
        background-image: url(${props.image});
      `;
    }}
  }
  .title {
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: -0.03em;
    color: #07287c;
    margin-top: -15px;

    text-overflow: ellipsis;
    overflow: hidden;
    width: calc(100% - 30px);
    white-space: nowrap;
    text-align: left;
  }
  .description {
    font-weight: 400;
    font-size: 18px;
    line-height: 150%;
    letter-spacing: -0.03em;
    color: #383838;
    margin-top: 16px;
    text-align: left;
    width: 90%;
  }
  .view_more {
    margin-top: 15px;
    text-align: left;
    padding-bottom: 10px;
  }
  .view_more > a {
    font-weight: 700;
    font-size: 18px;
    line-height: 23px;
    letter-spacing: -0.03em;
    color: #000000;
    padding-bottom: 8px;
    border-bottom: 1px solid #000000;
  }
  @media (max-width: 450px) {
    padding-right: 0px;
    width: 100%;
    .title {
      font-size: 20px;
      font-weight: bold;
    }
    .description {
      font-size: 14px;
    }
    .view_more {
      font-size: 14px;
      margin-top: 0px;
    }
  }
`;

const StyledSlider = styled(Slider)`
  @media (min-width: 450px) {
    margin-bottom: 100px;
    width: calc(100vw - 20px);
    margin-right: -20px;
    margin-left: calc(50vw - 700px);
  }
  @media (max-width: 450px) {
    margin: 0px 20px;
    padding-bottom: 50px;
  }
`

export default function ImageSlide(props) {
  const slider = useRef()
  const [active, setActive] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get("/api/staticlist?code=image_slide").then((res) => {
      setItems(res.data);
    });
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
      <Container>
        <Justify>
          <Title>
            <div>최신 시설과 쾌적한 환경에서</div>
            <div>해양 액티비티 체험의 신세계를 <br className="mobile"/>경험해 보세요.</div>
          </Title>
          <TopLeftRightButton
            onPrev={()=>slider.current.slickPrev()}
            onNext={()=>slider.current.slickNext()}
          />
        </Justify>
      </Container>
      <Computer>
        <StyledSlider {...settings} ref={slider}>
          {items.map((item) => {
            return (
              <ImageCard key={item}>
                <Image image={item.image} />
                <div className="title">{item.title}</div>
                <div className="description">
                  {(item.description.length >= 50) ? (item.description.slice(0, 50) + "...") : item.description}
                </div>
                <div className="view_more">
                  <a href={item.links?.link0}>View more</a>
                </div>
              </ImageCard>
            );
          })}
        </StyledSlider>
      </Computer>
      <Mobile>
        <StyledSlider dots="false" infinite="true" slidesToShow={1} slidesToScroll={1} arrows="false" ref={slider}>
          {items.map((item) => {
            return (
              <ImageCard key={item}>
                <Image image={item.image} />
                <div className="title">{item.title}</div>
                <div className="description">
                  {(item.description.length >= 50) ? (item.description.slice(0, 50) + "...") : item.description}
                </div>
                <div className="view_more">
                  <a href={item.links?.link0}>View more</a>
                </div>
              </ImageCard>
            );
          })}
        </StyledSlider>
      </Mobile>
    </>
  );
}
