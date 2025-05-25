import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Center,
  Container,
  Section,
  Sections,
} from "../../components/AmongStyle";
import { TextTable } from "../../components/Table";
import MypageLayout from "../../layouts/custom/MypageLayout";

export default function BookingIndex(props) {
  const router = useRouter();
  const [user, setUser] = useState({loading:true})
  useEffect(() => {
    axios
      .get("/api/account/")
      .then(({ data }) => {
        setUser(data);
      })
      .catch((e) => {
        toast.error(e.response.data.error)
        router.push("/")
        return
        });
  }, []);
  if(user.loading) return <></>
  return (
    <MypageLayout id="mypage">
      <Sections>
        <Section>
          <Container>
            <TextTable style={{ maxWidth: 900, margin: "auto" }}>
              <tbody>
                <tr>
                  <td className="header left" style={{ width: 200 }}>
                    이름
                  </td>
                  <td>
                    <input value={user.fullname} readOnly />
                  </td>
                </tr>
                <tr>
                  <td className="header require left">생년월일</td>
                  <td>
                    <input value={user.birthday} readOnly />
                  </td>
                </tr>
                <tr>
                  <td className="header left">회원등급</td>
                  <td>
                    <input value={user.role.text} readOnly />
                  </td>
                </tr>
              </tbody>
            </TextTable>
            <Center style={{ marginTop: 100 }}>
              <Button onClick={() => router.push("/mypage/change_password")}>
                비밀번호 변경하기
              </Button>
            </Center>
          </Container>
        </Section>
      </Sections>
    </MypageLayout>
  );
}
