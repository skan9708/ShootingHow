import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import styled from "styled-components";
import {
  Center,
  Container,
  ImageContent,
  Section,
  Sections,
} from "../../components/AmongStyle";
import { GridCards } from "../../components/Cards";
import Footer from "../../components/Footer";
import Menu from "../../components/Menu";

const TextTitle = styled(Center)`
  flex-direction: column;
  .title {
    font-weight: 700;
    font-size: 42px;
    line-height: 150%;
    letter-spacing: -0.03em;
    color: #07287c;
  }
  .desc {
    font-weight: 500;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: -0.03em;
    color: #000000;
    margin-top: 11px;
  }
`;

const Card = styled(ImageContent)`
  cursor: pointer;
  height: calc(min(1200px, 100vw) / 3 * 0.7);
  padding: 30px;
  color: #fff;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: -0.03em;
  color: #ffffff;

  .title {
    font-weight: 700;
  }
`;

const Styled = styled.div`
  .cards.computer {
    margin-top: 50px;
  }
  @media (max-width: 450px) {
    .title {
      font-size: 22px;
      margin-right: auto;
    }
    .desc {
      font-size: 14px;
      margin-right: auto;
    }
    .cards {
      margin-top: 40px;
      width: 100%;
      >div {
        width: 100%;
        height: 220px;
        margin-bottom: 25px;
      }
    }
  }
`

export default function BookingIndex(props) {
  const router = useRouter()
  const [data, setData] = useState([])
  useEffect(() => {
    axios.get("/api/product/reservation/").then(({ data }) => {
      setData(data)
    })
  }, [])

  return (
    <Styled>
      <Menu flatten block />
      <Sections>
        <Section>
          <Container>
            <TextTitle>
              <div className="title">슈팅어때 예약</div>
              <div className="desc">
                '슈팅어때'를 이용하기 위한 서비스 상품입니다.
              </div>
            </TextTitle>
            <div className="computer cards">
              <Grid columns={3}>
                {data.map((item, i) => {
                  return (
                    <Grid.Column key={i}>
                      <Card
                        image={item.image}
                        onClick={() => router.push("/booking/order/" + item.id)}
                      >
                        <div className="title">{item.name}</div>
                        {/* <div className="desc">{item.minimum_price[0]} {parseInt(item.minimum_price[1]).toLocaleString()}원 부터~</div> */}
                      </Card>
                    </Grid.Column>
                  );
                })}
              </Grid>
            </div>
            <div className="mobile cards">
              {data.map((item, i) => {
                return (
                  <Card
                    key={i}
                    image={item.image}
                    onClick={() => router.push("/booking/order/" + item.id)}
                  >
                    <div className="title">{item.name}</div>
                  </Card>
                );
              })}
            </div>
          </Container>
        </Section>
      </Sections>
      <Footer />
    </Styled>
  );
}
