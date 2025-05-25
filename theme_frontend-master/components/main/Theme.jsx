import axios from "axios";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Card, Container, Image, ImageContent, SlideCards, Title } from "../AmongStyle";
import { DoubleGrid } from "../DoubleGrid";
import { Justify } from "../Justify";
import { TopLeftRightButton } from "../TopLeftRightButton";

const TextDropdown = styled.div`
  max-width: 430px;
  >.item {
    margin-top: 30px;
    &:first-child {
        margin-top: 0px;
    }
  }
  .title {
    font-weight: 700;
    font-size: 32px;
    line-height: 32px;
    letter-spacing: -0.03em;
    color: #07287c;
    cursor: pointer;
  }
  .desc {
    margin-top: 16px;
    font-weight: 400;
    font-size: 18px;
    line-height: 150%;
    letter-spacing: -0.03em;
    color: #383838;
  }
  .link {
    margin-top: 20px;
    margin-bottom: 60px;
    > a {
      font-weight: 700;
      font-size: 18px;
      line-height: 23px;
      letter-spacing: -0.03em;
      color: #000000;
      padding-bottom: 5px;
      border-bottom: 1px solid #000000;
    }
  }
  .disabled {
    &:first-child {
      margin-top: 0px;
    }
    .title {
      color: #c9c9c9;
      &:hover {
        color: #aaa;
      }
    }
    .desc {
      display: none;
    }
    .link {
      display: none;
    }
  }
  @media (max-width: 450px) {
    >.item {
      margin-top: 10px;
    }
    .title {
      font-size: 20px;
    }
    .desc {
      margin-top: 5px;
    }
    .link {
      a {
        font-size: 14px;
      }
      margin-bottom: 20px;
      margin-top: 5px;
    }
  }
`;

const LineNumber = styled.div`
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: -0.03em;
  font-family: 'Spoqa Han Sans Neo';
  .current {
    font-weight: 700;
    color: #07287C;
  }
  .line {
    width: 53.76px;
    height: 0px;
    border: 1px solid #A1B4E3;
    margin: 0px 16px;
  }
  .total {
    color: #A1B4E3;
  }
`

const Styled = styled.div`
  .image {
    height: 460px;
  }
  padding-bottom: 100px;
  @media (max-width: 450px) {
    padding-bottom: 0px;
    .image {
      height: 260px;
    }
    .lineNumber {
      display: None;
    }
    .desc {
      font-weight: 400;
      font-size: 14px;
      line-height: 24px;
    }
    /* .disabled {
      display: none;
    } */
  }
`

export default function Theme(props) {
  const [items, setItems] = useState([]);
  const [active, setAcitve] = useState(0);

  useEffect(() => {
    axios.get("/api/staticlist?code=theme").then((res) => {
      setItems(res.data);
    });
  }, []);

  return (
    <Styled>
      <Container>
        <Title className="title">
          <div>남녀노소 즐길 수 있는</div>
          <div>풋살장으로 신나는 하루를 즐겨보세요!</div>
        </Title>
        <DoubleGrid mobile>
          <div>
            <ImageContent
              className="image"
              image={items[active]?.image}
              width="100%"
            />
          </div>
          <TextDropdown>
            <LineNumber className="lineNumber">
              <div className="current">0{active + 1}</div>
              <div className="line"/>
              <div className="total">04</div>
            </LineNumber>
            {items.map((item, idx) => {
              return (
                <div
                  className={active === idx ? "item " : "item disabled"}
                  key={idx}
                  onClick={() => setAcitve(idx)}
                >
                  <div>
                    <div className="title">{item.title}</div>
                    {/* #TODO: 슬라이드 버튼 */}
                  </div>
                  <div className="desc">{item.description}</div>
                  <div className="link">
                    <a href={item.links?.link0}>{item.links?.link_name0}</a>
                  </div>
                </div>
              );
            })}
          </TextDropdown>
        </DoubleGrid>
      </Container>
    </Styled>
  );
}
