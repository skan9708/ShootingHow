import axios from "axios";
import { useRouter } from "next/router";
import { Input } from "semantic-ui-react";
import { ToastContainer, toast } from 'react-toastify';
import {
  Button,
  Center,
  Container,
  Section,
  Sections,
} from "../../../components/AmongStyle";
import { Form } from "../../../components/Form";
import MypageLayout from "../../../layouts/custom/MypageLayout";

export default function BookingIndex(props) {
  const router = useRouter();
  const onChangePasswordHandler = (e) => {
    const current_password = e.target.current_password.value
    const password = e.target.password.value
    const password_check = e.target.password_check.value
    if(password !== password_check) {
      toast.error("새로운 비밀번호와 재입력한 비밀번호가 서로 같지 않습니다.")
      e.preventDefault()
      return
    }
    axios.post("/api/account/change_password/", {
      "current_password": current_password,
      "password": password
    }).then((res) => {
      toast.success("비밀번호가 변경되었습니다.")
      router.push("/mypage")
    }).catch(e => {
      if(e.response.data.error) {
        toast.error(e.response.data.error)
        return
      }
      toast.error("알 수 없는 에러가 발생했습니다.")
    })
    e.preventDefault()
    return false;
  }
  return (
    <MypageLayout id="mypage">
      <Sections>
        <Section>
          <Container>
            <Center>
              <form onSubmit={onChangePasswordHandler}>
                <Form>
                  <div className="title">비밀번호 변경</div>
                  <div className="form">
                    <div>
                      <div className="label required">현재 비밀번호</div>
                      <div>
                        <Input
                          fluid
                          type="password"
                          placeholder="기존 비밀번호를 입력해주세요."
                          id="current_password"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="label required">새로운 비밀번호</div>
                      <div>
                        <Input
                          fluid
                          type="password"
                          placeholder="새로운 비밀번호를 입력해주세요."
                          id="password"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="label required">
                        새로운 비밀번호 재입력
                      </div>
                      <div>
                        <Input
                          fluid
                          type="password"
                          placeholder="비밀번호를 다시 입력해주세요."
                          id="password_check"
                        />
                      </div>
                    </div>
                  </div>
                  <Button>비밀번호 변경</Button>
                </Form>
              </form>
            </Center>
          </Container>
        </Section>
      </Sections>
    </MypageLayout>
  );
}
