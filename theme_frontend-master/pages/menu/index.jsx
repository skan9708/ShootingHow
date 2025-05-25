import styled from "styled-components"
import img_man from "./man.svg"
import img_close from "./close.svg"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"
import { Icon } from "semantic-ui-react"

const Styled = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    .top {
        display: flex;
        align-items: center;
        padding: 17px;
        .logo {
            margin-right: auto;
        }
        .btn_login {
            img {
                margin-right: 6px;
            }
            font-weight: 500;
            font-size: 14px;
            line-height: 18px;
        }
        .btn_close {
            margin-left: 20px;
            cursor: pointer;
        }
    }
    .body {
        margin-top: min(calc(50vh - 50%), 50px);
        margin-bottom: auto;
        .title {
            font-style: normal;
            font-weight: 700;
            font-size: 18px;
            line-height: 30px;
            text-align: center;
            color: #07287C;
            padding: 15px 0px;
        }
        .items {
            background: #F7F9FE;
            text-align: center;
            transition: 0.5s;
            >div {
                padding: 5px 0px;
                font-weight: 400;
                font-size: 15px;
                line-height: 30px;
                color: #383838;
            }
            height: 0px;
            overflow-y: hidden;
            &.active {
                border-top: 1px solid #07287C;
                padding: 5px 0px;
                height: auto;
           }
           &.active.items_2 {
                height: calc(40px * 2 + 15px); 
            }
            &.active.items_4 {
                height: calc(40px * 4 + 15px); 
            }
        }
    }
`

export default function Menupage(props) {
    const router = useRouter();
    const [user, setUser] = useState({})
    const [active, setActive] = useState("intro")
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        axios.get("/api/account/")
            .then(({ data }) => {
                setUser(data)
                if (!data.fullname) {
                    router.push("/mypage/username")
                }
                setIsLoading(false)
            })
            .catch(() => { })
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
    const toggle = (id) => {
        setActive(id)
    }
    return (
        <Styled>
            <div className="top">
                <img src="/next/logo.png" onClick={() => router.push("/")} className="logo" />
                {
                    (!!!user?.join_date) && (
                        <>
                            <div className="btn_login" onClick={() => router.push("/user/signin")}>
                                <img src={img_man.src} />
                                로그인
                            </div>
                        </>
                    )
                }
                {
                    (
                        !!user?.join_date && (
                            <>
                                <div className="btn_login" onClick={() => router.push("/mypage")}>
                                    <img src={img_man.src} />
                                    마이페이지
                                </div>
                            </>
                        )
                    )
                }
                <div className="btn_close" onClick={() => router.back()}>
                    <img src={img_close.src} />
                </div>
            </div>
            <div className="body">
                <div>
                    <div className="title" onClick={() => toggle("intro")}>소개</div>
                    <div className={("intro" == active) ? "items active items_4" : "items"}>
                        <div onClick={() => router.push("/intro")}>소개</div>
                        <div onClick={() => router.push("/intro/members")}>구성원</div>
                        <div onClick={() => router.push("/intro/place")}>시설안내</div>
                        <div onClick={() => router.push("/intro/roadmap")}>오시는길</div>
                    </div>
                </div>
                <div>
                    <div className="title" onClick={() => toggle("pricing")}>요금안내</div>
                    <div className={("pricing" == active) ? "items active items_2" : "items"}>
                        <div onClick={() => router.push("/pricing")}>잠수풀 이용료</div>
                        <div onClick={() => router.push("/pricing/training")}>교육비 안내</div>
                    </div>
                </div>
                <div>
                    <div className="title" onClick={() => router.push("/booking")}>예약센터</div>
                </div>
                <div>
                    <div className="title" onClick={() => toggle("customer")}>고객센터</div>
                    <div className={("customer" == active) ? "items active items_4" : "items"}>
                        <div onClick={() => router.push("/customer")}>공지사항</div>
                        <div onClick={() => router.push("/customer/faq")}>자주하는 질문</div>
                        <div onClick={() => router.push("/customer/question")}>1:1 문의</div>
                        <div onClick={() => router.push("/customer/board")}>강사게시판</div>
                    </div>
                </div>
                {(user?.role?.id === "normal") && (
                    <div>
                        <div className="title" onClick={() => router.push("/apply")}>강사신청</div>
                        <div>

                        </div>
                    </div>
                )}
                {(user?.role?.id === "waiting_instructor_request" || user?.role?.id === "instructor" || user?.role?.id === "registered_instructor") && (
                    <div>
                        <div className="title" onClick={() => router.push("/apply/complete")}>강사신청</div>
                        <div>

                        </div>
                    </div>
                )}
                {
                    !!user?.join_date && (
                        <div>
                            <div className="title" onClick={logout}>로그아웃</div>
                        </div>
                    )
                }

            </div>
        </Styled>
    )
}