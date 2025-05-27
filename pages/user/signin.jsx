import Link from "next/link";
import { useRouter } from "next/router";
import { Checkbox, Input } from "semantic-ui-react";
// import KaKaoLogin from 'react-kakao-login'; // 카카오 로그인 import 주석 처리
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
import axios from 'axios'
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

const SigninForm = styled(Form)`
  .form {
    margin-bottom: 20px;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    .sep {
      display: inline-block;
      width: 2px;
      height: 12px;
      margin: 0px 10px;
      position: relative;
      top: 1px;
      background-color: #c9c9c9;
    }
    a {
      color: #07287c;
    }
  }
  .register {
    margin-top: 20px;
    margin-bottom: 30px;
    a {
      font-weight: bold;
      color: #07287c;
    }
  }
`;

export default function UserSignin(props) {
  const router = useRouter();
  const [error, setError] = useState("")
  const onSubmitHandler = (e) => {
    const username = e.target.username.value
    const password = e.target.password.value
    axios.post("/api/account/login/", { phone: username, password: password })
      .then((res => {
        router.push("/")
      }))
      .catch((e => {
        setError(e.response.data.error)
      }))
    e.preventDefault()
  }
  // const kakaoLogin = (data) => { // 카카오 로그인 핸들러 주석 처리
  //   axios.post("/api/account/kakao/login/callback/", {
  //     access_token: data.response.access_token
  //   })
  //   .then(() => {
  //     router.push("/")
  //   })
  //   .catch((e) => {
  //     toast.error(e.response.data.error)
  //   })
  // }
  return (
    <UserLayout id="mypage">
      <Sections>
        <Section>
          <Container>
            <Center>
              <SigninForm>
                <form onSubmit={onSubmitHandler}>
                  <div className="title">로그인</div>
                  <div className="form">
                    <div>
                      <div className="label required">휴대폰 번호</div>
                      <div>
                        <Input
                          fluid
                          placeholder="휴대폰 번호를 입력해주세요."
                          id="username"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="label required">비밀번호</div>
                      <div>
                        <Input
                          fluid
                          type="password"
                          placeholder="비밀번호를 입력해주세요."
                          id="password"
                        />
                      </div>
                    </div>
                    <div className="error">
                      {error}
                    </div>
                  </div>
                  <div className="buttons">
                    <div>
                      <Checkbox label="자동로그인 유지" />
                    </div>
                    <div>
                      {/* <Link href="/user/lost_phone">휴대폰 번호 찾기</Link>
                      <span className="sep"></span> */}
                      <Link href="/user/lost_password">비밀번호 찾기</Link>
                    </div>
                  </div>
                  <div>
                    <Button fluid>로그인</Button>
                  </div>
                  <div className="register">
                    아직 회원이 아니신가요?{" "}
                    <Link href="/user/signup">회원가입</Link>
                  </div>
                </form>
                {/* <div> // 카카오 로그인 버튼 부분 주석 처리
                  <KaKaoLogin
                    token={'7c29c0c660be5830729da2b90eda5f71'}
                    onSuccess={kakaoLogin}
                    onFail={() => {
                      toast.error("알 수 없는 에러가 발생했습니다.")
                    }}
                    onLogout={() => {
                    }}
                    render={({ onClick }) => {
                      return (
                        <Button fluid kakao onClick={onClick} 침ㄴ>
                          <img src="/next/kakao.png" className="icon" />
                          카카오톡으로 시작하기
                        </Button>
                      )
                    }}
                  />
                </div> */}
              </SigninForm>
            </Center>
          </Container>
        </Section>
      </Sections>
    </UserLayout>
  );
}
