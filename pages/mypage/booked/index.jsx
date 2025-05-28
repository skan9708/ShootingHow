import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { toast } from "react-toastify";
import {
  Container,
  Label,
  Section,
  Sections,
} from "../../../components/AmongStyle";
import { TextTable } from "../../../components/Table";
import MypageLayout from "../../../layouts/custom/MypageLayout";

export default function MypageBooked(props) {
  const router = useRouter();
  const [items, setItems] = useState([])
  useEffect(() => {
    axios.get("/api/product/reservation/list/")
    .then((res) => {
      setItems(res.data)
    })
    .catch(e => {
      toast.error("예약내역을 불러오는 과정에서 에러가 발생했습니다.")
    })
  }, [])
  return (
    <MypageLayout id="booked">
      <Sections>
        <Section>
          <Container>
            <TextTable style={{ maxWidth: 900, margin: "auto" }}>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>번호</th>
                  <th>예약번호</th>
                  <th style={{ width: 140 }}>이용날짜</th>
                  <th style={{ width: 140 }}>등록일</th>
                  <th style={{ width: 100 }}>예약상태</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, key) => {
                  return (
                    <tr key={key} className="clickable" onClick={() => {
                      router.push(`/mypage/booked/detail/${item.id}`)
                    }}>
                      <td>{key + 1}</td>
                      <td>{item.reservation_code}</td>
                      <td><Moment format="YYYY-MM-DD">{item.reservation_at}</Moment></td>
                      <td>{item.reservation_date}</td>
                      <td>
                          <Label red={item.status !== "예약완료"}>{item.status}</Label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </TextTable>
          </Container>
        </Section>
      </Sections>
    </MypageLayout>
  );
}
