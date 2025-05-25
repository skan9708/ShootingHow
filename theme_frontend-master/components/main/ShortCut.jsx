import { useRouter } from "next/router";
import styled from "styled-components";
import { Card, Container,  Title } from "../AmongStyle";

const Styled = styled.div`
    padding: 100px 0px;
    @media (max-width: 450px) {
        padding: 0px;
    }
`

const Cards = styled.div`
  display: flex;
  width: 100%;
  height: 30vw;
  @media (max-width: 450px) {
    height: auto;
    padding: 0px 20px;
    flex-direction: column;
    >div {
        padding: 30px 0px;
        .card_title {
            font-size: 25px !important;
            margin-bottom: 15px;
        }
        .icon_btn {
            width: 36px;
        }
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0px;
        }
    }
  }
`;

export default function ShortCut(props) {
    const router = useRouter()
    return (
        <Styled>
            <Container>
                <Title>
                    <div>테마를 통해 해양 액티비티<br className="mobile"/>체험 스포츠를 위한</div>
                    <div>다양한 서비스를 경험해보세요.</div>
                </Title>
            </Container>
            <Cards>
                <Card
                    image="/next/main/cards/1.png"
                    hover="/next/main/cards/1_hover.png"
                    onClick={() => router.push("/customer/board")}
                >
                    <div className="card_title">강사 게시판</div>
                    <div>
                        <img src="/next/images/circle_right.svg" className="icon_btn"/>
                    </div>
                </Card>
                <Card
                    image="/next/main/cards/2.png"
                    hover="/next/main/cards/2_hover.png"
                    onClick={() => router.push("/apply")}
                >
                    <div className="card_title">강사 신청</div>
                    <div>
                        <img src="/next/images/circle_right.svg" className="icon_btn"/>
                    </div>
                </Card>
                <Card
                    image="/next/main/cards/3.png"
                    hover="/next/main/cards/3_hover.png"
                    onClick={() => router.push("/pricing/training")}
                >
                    <div className="card_title">교육비 안내</div>
                    <div>
                        <img src="/next/images/circle_right.svg" className="icon_btn"/>
                    </div>
                </Card>
                <Card
                    image="/next/main/cards/4.png"
                    hover="/next/main/cards/4_hover.png"
                    onClick={() => router.push("/booking")}
                >
                    <div className="card_title">예약센터</div>
                    <div>
                        <img src="/next/images/circle_right.svg" className="icon_btn"/>
                    </div>
                </Card>
            </Cards>
        </Styled>
    )
}