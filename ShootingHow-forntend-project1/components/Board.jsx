import styled from "styled-components";
import { TextTable } from "./Table";
import img_lock from "./lock.svg";
import { toast } from "react-toastify";
import { Computer, Mobile } from "./AmongStyle";
import Moment from "react-moment";

const StyledMobile = styled.div`
  border-top: 1px solid #07287C;
  >div {
    font-family: 'Spoqa Han Sans Neo';
    padding: 16px;
    border-bottom: 1px solid #F0F0F0;
    .date {
      font-style: normal;
      font-weight: 300;
      font-size: 16px;
      line-height: 160%;
      letter-spacing: -0.03em;
      color: #000000;
    }
    .title {
      font-weight: 500;
      font-size: 20px;
      line-height: 160%;
      letter-spacing: -0.02em;
      color: #01111E;
    }
  }
`

export function Board(props) {
  const onClickHandler = (e) => {
    if (!props.clickable) return
    if (!e.is_mine && props.locked) {
      console.log(e)
      toast.error("본인 게시물만 열람 할 수 있습니다.")
      return
    }
    props.onClickCell && props.onClickCell(e)
  }
  return (
    <>
      <Computer>
        <TextTable>
          <thead>
            <tr>
              {props.headers &&
                props.headers.map((item, idx) => {
                  return <th key={idx}>{item}</th>;
                })}
            </tr>
          </thead>
          <tbody>
            {props.items.map((row, idx) => {
              return (
                <tr key={idx} className={props.clickable && "clickable"} onClick={() => onClickHandler(row)}>
                  {row.data.map((col, idx) => {
                    const style = {};
                    var text = col
                    style.textAlign = "left";
                    if (-1 < props.centers?.indexOf(idx)) {
                      style.textAlign = "center";
                    }
                    if (-1 < props.questionStatus?.indexOf(idx)) {
                      if (col) {
                        text = "답변완료"
                        style.color = "#07287C"
                      } else {
                        text = "답변전"
                        style.color = "#00B473"
                      }
                    }
                    if (props.width && props.width[idx]) {
                      style.width = props.width[idx];
                    }
                    if (idx == 1 && props.locked && !row.is_mine) {
                      text = <><img src={img_lock.src} /> {text}</>
                    }
                    return (
                      <td key={idx} style={style}>
                        {text}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </TextTable>
      </Computer>
      <Mobile>
        <StyledMobile>
        {/* {JSON.stringify(props)} */}
        {props.items.map((row, idx) => {
          return (
            <div key={idx} className="row" onClick={() => onClickHandler(row)}>
              <div className="date"><Moment format="YYYY.MM.DD">{row.raw?.created}</Moment></div>
              <div className="title">
                {row.raw?.title}
              </div>
            </div>
          );
        })}
        </StyledMobile>
      </Mobile>
    </>
  );
}

export const BoardRead = styled.div`
  .header {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #c9c9c9;
    .label {
      font-family: "Spoqa Han Sans Neo";
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 26px;
      border: 1px solid #00b473;
      color: #00b473;
      &.answered {
        border: 1px solid #07298c;
        color: #07287c;
      }
      padding: 5px 10px;
      border-radius: 5px;
      height: 35px;
      margin-right: 15px;
    }
    .title {
      font-weight: 500;
      font-size: 24px;
      line-height: 100%;
      letter-spacing: -0.03em;
      color: #000000;
    }
    .writer {
      margin-left: auto;
      font-weight: 500;
      font-size: 18px;
      line-height: 23px;
      letter-spacing: -0.03em;
      color: #000000;
    }
    .created {
      margin-left: 15px;
      color: #484848;
    }
  }
  .desc {
    font-family: "Noto Sans KR";
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 28px;
    letter-spacing: -0.02em;
    color: #484848;
    margin-top: 30px;
    margin-bottom: 50px;
  }
  .attachments {
    font-family: "Spoqa Han Sans Neo";
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 23px;
    padding: 15px 24px;
    letter-spacing: -0.03em;
    color: #383838;
    background: #f7f9fe;
    display: flex;
    .contents {
      margin-left: 16px;
      font-weight: 400;
      font-size: 16px;
      line-height: 26px;
      letter-spacing: -0.03em;
      color: #383838;
    }
  }
  .textButtons {
    display: flex;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 25px;
    > div {
      font-weight: 500;
      font-size: 18px;
      line-height: 23px;
      letter-spacing: -0.03em;
      color: #000000;
      &:first-child {
        margin-left: auto;
      }
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
    > span.spt {
      width: 1px;
      margin: 0px 15px;
      background-color: #e8e8e8;
      height: 15px;
    }
  }
  .comments {
    border-top: 1px solid #07287c;
    margin-top: 30px;
    > div {
      padding: 30px;
      border-bottom: 1px solid #f4f4f4;
      &:last-child {
        margin-bottom: 0px;
        border-bottom: 0px;
      }
      .writer {
        font-weight: 500;
        font-size: 18px;
        line-height: 23px;
        letter-spacing: -0.03em;
        color: #000000;
        display: flex;
        > .label {
          margin-left: 10px;
          font-weight: 400;
          font-size: 14px;
          color: #00b473;
          border: 1px solid #00b473;
          padding: 0px 8px;
          height: 25px;
          border-radius: 20px;
        }
        > .text_button {
          margin-left: auto;
          &:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
      .body {
        font-weight: 400;
        font-size: 18px;
        line-height: 28px;
        color: #484848;
        margin-top: 3px;
        margin-bottom: 5px;
      }
      .date {
        font-weight: 400;
        font-size: 16px;
        letter-spacing: -0.03em;
        color: #c9c9c9;
      }
    }
  }
  .comment_write {
    margin-top: 30px;
    background: #fafafa;
    border: 1px solid #e8e8e8;
    padding: 15px 15px;
    display: flex;
    flex-direction: column;
    > textarea {
      background: #fafafa;
      outline: none;
      border: 0px;
      width: 100%;
      height: 100px;
      resize: none;
    }
    > button {
      font-weight: 500;
      font-size: 18px;
      line-height: 23px;
      letter-spacing: -0.03em;
      color: #ffffff;
      background: #07287c;
      border: 0px;
      padding: 12px 14px;
      width: 100px;
      margin-left: auto;
    }
  }
  .buttons {
    display: flex;
    padding-top: 40px;
    margin-top: 40px;
    border-top: 1px solid #e8e8e8;
    > div {
      margin-left: auto;
    }
  }

  >.answer {
    background: #FAFAFA;
    border: 1px solid #E8E8E8;
    padding: 25px 20px;
    >.top {
      display: flex;
      align-items: center;
      .answer {
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 23px;
        letter-spacing: -0.03em;
        color: #000000;
        margin-left: 5px;
      }
      .admin {
        font-weight: 400;
        font-size: 14px;
        line-height: 14px;
        color: #00B473;
        padding: 2px 5px;
        border: 1px solid #00B473;
        border-radius: 100px;
        margin: 0px 10px;
      }
      .date {
        font-weight: 400;
        font-size: 16px;
        line-height: 26px;
        letter-spacing: -0.03em;
        color: #C9C9C9;
      }
    }
    >.text {
      font-weight: 400;
      font-size: 18px;
      line-height: 28px;
      letter-spacing: -0.02em;
      color: #484848;
      margin-top: 16px;
    }
  }
  >.not_answer {
    text-align: center;
    margin-top: 40px;
  }

  @media (max-width: 450px) {
    
  }
`;



///

// 예시
`
const board = {
    headers: ["번호", "제목", "작성일", "조회수"], // 헤더 리스트
    maxPages: 10, // page 번호가 10번까지 있다는 이야기
    centers: [0, 2, 3], // 다음 목록에 컬럼은 가운대 정렬 ... 번호 / 작성일 / 조회수는 가운대 정렬 하겠다.
    width: { // 다음 key에 해당하는 컬럼은 value에 해당하는 width를 갖는다 ... 번호 / 작성일 / 조회수는 각각 100px / 120px / 120px로 하겠다.
      "0": 100, "2": 120, "3": 120
    },
    questionStatus: [0], // 1:1문의 중 질의/응답 컬럼 위치, 없는 경우 null 또는 undefined
    items: [ // 게시물 리스트
      {
        isNotice: true, // 공지여부
        data: [
          // 컬럼은 각각 headers idx랑 대응
          1, // PK
          "테마가 리뉴얼 되었습니다.", // title
          "2022.06.22", // Date
          "1234", // 조회수
        ],
      },
      { isNotice: true, data: [1, "가나다라 마바사 아자차카 타파하", "2022.01.01", "123123"] },
      { isNotice: true, data: [1, "가나다라 마바사 아자차카 타파하", "2022.01.01", "123123"] },
      { isNotice: true, data: [1, "가나다라 마바사 아자차카 타파하", "2022.01.01", "123123"] },
      { isNotice: true, data: [1, "가나다라 마바사 아자차카 타파하", "2022.01.01", "123123"] },
      { isNotice: true, data: [1, "가나다라 마바사 아자차카 타파하", "2022.01.01", "123123"] },
      { isNotice: true, data: [1, "가나다라 마바사 아자차카 타파하", "2022.01.01", "123123"] },
      { isNotice: true, data: [1, "가나다라 마바사 아자차카 타파하", "2022.01.01", "123123"] },
      { isNotice: true, data: [1, "가나다라 마바사 아자차카 타파하", "2022.01.01", "123123"] },
    ],
};
`