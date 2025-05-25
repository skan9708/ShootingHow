import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Checkbox, Radio } from "semantic-ui-react";
import styled from "styled-components";
import {
    Button,
    Center,
    Container,
    Section,
    Sections,
    WarningBox,
} from "../../../components/AmongStyle";
import { ShadowBox } from "../../../components/ShadowBox";
import { TextTable } from "../../../components/Table";
import ApplyLayout from "../../../layouts/custom/ApplyLayout";
import { loadTossPayments } from '@tosspayments/payment-sdk'
import { toast } from "react-toastify";
import { KEY } from "../../../const";

const Title = styled.div`
  font-weight: 500;
  font-size: 24px;
  letter-spacing: -0.03em;
  color: #07287c;
  margin-top: 30px;
`;

const Description = styled.div`
  margin-top: 20px;
  font-weight: 400;
  font-size: 18px;
  line-height: 26px;
  text-align: center;
  letter-spacing: -0.03em;
  color: #000000;
`;

const SubTitle = styled.div`
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: -0.03em;
    color: #07287C;
    margin-bottom: 10px;
    @media (max-width: 450px) {
        font-size: 20px;
    }
`

export default function ApplyForm(props) {
    const router = useRouter();
    const [user, setUser] = useState({ loading: true })
    const [radio, setRadio] = useState("quarter")
    const [data, setData] = useState(null)

    let status = user?.role?.id === "waiting_instructor_request" ? "REQUESTED" : "SUCCESS"

    const prices = {
        "quarter": 80000,
        "year": 240000
    }

    const pay = () => {
        loadTossPayments(KEY).then(tossPayments => {
            const url = location.protocol + "//" + location.host
            tossPayments.requestPayment('카드', { // 결제 수단 파라미터
                // 결제 정보 파라미터
                amount: data.amount,
                orderId: data.order_id,
                orderName: data.product_name,
                // customerName: data.customer_mame +"A",
                successUrl: url + '/apply/payment/success',
                failUrl: url + '/apply/payment/fail',
            })
        })
    }

    const getData = (value) => {
        axios.get("/api/account/register_instructor_check/?period=" + value)
        .then((res) => {
            setData(res.data)
        })
        .catch(e => {
            toast.error(e.response.data.error)
        })
    }

    const onChangeHandler = (e, {value}) => {
        setRadio(value)
        getData(value)
    }

    useEffect(() => {
        axios.get("/api/account/").then((res) => setUser(res.data)).catch((e) => {
            toast.error(e.response.data.error)
            router.push("/")
            return
        })
        getData(radio)
    }, [])

    if (user.loading) return

    return (
        <ApplyLayout step="2">
            <Sections>
                <Section>
                    <Container>
                        <Center>

                            <div style={{ width: "100%", maxWidth: "900px" }}>
                                <WarningBox style={{ textAlign: "center" }}>
                                    <img
                                        src="/next/apply/success.svg"
                                        style={{ maxWidth: "300px", width: "100%" }}
                                    />
                                    <Title>등록강사 신청하기</Title>
                                    <Description>
                                        등록강사를 신청하여 더 많은 혜택을 받아보세요!<br/>
                                        연회비 납부시 인원수 할인 혜택을 제공해드립니다.
                                    </Description>
                                </WarningBox>
                                <br />
                                <br />
                                <br />
                                <SubTitle>연회비 결제</SubTitle>
                                <TextTable>
                                    <tbody>
                                        <tr>
                                            <td className="left header">연회비 가격</td>
                                            <td>
                                                <Radio label="분기(90일)" name='radioGroup' checked={radio === "quarter"} value="quarter" onChange={onChangeHandler}/>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <Radio label="1년(365일)" name='radioGroup' checked={radio === "year"} value="year" onChange={onChangeHandler}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="left header">혜택</td>
                                            <td>결제 시 (전체인원수-1)로 결제</td>
                                        </tr>
                                    </tbody>
                                </TextTable>
                                <br />
                                <SubTitle style={{textAlign: "right"}}>결제 금액 : {data?.amount?.toLocaleString()} 원</SubTitle>
                                <br />
                                <Center>
                                    <Button onClick={pay}>결제</Button>
                                </Center>
                            </div>

                        </Center>
                    </Container>
                </Section>
            </Sections>
        </ApplyLayout>
    );
}
