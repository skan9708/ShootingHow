import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Icon } from "semantic-ui-react";
import styled, { css } from "styled-components";

const Styled = styled.div`
    color: #FFFFFF;
    a { color: #FFFFFF; }
    ${props => {
        if (!props.block) {
            return css`
                position: absolute;
                top: 0px;
            `
        }
    }}
    ${props => {
        if (props.flatten) {
            return css`
                color: #000;
                a { color: #000; }
                border-bottom: 1px solid #C9C9C9;
            `
        }
    }}

    display: flex;
    width: 100%;
    height: 80px;
    .center {
        width: 1400px;
        margin: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .logo {
            width: 120px;
            img {
                cursor: pointer;
            }
        }
        >div {
            display: flex;
        }
        >.items {
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: -0.03em;
            >a {
                margin-right: 50px;
            }
        }
        >.right {
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
            >div {
                margin-right: 29px;
                &:last-child {
                    margin-right: 0px;
                }
                &.hamburger {
                    font-size: 25px;
                }
            }
        }
    }
    @media (max-width: 450px) {
        background-color: #FFFFFF;
        color: #000;
        .center {
            padding: 0px 20px;
        }
        .items {
            display: none !important;
        }
        .right {
            display: none !important;
        }
        .right_mobile {
            display: block !important;
            font-size: 20px;
        }
    }
`;

export default function Menu(props) {
    const router = useRouter()
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        axios.get("/api/account/")
        .then(({data}) => {
            setUser(data)
            if(!data.fullname) {
                router.push("/mypage/username")
            }
            setIsLoading(false)
        })
        .catch(() => {})
    }, [])
    const logout = () => {
        axios.delete("/api/account/logout/")
        .then(() => {
            router.push("/user/signin")
        })
        .catch(() => {
            router.push("/user/signin")
        })
    }
    return (
        <Styled block={props.block} flatten={props.flatten}>
            <div className="center">
                <div className="logo"><img src="/next/logo.png" onClick={() => router.push("/")} /></div>
                <div className="items">
                    <Link href="/intro">소개</Link>
                    <Link href="/pricing">요금안내</Link>
                    <Link href="/booking">예약센터</Link>
                    <Link href="/customer">고객센터</Link>
                    {(user?.role?.id === "normal") && (
                        <Link href="/apply">강사신청</Link>
                    )}
                    {(user?.role?.id === "waiting_instructor_request" || user?.role?.id === "instructor" || user?.role?.id === "registered_instructor") && (
                        <Link href="/apply/complete">강사신청</Link>
                    )}
                </div>
                <div className="right">
                    {
                        (!!!user?.join_date) && (
                            <div style={{ cursor: "pointer" }} onClick={() => router.push("/user/signin")}><Icon name="user" /> 로그인</div>
                        )
                    }
                    {
                        (
                            !!user?.join_date && (
                                <>
                                    <Link href="/mypage">마이페이지</Link>
                                    <div style={{ cursor: "pointer", marginLeft: 20, marginRight: 20 }} onClick={logout}><Icon name="sign-out" /> 로그아웃</div>
                                </>
                            )
                        )
                    }
                    {/* <div className="hamburger"><Icon name="bars" /></div> */}
                </div>
                <div className="right_mobile" style={{display: "none"}}>
                    <div className="hamburger" onClick={() => router.push("/menu")}><Icon name="bars" /></div>
                </div>
            </div>
        </Styled>
    );
}
