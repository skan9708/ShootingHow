import Link from "next/link";
import { useRouter } from "next/router";
import { Checkbox, Input } from "semantic-ui-react";
import styled from "styled-components";
import {
  Button,
  Center,
  Container,
  Section,
  Sections,
} from "../../../../components/AmongStyle";
import { Form } from "../../../../components/Form";
import { TextTable } from "../../../../components/Table";
import UserLayout from "../../../../layouts/custom/UserLayout.jsx";

const SigninForm = styled(Form)`
  .form {
    margin-bottom: 20px;
  }
`;

export default function UserSignin(props) {
  const router = useRouter();
  return (
    <UserLayout id="mypage">
      <Sections>
        <Section>
          <Container>
            <Center>
              <SigninForm>
                <div className="title">비밀번호 변경</div>
                <div className="form">
                <div>
                    <div className="label required">새로운 비밀번호</div>
                    <div>
                      <Input
                        fluid
                        placeholder="새로운 비밀번호를 입력해주세요."
                      />
                    </div>
                  </div>
                  <div>
                    <div className="label required">새로운 비밀번호 재입력</div>
                    <div>
                      <Input
                        fluid
                        placeholder="새로운 비밀번호를 다시 입력해주세요."
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Button fluid onClick={() => router.push("/user/signin")}>비밀번호 변경</Button>
                </div>
              </SigninForm>
            </Center>
          </Container>
        </Section>
      </Sections>
    </UserLayout>
  );
}
