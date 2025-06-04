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
// ReservationCard는 현재 사용되지 않으므로 주석 처리하거나, 필요시 props 구조를 파악 후 사용합니다.
// import ReservationCard from '../../components/ReservationCard';
import { toast } from "react-toastify";

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
  const router = useRouter();
  // API로부터 받아올 경기장 목록과 로딩 상태를 위한 state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("/api/product/reservation/") // 이 API가 경기장 목록을 반환한다고 가정
      .then(({ data: responseData }) => {
        // API 응답이 객체이고 실제 목록이 results 속성에 있을 경우를 대비
        const productList = Array.isArray(responseData) ? responseData : responseData?.results || [];
        setProducts(productList);
      })
      .catch(error => {
        console.error("경기장 목록을 불러오는데 실패했습니다:", error);
        toast.error("경기장 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
        setProducts([]); // 에러 발생 시 빈 목록으로 설정
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // 컴포넌트 마운트 시 1회 실행

  // 로딩 중 UI
  if (loading) {
    return (
      <Styled>
        <Menu flatten block />
        <Sections>
          <Section>
            <Container>
              <TextTitle>
                <div className="title">슈팅어때 예약하기</div>
                <div className="desc">
                  예약 가능한 필드 목록을 불러오는 중입니다...
                </div>
              </TextTitle>
            </Container>
          </Section>
        </Sections>
        <Footer />
      </Styled>
    );
  }

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
            
            {/* API로부터 받아온 products를 사용하여 동적으로 경기장 목록 표시 */}
            {products.length > 0 ? (
              <div style={{margin: '80px 0'}}>
                <h2>전체 예약 가능 목록</h2>
                <div style={{display:'flex', flexWrap:'wrap', alignItems:'stretch', gap:32, justifyContent: 'center'}}>
                  {products.map(product => (
                    <div 
                      key={product.id}
                      onClick={() => router.push(`/booking/order/${product.id}`)} 
                      style={{
                        width: 'calc(33.333% - 22px)', // 3개씩 정렬, gap 고려
                        minWidth: 300, // 최소 너비
                        height: 260,
                        background:'#eee',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        cursor:'pointer',
                        fontWeight:600,
                        fontSize:24,
                        borderRadius:16, 
                        overflow:'hidden', 
                        position:'relative',
                        marginBottom: 32 // 카드 간 하단 마진
                      }}
                    >
                      {/* product.image가 없을 경우를 대비하여 기본 이미지 또는 플레이스홀더 처리 가능 */}
                      <img 
                        src={product.image || '/placeholder-image.jpg'} // API에 image 필드가 있다고 가정
                        alt={product.name} 
                        style={{width:'100%',height:'100%',objectFit:'cover'}} 
                      />
                      <div style={{
                        position:'absolute', 
                        left:16, 
                        bottom:24, 
                        color:'#fff', 
                        textAlign:'left',
                        width: 'calc(100% - 32px)', // 양쪽 패딩 고려
                      }}>
                        <div style={{
                          fontSize:'1.5rem', 
                          fontWeight:700, 
                          textShadow:'0 2px 8px rgba(0,0,0,0.4)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {product.name}
                        </div>
                        {/* 
                          주소 정보는 현재 API에서 제공하지 않으므로 주석 처리.
                          API에 address 필드가 추가되면 주석 해제 가능.
                        <div style={{
                          fontSize:'1rem', 
                          fontWeight:400, 
                          marginTop:4, 
                          textShadow:'0 2px 8px rgba(0,0,0,0.4)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {product.address || '주소 정보 없음'}
                        </div>
                        */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              !loading && ( // 로딩이 끝났는데 상품이 없을 경우
                <div style={{margin: '80px 0', textAlign: 'center'}}>
                  <p>예약 가능한 경기장이 없습니다.</p>
                </div>
              )
            )}
            
            {/* 기존 하드코딩된 섹션들은 제거함 (아래 부분) */}
            {/* 
            <div style={{margin: '80px 0'}}>
              <h2>실내 풋살장</h2>
              // ... (하드코딩된 내용)
            </div>
            <div style={{margin: '80px 0'}}>
              <h2>야외 풋살장</h2>
              // ... (하드코딩된 내용)
            </div>
            <div style={{margin: '80px 0'}}>
              <h2>야외 축구장</h2>
              // ... (하드코딩된 내용)
            </div>
            */}
          </Container>
        </Section>
      </Sections>
      <Footer />
    </Styled>
  );
}
