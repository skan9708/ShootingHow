import Link from "next/link";
import styled, { css } from "styled-components";

export const SmallMenu = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 100%;

  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.03em;

  @media (max-width: 450px) {
    padding: 20px 0px 10px 0px;
    margin: 0px 20px;
    width: 100%;
  }
`;

const StyledSmallMenuItem = styled.div`
  margin-right: 35px;
  &:last-child {
    margin-right: 0px;
  }
  a {
    color: #c9c9c9;
    ${(props) => {
      if (props.active) {
        return css`
          color: #07287c;
          padding-bottom: 5px;
          border-bottom: 2px solid #07287c;
          @media (max-width: 450px) {
            display: block;
          }
        `;
      }
    }}
  }
  @media (max-width: 450px) {
    display: none;
    ${props => {
      if(props.active) {
        return css`
          display: block;
          font-weight: 500;
          font-size: 22px;
          margin-right: auto;
          a {
            border-bottom: 0px;
          }
        `
      }
    }}
  }
`;

export const SmallMenuItem = (props) => {
    return (
        <StyledSmallMenuItem active={props.isActive}>
            <Link href={props.href}>
                {props.children}
            </Link>
        </StyledSmallMenuItem>
    )
}