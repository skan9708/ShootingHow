import Head from "next/head";
import dynamic from 'next/dynamic'
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";

const SignupBackground = styled.div`
  background-image: url("/next/user/signup_bg.png");
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: -1000000;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
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
  // const phoneAuth = () => {
  //   window.IMP.init("imp02510670")
  //   window.IMP.certification({
  //     merchant_uid: `mid_${new Date().getTime()}`,  // 주문번호
  //   }, (res) => {
  //     if(res.success) {
  //       axios.post("/api/account/pass/", res)
  //       .then((res) => {
  //         router.push("/user/signup_form")
  //       })
  //       .catch((e) => {
  //         toast.error(e.response.data.error)
  //       })
  //     } else {
  //       toast.error("본인인증에 실패하였습니다.")
  //     }
  //   })
  // }
  useEffect(() => {
    // phoneAuth()
    // router.push("/user/signup_form"); // 리다이렉트 제거
  }, [router])
  return (
    <UserLayout id="mypage" hideElements={true}>
      <SignupBackground />
      <Sections>
        <Section>
          <Container>
            <Center>
              <SigninForm>
                <div className="title">회원가입</div>
                <div className="form">
                  <div>
                    <div className="label required">이름</div>
                    <div>
                      <Input fluid placeholder="홍길동" />
                    </div>
                  </div>
                  <div>
                    <div className="label required">생년월일</div>
                    <div>
                      <Input fluid placeholder="1990.01.01" />
                    </div>
                  </div>
                  <div>
                    <div className="label required">휴대폰 번호</div>
                    <div>
                      <Input fluid placeholder="휴대폰 번호를 입력해주세요." />
                    </div>
                  </div>
                  <div>
                    <div className="label required">이메일</div>
                    <div>
                      <Input
                        fluid
                        type="email"
                        placeholder="이메일을 입력해주세요."
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
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Button fluid onClick={() => {
                    localStorage.setItem('isLoggedIn', 'true'); // localStorage에 로그인 상태 저장
                    toast.success("회원가입이 완료되었습니다.");
                    router.push("/");
                  }}>회원가입 완료</Button>
                </div>
              </SigninForm>
            </Center>
          </Container>
        </Section>
      </Sections>
    </UserLayout>
  );
}
