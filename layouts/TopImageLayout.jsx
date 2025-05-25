import Head from 'next/head'
import Image from 'next/image'
import styled, { css } from 'styled-components'
import { ImageContent } from '../components/AmongStyle'
import Menu from '../components/Menu'
import MainLayout from '../layouts/MainLayout'

const Styled = styled.div`
    .section.center {
        margin-top: 80px;
    }
    @media (max-width: 450px) {
        .section.center {
            margin-top: 0px;
            justify-content: flex-start;
        }
        .submenu {
            display: none;
        }
        .customer-section {
            padding: 0px;
        }
    }
`

const Top = styled(ImageContent)`
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
        font-weight: 700;
        font-size: 42px;
        line-height: 150%;
        letter-spacing: -0.03em;
        color: #FFFFFF;
        margin-top: auto;
    }
    .desc {
        font-weight: 500;
        font-size: 24px;
        line-height: 100%;
        letter-spacing: -0.03em;
        color: #FFFFFF;
        margin-top: 22px;
        margin-bottom: auto;
    }
    @media (max-width: 450px) {
        height: 260px;
        .title {
            font-size: 22px;
        }
        .desc {
            font-size: 14px;
            margin-top: 5px;
            margin-bottom: 70px;
        }
    }
`

export default function TopImageLayout(props) {
  return (
    <Styled>
       <Menu/>
        <Top image={props.image}>
            <div className="title">{props.title}</div>
            <div className="desc">{props.desc}</div>
        </Top>
        <div>
            {props.children}
        </div>
    </Styled>
  )
}
