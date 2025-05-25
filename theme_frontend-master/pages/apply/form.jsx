import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Checkbox } from "semantic-ui-react";
import {
  Button,
  Center,
  Container,
  Section,
  Sections,
} from "../../components/AmongStyle";
import { ShadowBox } from "../../components/ShadowBox";
import { TextTable } from "../../components/Table";
import ApplyLayout from "../../layouts/custom/ApplyLayout";

export default function ApplyForm(props) {
  const router = useRouter();
  const [user, setUser] = useState({ loading: true })
  const [files, setFiles] = useState(null)
  const submit = (e) => {
    const data = new FormData();
    const files = document.getElementById("file").files
    for(let i=0;i<files.length;i++) {
      data.append("licenses[]", files[i])
    }
    
    // data.append("email", e.target.email.value)
    // data.append("phone", e.target.phone.value)
    // data.append("birth", e.target.birth.value)
    // data.append("name", e.target.name.value)
    axios
      .post("/api/account/instructor/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        router.push("/apply/complete");
      })
      .catch((e) => {
        const err = e?.response?.data?.error;
        if (err) {
          toast.error(err);
        } else {
          toast.error("알 수 없는 에러가 발생했습니다.");
          console.log(e);
        }
      });
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  useEffect(() => {
    axios.get("/api/account/").then((res) => setUser(res.data)).catch((e) => {
      toast.error(e.response.data.error)
      router.push("/")
      return
    })
  }, [])

  if (user.loading) return
  return (
    <ApplyLayout step="1">
      <Sections>
        <Section>
          <Container>
            <TextTable style={{ maxWidth: 900, margin: "auto" }}>
              <tbody>
                {/* <tr>
                    <td className="header left" style={{ width: 200 }}>
                      이메일
                    </td>
                    <td>
                      <input placeholder="이메일을 입력해주세요." id="email" readOnly/>
                    </td>
                  </tr> */}
                <tr>
                  <td className="header require left">이름</td>
                  <td>
                    <input placeholder="이름을 입력해주세요." id="name" readOnly value={user.fullname} />
                  </td>
                </tr>
                <tr>
                  <td className="header left">휴대폰 번호</td>
                  <td>
                    <input placeholder="010-1234-5678" id="phone" readOnly value={user.phone} />
                  </td>
                </tr>
                <tr>
                  <td className="header left">생년월일</td>
                  <td>
                    <input placeholder="1990-01-01" id="birth" readOnly value={user.birthday} />
                  </td>
                </tr>
                <tr>
                  <td className="header require left">자격증 첨부</td>
                  <td>
                    <input type="file" id="file" multiple/>
                  </td>
                </tr>
              </tbody>
            </TextTable>
            <br />
            <br />
            <Center>
              <Button onClick={submit}>제출</Button>
            </Center>
          </Container>
        </Section>
      </Sections>
    </ApplyLayout>
  );
}
