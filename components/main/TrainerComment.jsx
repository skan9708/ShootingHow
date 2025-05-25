import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Icon } from "semantic-ui-react";
import styled, { css } from "styled-components";
import Slider from "react-slick";
import {
  Card,
  Computer,
  Container,
  Mobile,
  SlideCards,
  Title,
} from "../AmongStyle";
import { Justify } from "../Justify";
import { TopLeftRightButton } from "../TopLeftRightButton";

const Section = styled.div`
  background: #dde6f4;
  padding: 5px 0px;
  padding-bottom: 180px;
  @media (max-width: 450px) {
    padding-bottom: 45px;
  }
`;

// const QuoteCards = styled(SlideCards)`
//   margin-left: -40px;
//   width: calc(100vw + 80px);
//   >div {
//     height: 20vw;
//     width: 33%;
//   }
//   @media (max-width: 450px) {
//     margin: 0px;
//     width: 100%;
//     padding: 0px 20px;
//     >div {
//       width: 100%;
//       height: auto;
//       padding: 30px;
//     }
//   }
// `

const QuoteCard = styled(Card)`
  .icon {
    font-size: 12px;
    height: 10px;
    color: #07287C;
  }
  .title {
    font-weight: bold;
    font-size: 24px;
    line-height: 100%;
    text-align: center;
    letter-spacing: -0.03em;
    color: #000000;
  }
  .body {
    font-weight: 400;
    font-size: 18px;
    line-height: 150%;
    text-align: center;
    letter-spacing: -0.03em;
    color: #383838;
    opacity: 0.8;
    margin-top: 12px;
    margin-bottom: 20px;
  }
  .profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    .name {
      font-weight: 500;
      font-size: 18px;
      line-height: 23px;
      text-align: center;
      letter-spacing: -0.03em;
      color: #000000;
      margin-top: 10px;
      >b {
        margin-right: 3px;
      }
    }
  }
  padding: 60px 0px;

  @media (max-width: 450px) {
    .title {
      font-size: 18px !important;
    }
    .body {
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
    }
    .profile_image {
      width: 50px;
      height: 50px;
    }
    .name {
      font-size: 14px !important;
    }
  }
`

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  background-size: cover;
  background-position: center center;
  border-radius: 80px;
  ${props => {
    return css`
      background-image: url(${props.image});
    `
  }}
`

const StyledSlider = styled(Slider)`
  .slick-track {
    >div {
      padding-right: 20px;
    }
  }
  margin-right: -20px;
  @media (max-width: 450px) {
    padding: 0px 20px;
  }
`


export default function TrainerComment(props) {
  const [items, setItems] = useState([]);
  const [active, setAcitve] = useState(0);
  const slider = useRef();

  useEffect(() => {
    axios.get("/api/staticlist?code=trainer_comment").then((res) => {
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
      <Section>
        <Container>
          <Justify>
            <Title>
              <div>20년의 노하우와 책임강사들의 <br className="mobile" />업그레이드된 교육으로</div>
              <div>여러분의 다이빙과 서핑 실력을 <br className="mobile" />향상시켜 보세요.</div>
            </Title>
            <TopLeftRightButton
              onPrev={() => slider.current.slickPrev()}
              onNext={() => slider.current.slickNext()}
            />
          </Justify>
        </Container>
        <Computer>
          <StyledSlider {...settings} ref={slider}>
            {items.map((item) => {
              let desc = (item.description.length >= 50) ? (item.description.slice(0, 50) + "...") : item.description
              return (
                <div key={item}>
                  <div>
                    <QuoteCard>
                      <div className="icon">
                        <Icon name="quote left" />
                      </div>
                      <div className="title">{item.title}</div>
                      <div className="body">
                        {desc.split("\n").slice(0, 2).map((item, index) => {
                          return <div key={index}>{item}</div>
                        })}
                      </div>
                      <div className="profile">
                        <ProfileImage image={item.image} className="profile_image" />
                        <div className="name">
                          <b>{item.author}</b>강사
                        </div>
                      </div>
                    </QuoteCard>
                  </div>
                </div>
              );
            })}
          </StyledSlider>
        </Computer>
        <Mobile>
          <StyledSlider slidesToShow="1" ref={slider}>
            {items.map((item) => {
              let desc = (item.description.length >= 50) ? (item.description.slice(0, 50) + "...") : item.description
              return (
                <div key={item}>
                  <div>
                    <QuoteCard>
                      <div className="icon">
                        <Icon name="quote left" />
                      </div>
                      <div className="title">{item.title}</div>
                      <div className="body">
                        {desc.split("\n").slice(0, 2).map((item, index) => {
                          return <div key={index}>{item}</div>
                        })}
                      </div>
                      <div className="profile">
                        <ProfileImage image={item.image} className="profile_image" />
                        <div className="name">
                          <b>{item.author}</b>강사
                        </div>
                      </div>
                    </QuoteCard>
                  </div>
                </div>
              );
            })}
          </StyledSlider>
        </Mobile>
      </Section>
    </>
  );
}
