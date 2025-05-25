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
import ReservationCard from '../../components/ReservationCard';

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
  const [data, setData] = useState([
    {
      fieldId: 1,
      name: '필드 1',
      address: '서울시 강남구',
      contactNumber: '010-1234-5678',
      imageUrl: 'https://via.placeholder.com/150',
      usageHours: '09:00 - 18:00',
      price: 10000,
      reservationNotes: '예약 시 참고사항',
      parkingInfo: '주차 가능',
      rentalInfo: '대여 가능'
    },
    {
      fieldId: 2,
      name: '필드 2',
      address: '서울시 서초구',
      contactNumber: '010-8765-4321',
      imageUrl: 'https://via.placeholder.com/150',
      usageHours: '10:00 - 19:00',
      price: 15000,
      reservationNotes: '예약 시 참고사항',
      parkingInfo: '주차 불가',
      rentalInfo: '대여 불가'
    }
  ]);

  useEffect(() => {
    axios.get("/api/product/reservation/").then(({ data }) => {
      if (data.length > 0) {
        setData(data);
      }
    });
  }, []);

  return (
    <Styled>
      <Menu flatten block />
      <Sections>
        <Section>
          <Container>
            <TextTitle>
              <div className="title">슈팅어때 예약센터</div>
              <div className="desc">
                테마를 이용하기 위한 서비스 상품입니다.
              </div>
            </TextTitle>
            <div className="computer cards">
              <Grid columns={3}>
                {data.map((item, i) => {
                  return (
                    <Grid.Column key={i}>
                      <ReservationCard
                        name={item.name}
                        date={item.date}
                        time={item.time}
                        imageUrl={item.image}
                      />
                    </Grid.Column>
                  );
                })}
              </Grid>
            </div>
            <div className="mobile cards">
              {data.map((item, i) => {
                return (
                  <ReservationCard
                    key={i}
                    name={item.name}
                    date={item.date}
                    time={item.time}
                    imageUrl={item.image}
                  />
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
