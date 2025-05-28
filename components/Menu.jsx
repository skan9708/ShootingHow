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
        align-items: flex-start;
        padding-top: 30px;
        .logo {
            width: 120px;
            margin-top: -65px;
            img {
                cursor: pointer;
            }
        }
        >div {
            display: flex;
        }
        >.items {
            font-style: normal;
            font-weight: 700;
            font-size: 20px;
            line-height: 20px;
            letter-spacing: -0.03em;
            >a {
                margin-right: 50px;
            }
        }
        >.right {
            font-weight: 700;
            font-size: 20px;
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
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authStatusChecked, setAuthStatusChecked] = useState(false);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        setAuthStatusChecked(true);
    }, []);

    const logout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        setAuthStatusChecked(true);
        router.push("/user/signin");
    };

    return (
        <Styled block={props.block} flatten={props.flatten}>
            <div className="center">
                {!props.hideElements && <div className="logo"><img src="/next/logo.png" onClick={() => router.push("/")} /></div>}
                {!props.hideElements && (
                    <div className="items">
                        <Link href="/booking">예약하기</Link>
                    </div>
                )}
                {!props.hideElements && authStatusChecked && (
                    <div className="right">
                        {isLoggedIn ? (
                            <div style={{ cursor: "pointer" }} onClick={() => router.push("/mypage/booked/detail/temp-id")}>마이페이지</div>
                        ) : (
                            <div style={{ cursor: "pointer" }} onClick={() => router.push("/user/signin")}>로그인</div>
                        )}
                    </div>
                )}
                <div className="right_mobile" style={{display: "none"}}>
                    <div className="hamburger" onClick={() => router.push("/menu")}><Icon name="bars" /></div>
                </div>
            </div>
        </Styled>
    );
}
