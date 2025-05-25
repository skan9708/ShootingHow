import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import styled from "styled-components";
import {
  Container,
  Section,
  Sections,
  SmallButton,
} from "../../../components/AmongStyle";
import { Justify } from "../../../components/Justify";
import CustomerLayout from "../../../layouts/custom/CustomerLayout";

const Page = styled.div`
  .header {
    border-top: 1px solid #07287c;
    border-bottom: 2px solid #f0f0f0;
    padding: 48px 0px;
    .title {
      font-weight: 500;
      font-size: 24px;
      line-height: 100%;
      text-align: center;
      letter-spacing: -0.03em;
      color: #000000;
    }
    .date {
      display: flex;
      justify-content: center;
      margin-top: 18px;
      > div {
        display: flex;
        margin-right: 30px;
        > div:first-child {
          margin-right: 5px;
          padding-right: 5px;
          border-right: 1px solid #eee;
        }
        &:last-child {
          margin-right: 0px;
        }
      }
      font-weight: 400;
      font-size: 18px;
      line-height: 23px;
      letter-spacing: -0.03em;
      color: #484848;
    }
  }
  .desc {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 30px;
    letter-spacing: -0.02em;
    color: #484848;
    margin: auto;
    padding: 50px 0px;
    border-bottom: 2px solid #e8e8e8;
    > div {
      max-width: 900px;
      margin: auto;
    }
  }
`;

export default function Customer() {
  const router = useRouter();
  const [data, setData] = useState({})
  useEffect(() => {
    if(!router.query.id) return
    axios
      .get("/api/article/notice/" + router.query.id)
      .then((res) => {
        setData(res.data)
      })
      .catch((e) => {
        const err = e?.response?.data?.error;
        if (err) {
          alert(err);
        } else {
          alert("알 수 없는 에러가 발생했습니다.");
          console.log(e);
        }
      });
  }, [router.query.id]);

  return (
    <CustomerLayout id="customer">
      <Sections>
        <Section className="customer-section">
          <Container>
            <Page>
              <div className="header">
                <div className="title">{data.title}</div>
                <div className="date">
                  <div>
                    <div>작성일</div>
                    <div><Moment format="YYYY-MM-DD">{data.created}</Moment></div>
                  </div>
                  <div>
                    <div>조회수</div>
                    <div>{data.view_count}</div>
                  </div>
                </div>
              </div>
              <div className="desc">
                <div>
                  <div dangerouslySetInnerHTML={{__html: data.content}} />
                </div>
              </div>
              <Justify style={{margin: 0, marginTop: 20}}>
                <div>
                  {data.side?.previous && <SmallButton onClick={() => router.push("/customer/view/" + data.side.previous)}>&lt; 이전글</SmallButton>}
                  {data.side?.next && <SmallButton onClick={() => router.push("/customer/view/" + data.side.next)}>다음글 &gt;</SmallButton>}
                </div>
                <div>
                  <SmallButton onClick={() => router.push("/customer/")}>목록</SmallButton>
                </div>
              </Justify>
            </Page>
          </Container>
        </Section>
      </Sections>
    </CustomerLayout>
  );
}
