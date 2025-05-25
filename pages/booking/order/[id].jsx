import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Calendar } from "react-calendar";
import { Dropdown, Grid } from "semantic-ui-react";
import styled, { css } from "styled-components";
import { loadTossPayments } from '@tosspayments/payment-sdk'
import {
    Button,
    Center,
    Container,
    Description,
    ImageContent,
    InfoBox,
    Section,
    Sections,
    WarningBox,
} from "../../../components/AmongStyle";
import { GridCards } from "../../../components/Cards";
import Footer from "../../../components/Footer";
import Menu from "../../../components/Menu";
import { Table } from "../../../components/Table";
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { KEY } from "../../../const";
import { toast } from "react-toastify";

// #TODO: 최적화

const TextTitle = styled(Center)`
  flex-direction: column;
  .title {
    font-weight: 700;
    font-size: 32px;
    line-height: 100%;
    letter-spacing: -0.03em;
    color: #07287c;
    margin-bottom: 58px;
  }
  @media (max-width: 450px) {
    .title {
        margin-right: auto;
        font-size: 22px;
        margin-bottom: 35px;
    }
  }
`;

const SectionTitle = styled.div`
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: -0.03em;
    color: #07287C;
    margin-top: 20px;
    padding-bottom: 14px;
    ${props => {
        if (props.center) {
            return css`
                text-align: center;
            `
        }
    }}
    @media (max-width: 450px) {
        padding-bottom: 21px;
    }
`

const TotalPrice = styled.div`
    font-weight: 700;
    font-size: 26px;
    line-height: 33px;
    text-align: right;
    letter-spacing: -0.03em;
    color: #07287C;
    margin-top: 30px;
    @media (max-width: 450px) {
        font-size: 20px;
    }
`

const CalendarWithoutSSR = dynamic(
    () => import("react-calendar"),
    { ssr: false }
)

const StyledCalendarWithoutSSR = styled(CalendarWithoutSSR)`
    border: 0px;
    width: 100%;
    .react-calendar__tile--active {
    }
    .react-calendar__tile--now {
        background-color: #eee;
        &:hover {
            background-color: #eee;
            color: #000;
        }
    }
    .react-calendar__month-view__days__day:disabled {
        background-color: #fff;
        color: #C9C9C9;
    }
`


