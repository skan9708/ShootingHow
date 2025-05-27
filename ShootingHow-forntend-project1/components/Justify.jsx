import styled from "styled-components";

export const Justify = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 130px;
  margin-bottom: 100px;
  > div {
    margin: 0px;
    margin-top: auto;
  }
  @media (max-width: 450px) {
    margin-top: 45px;
    margin-bottom: 22px;
    >div:last-child {
      display: none;
    }
  }
`;
