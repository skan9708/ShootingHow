import styled from "styled-components";

export const Form = styled.div`
  width: 100%;
  max-width: 500px;
  text-align: center;
  .title {
    font-weight: 700;
    font-size: 32px;
    line-height: 32px;
    letter-spacing: -0.03em;
    color: #07287c;
  }
  .form {
    text-align: left;
    margin: 50px 0px;
    > div {
      margin-top: 20px;
      &:first-child {
        margin-top: 0px;
      }
      .label {
        font-family: "Pretendard";
        font-weight: 500;
        font-size: 16px;
        line-height: 130%;
        letter-spacing: -0.02em;
        margin-bottom: 5px;
      }
      .required:after {
        color: #ff0000;
        content: "*";
      }
      &.error {
        color: #ff3939;
        margin-top: 10px;
      }
    }
  }
`;
