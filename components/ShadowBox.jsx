import styled from "styled-components"

const Styled = styled.div`
    background: #FFFFFF;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.08);
    padding: 32px 24px;
    >.title {
        margin-bottom: 30px;
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        line-height: 23px;
        letter-spacing: -0.03em;
        color: #000000;
    }
    >.body {
        font-weight: 400;
        font-size: 16px;
        line-height: 130%;
        letter-spacing: -0.019em;
        color: #535353;
    }
`

export function ShadowBox(props) {
    return (
        <Styled>
            {props.children}
        </Styled>
    )
}