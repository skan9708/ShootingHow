import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import styled from "styled-components";
import {
  Button,
  Container,
  Section,
  Sections,
  SmallButton,
} from "../../../../components/AmongStyle";
import { BoardRead } from "../../../../components/Board";
import { Justify } from "../../../../components/Justify";
import CustomerLayout from "../../../../layouts/custom/CustomerLayout";

export default function Customer() {
  const router = useRouter();
  const [data, setData] = useState({});

  const reload = () => {
    axios
      .get("/api/article/instructor/" + router.query.id)
      .then((res) => {
        setData(res.data);
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
  };

  useEffect(() => {
    if (!router.query.id) return;
    reload();
  }, [router.query.id]);

  const onCommentWrite = (e) => {
    axios
      .post("/api/article/instructor/comment", {
        article_id: router.query.id,
        content: e.target.body.value,
      })
      .then((res) => {
        reload();
        e.target.body.value = "";
      })
      .catch((e) => {
        const err = e?.response?.data?.error;
        if (err) {
          alert(err);
        } else {
          // alert("알 수 없는 에러가 발생했습니다.");
          console.log(e);
        }
      });
    e.preventDefault();
  };

  const onCommentDelete = (id) => {
    if(!confirm("댓글을 삭제하시겠습니까?")) return
    axios.delete("/api/article/instructor/comment/" + id + "/")
    .then(() => {
      router.reload()
    })
    .catch(() => {
      alert("삭제 할 수 없습니다.")
    })
  }

  const onReport = () => {
    axios.post("/api/article/instructor/" + router.query.id + "/report/", {})
    .then(() => {
      alert("신고되었습니다.")
    })
  }

  const onModify = () => {
    router.push("/customer/board/write?id=" + router.query.id)
  }

  const onDelete = () => {
    if(!confirm("삭제하시겠습니까?")) return
    axios.delete("/api/article/instructor/" + router.query.id + "/")
    .then(() => {
      reload();
      router.push("/customer/board/")
    })
    .catch(() => {
      alert("삭제 할 수 없습니다.")
      router.push("/customer/board/")
    })
  }

  return (
    <CustomerLayout id="board">
      <Sections>
        <Section>
          <Container>
            <BoardRead>
              <div className="header">
                {data.is_solved ? (
                  <div className="label answered">답변완료</div>
                ) : (
                  <div className="label">답변전</div>
                )}
                <div className="title">{data.title}</div>
                <div className="writer">{data.author}</div>
                <div className="created">
                  <Moment format="YYYY-MM-DD HH:mm">{data.created}</Moment>
                </div>
              </div>
              <div className="desc">
                <div>
                  {
                    data.content?.split(/\n/g).map((item) => {
                      return <>{item}<br/></>
                    })
                  }
                </div>
              </div>
              <div className="attachments">
                <div>첨부파일</div>
                <div className="contents">
                  {data.attachments?.map((attachment, i) => {
                    return <div key={i}><a href={attachment.filelink} download>{attachment.filename}</a></div>;
                  })}
                </div>
              </div>
              <div className="textButtons">
                <div onClick={onReport}>신고</div>
                {data.is_author && <><span className="spt" /><div onClick={onModify}>수정</div></>}
                {data.is_author && <><span className="spt" /><div onClick={onDelete}>삭제</div></>}
              </div>

              {/* 댓글 목록 */}
              <div className="comments">
                {data.comments?.map((item, idx) => {
                  return (
                    <div key={idx}>
                      <div className="writer">
                        {item.author || "NULL"}{" "}
                        {item.is_author && <div className="label">작성자</div>}
                        {item.is_comment_author && (
                          <div className="text_button">
                            <div onClick={() => onCommentDelete(item.id)}>
                              삭제
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="body">
                        {
                          item.content.split(/\n/g).map((item) => {
                            return <>{item}<br/></>
                          })
                        }
                      </div>
                      <div className="date">
                        <Moment format="YYYY-MM-DD | HH:mm">
                          {item.created}
                        </Moment>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 댓글 작성 */}
              <form onSubmit={onCommentWrite}>
                <div className="comment_write">
                  <textarea
                    placeholder="댓글을 입력해주세요."
                    id="body"
                  ></textarea>
                  <button>등록하기</button>
                </div>
              </form>
              <div className="buttons">
                <SmallButton onClick={() => router.push("/customer/board")}>
                  목록
                </SmallButton>
              </div>
            </BoardRead>
          </Container>
        </Section>
      </Sections>
    </CustomerLayout>
  );
}
