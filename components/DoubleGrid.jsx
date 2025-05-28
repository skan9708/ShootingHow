import styled, { css } from "styled-components";

export const DoubleGrid = styled.div`
  display: flex;
  margin-bottom: 30px;
  > div {
    width: 50%;
    img.fullsize {
      width: 100%;
    }
    &:first-child {
      margin-right: min(20%, 100px);
    }
  }
  @media (max-width: 450px) {
    ${props => {
    if (props.mobile) {
      return css`
      flex-direction: column;
      >div {
        width: 100%;
        margin: 0px !important;
      }
      `
    }
  }}
  }
`;
