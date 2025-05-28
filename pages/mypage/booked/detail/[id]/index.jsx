import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  Button,
  Center,
  Container,
  Section,
  Sections,
} from "../../../../../components/AmongStyle";
import { Table, TextTable } from "../../../../../components/Table";
import MypageLayout from "../../../../../layouts/custom/MypageLayout";

const Label = styled.div`
  font-weight: 400;
  font-size: 16px;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.03em;
  color: #07287c;
  border: 1px solid #07287c;
  border-radius: 5px;
  margin: auto;
  cursor: pointer;
`;

const Canceled = styled.div`
  border-color: #ff0000;
  color: #ff0000;
`;

export default function MypageBooked(props) {
  const router = useRouter();
  const [data, setData] = useState({
    loading: false,
    reservation_code: "TEST-12345",
    status: "예약완료",
    is_cancelable: true,
    fullname: "최진혁",
    reservation_date: "2025-05-30",
    product: "PK풋살장",
    reservation_time: "12:00 - 15:00",
    num_of_man: 6,
    num_of_woman: 0,
    reservation_at: "2025-05-28T09:50:32Z",
  });

  useEffect(() => {
    if (!router.isReady) return;
    // axios.get("/api/product/reservation/" + router.query.id + "/")
    //   .then(({data}) => {
    //     console.log(data)
    //     setData(data);
    //   })
    //   .catch((e) => {
    //     const err = e?.response?.data?.error
    //     if(err) {
    //       toast.error(err)
    //     } else {
    //       toast.error("자세한 예약내역을 불러오는 과정에서 에러가 발생했습니다.");
    //       console.log(e)
    //     }
    //   });
  }, [router.query.id, router.isReady]);

  const changeHandler = () => {
    toast.warn("TODO")
  };

  const cancelHandler = () => {
    if(!data.is_cancelable) {
      toast.error("예약취소는 이용일자기준, 이틀전까지 가능합니다.")
      return
    }
    if(!confirm("취소하시겠습니까?")) {
      return
    }
    // axios.post("/api/payment/cancel/", {"reservation_id": router.query.id})
    // .then((res) => {
    //   toast.success("정상적으로 예약취소되었습니다.")
    //   router.push("/mypage/booked/")
    // })
    // .catch((e) => {
    //   toast.error(e.response.data.error)
    // })
    toast.info("예약취소 API 호출이 임시로 비활성화되었습니다."); // 임시 알림
  };
  
  if(data.loading) {
    return
  }

  return (
    <MypageLayout id="booked">
      <Sections>
        <Section>
          <Container>
            <Table style={{ maxWidth: 900, margin: "auto" }}>
              <tbody>
                <tr>
                  <td className="header">예약번호</td>
                  {/* <td>{data.id}</td> */}
                  <td>{data.reservation_code}</td>
                </tr>
                <tr>
                  <td className="header">예약상태</td>
                  <td>{data.is_cancelable ? <Canceled>{data.status}</Canceled> : data.status}</td>
                </tr>
                <tr>
                  <td className="header">예약자</td>
                  <td>{data.fullname}</td>
                </tr>
                <tr>
                  <td className="header">이용날짜</td>
                  <td>{data.reservation_date}</td>
                </tr>
                <tr>
                  <td className="header">이용종류</td>
                  <td>{data.product}</td>
                </tr>
                <tr>
                  <td className="header">이용시간</td>
                  <td>{data.reservation_time}</td>
                </tr>
                <tr>
                  <td className="header">이용인원</td>
                  <td>
                    남성 {data.num_of_man}인, 여성 {data.num_of_woman}인
                  </td>
                </tr>
                <tr>
                  <td className="header">예약신청일</td>
                  <td><Moment format="YYYY-MM-DD HH:mm:ss">{data.reservation_at}</Moment></td>
                </tr>
                <tr>
                  <td className="header">결제방식</td>
                  <td>카드결제</td>
                  {/* <td>무통장입금 || 카드결제</td> */}
                </tr>
              </tbody>
            </Table>
            <Center style={{ marginTop: 50 }}>
              {
                (!data.is_cancelable) && (
                  data.is_cancelable ? (
                    <Button red onClick={cancelHandler}>
                      예약취소
                    </Button>
                  ) : (
                    <Button red onClick={cancelHandler} style={{backgroundColor: "#ddd", color: "#aaa"}}>
                      예약취소
                    </Button>
                  )
                )
              }
              {/* &nbsp;&nbsp;&nbsp; */}
              {/* TODO */}
              {/* <Button onClick={changeHandler}>예약변경</Button> */}
            </Center>
          </Container>
        </Section>
      </Sections>
    </MypageLayout>
  );
}
