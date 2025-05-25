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
  const phoneAuth = () => {
    window.IMP.init("imp02510670")
    window.IMP.certification({
      merchant_uid: `mid_${new Date().getTime()}`,  // 주문번호
    }, (res) => {
      if(res.success) {
        axios.post("/api/account/pass/", res)
        .then((res) => {
          router.push("/user/signup_form")
        })
        .catch((e) => {
          toast.error(e.response.data.error)
        })
      } else {
        toast.error("본인인증에 실패하였습니다.")
      }
    })
  }
  useEffect(() => {
    phoneAuth()
  }, [])
  return (
    <UserLayout id="mypage">
      <SignupBackground />
      <Sections>
        <Section>
          <Container>
            <Center>
              <div>
                <Button fluid onClick={phoneAuth}>본인인증</Button>
              </div>
            </Center>
          </Container>
        </Section>
      </Sections>
    </UserLayout>
  );
}
