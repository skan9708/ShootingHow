import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";
import { toast } from "react-toastify";
import { Checkbox, Input } from "semantic-ui-react";
import styled from "styled-components";
import {
  Button,
  Center,
  Container,
  Section,
  Sections,
} from "../../../components/AmongStyle";
import { Form } from "../../../components/Form";
import { TextTable } from "../../../components/Table";
import UserLayout from "../../../layouts/custom/UserLayout.jsx";

const SigninForm = styled(Form)`
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
        axios.post("/api/account/pass/reset/", res)
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
  return (
    <UserLayout id="mypage">
      <Sections>
        <Section>
          <Container>
            <Center>
              <SigninForm>
                <div className="title">비밀번호 찾기</div>
                <div className="form">
                  <div>
                    {/* <div className="label required">휴대폰 번호</div>
                    <div>
                      <Input
                        fluid
                        placeholder="휴대폰 번호를 입력해주세요."
                      />
                    </div> */}
                  </div>
                </div>
                <div>
                  <Button fluid onClick={phoneAuth}>본인인증</Button>
                {/* <Button fluid onClick={() => router.push("/user/lost_password/sent")}>이메일 발송</Button> */}
                </div>
              </SigninForm>
            </Center>
          </Container>
        </Section>
      </Sections>
    </UserLayout>
  );
}
