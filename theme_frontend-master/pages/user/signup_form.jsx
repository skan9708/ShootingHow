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
  const router = useRouter()
  const [user, setUser] = useState({})
  useEffect(() => {
    axios.get("/api/account/")
    .then(({data}) => {
      setUser(data)
    })
    .catch(() => {
      toast.error("정보를 불러올 수 없습니다.")
      router.push("/")
    })
  }, [])
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const completeHandler = () => {
    if(password !== password2) {
      toast.error("입력하신 두 비밀번호가 서로 일치하지 않습니다.")
      return
    }
    axios.post("/api/account/pass/complete/", {
      "password": password
    })
    .then(() => {
      router.push("/")
    })
    .catch((e) => {
      toast.error(e.response.data.error)
    })
  }
  return (
    <UserLayout id="mypage">
      <SignupBackground />
      <Sections>
        <Section>
          <Container>
            <Center>
              <SigninForm>
                <div className="title">회원가입</div>
                <div className="form">
                  <div>
                    <div className="label">이름</div>
                    <div>
                      <Input fluid placeholder="홍길동" value={user.fullname} disabled/>
                    </div>
                  </div>
                  <div>
                    <div className="label">생년월일</div>
                    <div>
                      <Input fluid placeholder="1990.01.01" value={user.birthday} disabled />
                    </div>
                  </div>
                  <div>
                    <div className="label">휴대폰 번호</div>
                    <div>
                      <Input fluid placeholder="휴대폰 번호를 입력해주세요." value={user.phone} disabled/>
                    </div>
                  </div>
                  <div>
                    <div className="label required">비밀번호</div>
                    <div>
                      <Input
                        fluid
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="label required">비밀번호 확인</div>
                    <div>
                      <Input
                        fluid
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요."
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* <div className="error">
                    아이디 또는 비밀번호를 잘못 입력했습니다.
                    <br />
                    입력하신 내용을 다시 확인해주세요.
                  </div> */}
                </div>
                <div>
                  <Button fluid onClick={completeHandler}>가입 완료</Button>
                </div>
              </SigninForm>
            </Center>
          </Container>
        </Section>
      </Sections>
    </UserLayout>
  );
}
