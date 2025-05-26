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
              <div className="title">슈팅어때 예약하기</div>
              <div className="desc">
                예약이 가능한 필드 목록입니다.
              </div>
            </TextTitle>
            <div style={{margin: '80px 0'}}>
              <h2>실내 풋살장</h2>
              <div style={{display:'flex',alignItems:'center',gap:32}}>
                <div onClick={()=>router.push('/booking/detail')} style={{width:400,height:260,background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontWeight:600,fontSize:24,borderRadius:16, overflow:'hidden', position:'relative'}}>
                  <img src="/indoor1.jpg" alt="실내 풋살장1" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <div style={{position:'absolute', left:16, bottom:24, color:'#fff', textAlign:'left'}}>
                    <div style={{fontSize:'1.5rem', fontWeight:700, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>성북 실내 풋살센터</div>
                    <div style={{fontSize:'1rem', fontWeight:400, marginTop:4, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>서울특별시 성북구 안암동2가 번지 지하 121-3 SM빌딩 1층</div>
                  </div>
                </div>
                <div onClick={()=>router.push('/booking/detail')} style={{width:400,height:260,background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontWeight:600,fontSize:24,borderRadius:16, overflow:'hidden', position:'relative'}}>
                  <img src="/indoor2.jpg" alt="실내 풋살장2" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <div style={{position:'absolute', left:16, bottom:24, color:'#fff', textAlign:'left'}}>
                    <div style={{fontSize:'1.5rem', fontWeight:700, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>PK풋살장</div>
                    <div style={{fontSize:'1rem', fontWeight:400, marginTop:4, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>서울특별시 강북구 삼양로 497 PK풋살장 5층</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{margin: '80px 0'}}>
              <h2>야외 풋살장</h2>
              <div style={{display:'flex',alignItems:'center',gap:32}}>
                <div onClick={()=>router.push('/booking/detail')} style={{width:400,height:260,background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontWeight:600,fontSize:24,borderRadius:16, overflow:'hidden', position:'relative'}}>
                  <img src="/outdoor1.jpg" alt="야외 풋살장1" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <div style={{position:'absolute', left:16, bottom:24, color:'#fff', textAlign:'left'}}>
                    <div style={{fontSize:'1.5rem', fontWeight:700, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>어린이대공원 풋살장</div>
                    <div style={{fontSize:'1rem', fontWeight:400, marginTop:4, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>서울특별시 광진구 능동 능동로24길 23</div>
                  </div>
                </div>
                <div onClick={()=>router.push('/booking/detail')} style={{width:400,height:260,background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontWeight:600,fontSize:24,borderRadius:16, overflow:'hidden', position:'relative'}}>
                  <img src="/outdoor2.jpg" alt="야외 풋살장2" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <div style={{position:'absolute', left:16, bottom:24, color:'#fff', textAlign:'left'}}>
                    <div style={{fontSize:'1.5rem', fontWeight:700, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>라온 풋살장</div>
                    <div style={{fontSize:'1rem', fontWeight:400, marginTop:4, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>서울특별시 도봉구 방학동 553-2</div>
                  </div>
                </div>
                <div onClick={()=>router.push('/booking/detail')} style={{width:400,height:260,background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontWeight:600,fontSize:24,borderRadius:16, overflow:'hidden', position:'relative'}}>
                  <img src="/outdoor3.jpg" alt="야외 풋살장3" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <div style={{position:'absolute', left:16, bottom:24, color:'#fff', textAlign:'left'}}>
                    <div style={{fontSize:'1.5rem', fontWeight:700, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>도봉풋살장</div>
                    <div style={{fontSize:'1rem', fontWeight:400, marginTop:4, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>서울특별시 도봉구 방학로 266-50</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{margin: '80px 0'}}>
              <h2>야외 축구장</h2>
              <div style={{display:'flex',alignItems:'center',gap:32}}>
                <div onClick={()=>router.push('/booking/detail')} style={{width:400,height:260,background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontWeight:600,fontSize:24,borderRadius:16, overflow:'hidden', position:'relative'}}>
                  <img src="/soccer.jpg" alt="야외 축구장" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <div style={{position:'absolute', left:16, bottom:24, color:'#fff', textAlign:'left'}}>
                    <div style={{fontSize:'1.5rem', fontWeight:700, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>제2 월곡인조잔디구장</div>
                    <div style={{fontSize:'1rem', fontWeight:400, marginTop:4, textShadow:'0 2px 8px rgba(0,0,0,0.4)'}}>서울특별시 성북구 상월곡동 산 1-1</div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </Sections>
      <Footer />
    </Styled>
  );
}
