import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import styled from "styled-components";
import {
  Container,
  Label,
  Section,
  Sections,
  WarningBox,
} from "../../components/AmongStyle";
import { TextTable } from "../../components/Table";
import MypageLayout from "../../layouts/custom/MypageLayout";

const Styled = styled(Container)`
  max-width: 900px;
  margin-top: 42px;
  letter-spacing: -0.03em;
  .title {
    margin-top: 50px;
    font-weight: 500;
    font-size: 18px;
    line-height: 23px;
    letter-spacing: -0.03em;
    margin-bottom: 12px;
  }

  .dashboardWrapper {
    display: flex;
    align-items: center;
    .dashboard {
      margin-left: 18px;
      margin-right: auto;
      font-weight: 400;
      font-size: 16px;
      line-height: 26px;
      color: #07287c;
    }
  }
  .point b {
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    color: #07287c;
  }
  .buttons {
    display: flex;
    >div {
      margin-right: 5px;
      &:last-child {
        margin-right: 0px;
      }
    }
    button {
      background: #07287c;
      color: #fff;
      border: 0px solid;
      border-radius: 5px;
      padding: 10px;
    }
  }
`;

export default function MypageComment(props) {
  const router = useRouter();
  const [items, setItems] = useState([])
  useEffect(() => {
    axios.get("/api/account/my_comments/")
    .then((res) => {
      setItems(res.data)
    })
    .catch(e => {
      toast.error("예약내역을 불러오는 과정에서 에러가 발생했습니다.")
    })
  }, [])
  return (
    <MypageLayout id="comment">
      <Styled>
        <div className="title">내가 쓴 댓글</div>
        <TextTable>
          <thead>
            <tr>
              <th>댓글 내용</th>
              <th style={{width: 290}}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, key) => {
              const id = key;
              return (
                <tr key={key} style={{ textAlign: "center" }}>
                  <td style={{ textAlign: "left" }}>{item.content}</td>
                  <td><Moment format="YYYY-MM-DD HH:mm:ss">{item.created}</Moment></td>
                </tr>
              );
            })}
          </tbody>
        </TextTable>
      </Styled>
    </MypageLayout>
  );
}