export default function BookingOrder(props) {

    const router = useRouter();
    const [year, setYear] = useState(2022)
    const [month, setMonth] = useState((new Date()).getMonth() + 1)
    const [date, setDate] = useState((new Date()).getDate())
    const [countMale, setCountMale] = useState(0)
    const [countFemale, setCountFemale] = useState(0)
    const [data, setData] = useState({})
    const [time, setTime] = useState()
    const [amount, setAmount] = useState(0)
    const [user, setUser] = useState({loading: true})
    const [sameValue, setSameValue] = useState(false)

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        axios.get("/api/account").then(({ data }) => {
            setUser(data)
            setName(data.fullname)
            setPhone(data.phone)
            setEmail(data.email)
        })
    }, [])

    useEffect(() => {
        if(sameValue) {
            setName(user.fullname)
            setPhone(user.phone)
            setEmail(user.email)
        }
    }, [sameValue, user])

    useEffect(() => {
        if (!router.isReady) return
        axios.get("/api/product/reservation/?year=" + year + "&month=" + month + "&day=" + date + "&product_id=" + router.query.id).then(({ data }) => {
            setData(data)
        })
    }, [router.query.id, router.isReady, year, month, date])

    useEffect(() => {
        if (!router.isReady) return
        axios.post("/api/product/price/check/", {
            "num_of_man": countMale,
            "num_of_woman": countFemale,
            "start_time": time,
            "calendar_date": data.id,
            "product_option": data.product_option
         }).then(({data}) => {
            if(data.error) {
                setAmount("-")
                return
            }
            setAmount(data.amount)
         })
    }, [router.isReady, data, time, countMale, countFemale])

    const bookSubmit = () => {
        axios.post("/api/payment/check/", {
            "num_of_man": countMale,
            "num_of_woman": countFemale,
            "start_time": time,
            "calendar_date": data.id,
            "product_option": data.product_option,
            "fullname": name,
            "email": email,
            "phone": phone
         }).then((res) => {
            const url = location.protocol + "//" + location.host
            loadTossPayments(KEY).then(tossPayments => {
                // ...
                tossPayments.requestPayment('카드', { // 결제 수단 파라미터
                    // 결제 정보 파라미터
                    amount: amount,
                    orderId: res.data.order_id,
                    orderName: res.data.product_name,
                    customerName: res.data.customer_name,
                    successUrl: url + '/booking/success',
                    failUrl: url + '/booking/fail',
                })
            })

        })

        // router.push("/booking/complete/1")

    }

    const intro = data.introduce

    if (!router.isReady) return
    if(user.loading) return
    if (!user.phone) {
        toast.error("로그인 후 이용하실 수 있습니다.")
        router.push("/user/signin")
        return
    }

    const timeRange = time && (data?.remain_user_count?.filter(item => item.value === time))[0].text

    return (
        <div>
            <Menu flatten block />
            <Sections>
                <Section>
                    <Container>

                        {/* TITLE */}
                        <TextTitle>
                            <div className="title">테마 예약센터</div>
                        </TextTitle>

                        {/* Top */}
                        <Grid>
                            <Grid.Column computer={8} mobile={16}>
                                <ImageContent image={intro?.image} style={{ paddingTop: "55%" }} />
                                <SectionTitle center style={{ borderBottom: "1px solid #07297C" }}>{intro?.title}</SectionTitle>
                                <Description>
                                    <div className="desc">
                                        {intro?.description}
                                        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                                    </div>
                                    <div className="box">
                                        <div className="title">이용가능시간</div>
                                        <div className="desc">{intro?.available_time}</div>
                                        <div className="title">가격정보</div>
                                        <div className="desc">{intro?.price}</div>
                                    </div>
                                </Description>
                            </Grid.Column>
                            <Grid.Column computer={8} mobile={16}>
                                <InfoBox>
                                    <Grid>
                                        <Grid.Column computer={8} mobile={16}>
                                            <div>
                                                <div className="form_title">이용인원 입력</div>
                                                <div className="form_desc">동시 입장객 100명 초과시 예약 불가합니다.</div>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column computer={8} mobile={16}>
                                            <div className="forms">
                                                <div className="form_input">
                                                    <div className="label">남성</div>
                                                    <div className="input">
                                                        <input placeholder="인원 수" type="number" min="0" max="99" value={countMale} onChange={(e) => { (0 <= e.target.value && e.target.value <= 100) && setCountMale(e.target.value); }} />
                                                        <div>명</div>
                                                    </div>
                                                </div>
                                                <div className="form_input">
                                                    <div className="label">여성</div>
                                                    <div className="input">
                                                        <input placeholder="인원 수" type="number" min="0" max="99" value={countFemale} onChange={(e) => { (0 <= e.target.value && e.target.value <= 100) && setCountFemale(e.target.value); }} />
                                                        <div>명</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid.Column>
                                    </Grid>
                                </InfoBox>
                                <InfoBox>
                                    <StyledCalendarWithoutSSR
                                        calendarType="US"
                                        minDate={new Date()}
                                        maxDate={new Date(new Date().setMonth(new Date().getMonth() + 6))}
                                        onChange={(date) => {
                                            setYear(date.getFullYear())
                                            setMonth(date.getMonth() + 1)
                                            setDate(date.getDate())
                                        }}
                                    />
                                </InfoBox>
                                <InfoBox>
                                    <Grid>
                                        <Grid.Column computer={8} mobile={16}>
                                            <div>
                                                <div className="form_title">이용시간 입력</div>
                                                <div className="form_desc">풀장 이용시간은 {intro?.period}시간입니다.</div>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column computer={8} mobile={16}>
                                            <div className="forms">
                                                <div className="form_input">
                                                    <div className="label">시간선택</div>
                                                    <div className="input">
                                                        <Dropdown
                                                            placeholder="선택해주세요."
                                                            fluid
                                                            options={data?.remain_user_count || []}
                                                            onChange={(e, { value }) => setTime(value)}
                                                            value={time}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid.Column>
                                    </Grid>
                                </InfoBox>
                                <InfoBox>
                                    <Grid>
                                        <Grid.Column computer={6} mobile={16}>
                                            <div className="form_info">
                                                <div className="form_title">예약자 정보</div>
                                                {/* TODO */}
                                                <div className="form_check"><input type="checkbox" checked={sameValue} onClick={() => setSameValue(!sameValue)}/>&nbsp;&nbsp;회원 가입정보와 동일합니다.</div>
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column computer={10} mobile={16}>
                                            <div className="forms">
                                                <div className="form_input">
                                                    <div className="label">성명</div>
                                                    <div className="input">
                                                        <input placeholder="홍길동" style={{ width: "100%" }} id="name" onChange={e => setName(e.target.value)} value={name} readOnly={sameValue}/>
                                                    </div>
                                                </div>
                                                <div className="form_input">
                                                    <div className="label">연락처</div>
                                                    <div className="input">
                                                        <input placeholder="010-1111-2222" style={{ width: "100%" }} id="phone" type="phone" onChange={e => setPhone(e.target.value)} value={phone} readOnly={sameValue}/>
                                                    </div>
                                                </div>
                                                <div className="form_input">
                                                    <div className="label">이메일</div>
                                                    <div className="input">
                                                        <input placeholder="test@example.com" style={{ width: "100%" }} id="email" type="email" onChange={e => setEmail(e.target.value)} value={email} readOnly={sameValue}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </Grid.Column>
                                    </Grid>
                                </InfoBox>
                            </Grid.Column>
                        </Grid>

                        {/* Confirm */}
                        <>
                            <SectionTitle style={{ marginTop: 50 }}>예약내역 확인</SectionTitle>
                            <Table>
                                <tbody>
                                    <tr>
                                        <td>이용날짜</td>
                                        <td>{year}년 {month}월 {date}일</td>
                                    </tr>
                                    <tr>
                                        <td>이용종류</td>
                                        <td>{intro?.product_title}</td>
                                    </tr>
                                    <tr>
                                        <td>이용시간</td>
                                        <td>{timeRange}</td>
                                    </tr>
                                    <tr>
                                        <td>이용종목</td>
                                        <td>{intro?.product_info}</td>
                                    </tr>
                                    <tr>
                                        <td>이용인원</td>
                                        <td>남성 {countMale}인, 여성 {countFemale}인</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <TotalPrice>
                                결제 금액 : {amount.toLocaleString()} 원
                            </TotalPrice>
                        </>

                        {/* Pay */}
                        <>
                            <SectionTitle style={{ marginTop: 50 }}>결제수단 선택</SectionTitle>
                            <Table>
                                <tbody>
                                    <tr>
                                        <td>결제수단</td>
                                        <td>
                                            카드결제
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </>

                        {/* 예약시 유의사항 */}
                        <>
                            <WarningBox>
                                <div className="title">*예약시 유의사항</div>
                                <div className="desc">
                                    *2일전 취소 시 100% 공제 후 환불 / 1일전 취소 시 30% 공제 후 환불 / 당일 취소 시 50% 공제 후 환불 / 당일 미도착(노쇼) 시 환불 없음<br />
                                    *환불 시 반드시 예약 취소 요청 바랍니다.<br />
                                    *공제 기준은 영업시간 08:00 - 23:00 기준으로 합니다. 일정은 운영방침에 따라 변경 될 수 있습니다.<br />
                                    *상세 규정은 홈페이지 하단 시설이용규정 확인바랍니다.
                                </div>
                            </WarningBox>
                        </>


                        <Center style={{ marginTop: 50 }}>
                            <Button onClick={bookSubmit}>예약하기</Button>
                        </Center>

                    </Container>
                </Section>
            </Sections>
            <Footer />
        </div>
    );
}
