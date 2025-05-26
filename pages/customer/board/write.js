import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import {
  Button,
  Center,
  Container,
  Right,
  Section,
  Sections,
  StyledPagination,
  Textarea,
} from "../../../components/AmongStyle";
import { TextTable } from "../../../components/Table";
import CustomerLayout from "../../../layouts/custom/CustomerLayout";

export default function Customer() {
  const router = useRouter();
  const [data, setData] = useState({});
  const reload = () => {
    if(!router.query.id) return
    axios
      .get("/api/article/instructor/" + router.query.id)
      .then((res) => {
        setData(res.data);
      })
  };
  const onSubmitHandler = (e) => {
    const data = new FormData();
    data.append("title", e.target.title.value);
    data.append("content", e.target.content.value);
    data.append("attachments", e.target.file_1.files[0]);
    data.append("attachments", e.target.file_2.files[0]);
    data.append("attachments", e.target.file_3.files[0]);
    if(router.query.id) {
      axios
        .put("/api/article/instructor/" + router.query.id, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          router.push("/customer/board/view/" + res.data.id)
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
    }
    else{
      axios
        .post("/api/article/instructor/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          router.push("/customer/board/view/" + res.data.id)
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
    }
    e.preventDefault();
  };
  useEffect(() => {
    reload()
  }, [])
  return (
    <CustomerLayout id="board">
      <Sections>
        <Section>
          <Container>
            <form onSubmit={onSubmitHandler}>
              <TextTable>
                <tbody>
                  <tr>
                    <td className="header" style={{ width: 200 }}>
                      제목
                    </td>
                    <td>
                      <Input
                        id="title"
                        fluid
                        maxLength={30}
                        placeholder="제목을 입력해주세요.(30자 이내)"
                        defaultValue={data.title}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="header">내용</td>
                    <td>
                      <Textarea
                        id="content"
                        placeholder="내용을 입력해주세요. (1000자 이내)"
                        defaultValue={data.content}
                      ></Textarea>
                    </td>
                  </tr>
                  <tr>
                    <td className="header">첨부파일</td>
                    <td style={{ padding: "10px 20px" }}>
                      <div>
                        <input type="file" id="file_1" />
                      </div>
                      <div style={{ margin: "10px 0px" }}>
                        <input type="file" id="file_2" />
                      </div>
                      <div>
                        <input type="file" id="file_3" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </TextTable>
              <br />
              <Right>
                <Button fit>작성하기</Button>
              </Right>
            </form>
          </Container>
        </Section>
      </Sections>
    </CustomerLayout>
  );
}
