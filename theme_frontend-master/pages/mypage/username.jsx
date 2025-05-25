import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Checkbox, Input } from "semantic-ui-react";
import styled from "styled-components";
import {
  Button,
  Center,
  Container,
  Section,
  Sections,
} from "../../components/AmongStyle";
import { Form } from "../../components/Form";
import { TextTable } from "../../components/Table";
import UserLayout from "../../layouts/custom/UserLayout.jsx";

const SignupBackground = styled.div`
  background-image: url("/next/user/signup_bg.png");
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: -1000000;
`;

const SigninForm = styled(Form)`
  background-color: #fff !important;
  padding: 60px;
  .form {
    margin-bottom: 20px;
  }
`;

export default function UserSignin(props) {
  const router = useRouter();
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [fullname, setFullname] = useState("")
  const [birthday, setBirthday] = useState("")
  useEffect(() => {
    axios.get("/api/account/")
    .then(({data}) => {
      setUser(data)
      setFullname(data.fullname)
      setBirthday(data.birthday)
      setIsLoading(false)
    })
    .catch(() => {})
  }, [])
  const submit = () => {
    axios.put("/api/account/userinfo/", {
      fullname: fullname,
      birthday: birthday
    }).then(({data}) => {
      router.push("/")
    }).catch(e => {
      toast.error(e.response.data.error)
    })
}
  if(isLoading) return <></>
  return (
    <UserLayout id="mypage">
      <SignupBackground />
      <Sections>
        <Section>
          <Container>
            <Center>
              <SigninForm>
                <div className="title">추가정보입력</div>
                <div className="form">
                  <div>
                    <div className="label required">이름</div>
                    <div>
                      <Input fluid placeholder="홍길동" value={fullname} onChange={(e) => setFullname(e.target.value)} disabled={!!fullname}/>
                    </div>
                  </div>
                  <div>
                    <div className="label required">생년월일</div>
                    <div>
                      <Input fluid placeholder="1990-01-01"  value={birthday} onChange={(e) => setBirthday(e.target.value)} disabled={!!birthday}/>
                    </div>
                  </div>
                </div>
                <div>
                  <Button fluid onClick={submit}>완료하기</Button>
                </div>
              </SigninForm>
            </Center>
          </Container>
        </Section>
      </Sections>
    </UserLayout>
  );
}
