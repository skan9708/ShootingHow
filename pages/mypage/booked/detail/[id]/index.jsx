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
    loading: true,
    reservation_code: "",
    status: "",
    is_cancelable: false,
    fullname: "",
    reservation_date: "",
    product: "",
    reservation_time: "",
    num_of_man: 0,
    num_of_woman: 0,
    reservation_at: "",
  });

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.id) return;

    setData(prev => ({ ...prev, loading: true }));

    axios.get(`/api/product/reservation/${router.query.id}/`)
      .then(({ data: responseData }) => {
        setData({
          loading: false,
          reservation_code: responseData.id,
          status: responseData.status,
          is_cancelable: responseData.status === "예약완료",
          fullname: responseData.fullname,
          reservation_date: responseData.reservation_date,
          product: responseData.product,
          reservation_time: responseData.reservation_time,
          num_of_man: responseData.num_of_man,
          num_of_woman: responseData.num_of_woman,
          reservation_at: responseData.reservation_at,
        });
      })
      .catch((e) => {
        setData(prev => ({ ...prev, loading: false }));
        const err = e?.response?.data?.error || e?.response?.data?.detail;
        if(err) {
          toast.error(err);
        } else {
          toast.error("예약 상세 정보를 불러오는 중 오류가 발생했습니다.");
          console.error(e);
        }
      });
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
    toast.info("예약취소 API 호출이 임시로 비활성화되었습니다.");
  };
  
  if(data.loading) {
    return (
      <MypageLayout id="booked">
        <Sections>
          <Section>
            <Container style={{ textAlign: "center", padding: "50px" }}>
              <p>예약 정보를 불러오는 중입니다...</p>
            </Container>
          </Section>
        </Sections>
      </MypageLayout>
    )
  }

  if (!data.reservation_code && !data.loading) {
    return (
      <MypageLayout id="booked">
        <Sections>
          <Section>
            <Container style={{ textAlign: "center", padding: "50px" }}>
              <p>예약 정보를 찾을 수 없습니다.</p>
              <Button onClick={() => router.push("/mypage/booked/")}>예약 목록으로 돌아가기</Button>
            </Container>
          </Section>
        </Sections>
      </MypageLayout>
    )
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
            </Center>
          </Container>
        </Section>
      </Sections>
    </MypageLayout>
  );
}
