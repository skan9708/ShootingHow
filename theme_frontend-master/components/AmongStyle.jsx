import { useMediaQuery } from "react-responsive";
import { Pagination } from "semantic-ui-react";
import styled, { css } from "styled-components";

export const ImageContent = styled.div`
  ${(props) => {
    return css`
      background-image: url(${props.image});
      width: ${props.width};
      height: ${props.height};
    `;
  }}
  background-size: cover;
  background-position: center center;
`;

export const Container = styled.div`
  max-width: 1400px;
  margin: auto;
  @media (max-width: 450px) {
    padding: 0px 20px;
  }
`;

export const Sections = styled.div``;

export const Section = styled.div`
  padding: 80px 0px;
  @media (max-width: 450px) {
    padding: 40px 0px;
  }
`;

export const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Button = styled.button`
  border: 0px solid;
  padding: 16px 90px;
  background: #07287c;
  cursor: pointer;
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  letter-spacing: -0.03em;
  color: #ffffff;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 30px;
  border-radius: 4px;
  ${(props) => {
    if (props.fit) {
      return css`
        padding: 10px;
        font-size: 15px;
        line-height: inherit;
      `;
    }
  }}
  ${(props) => {
    if (props.fluid) {
      return css`
        width: 100%;
      `;
    }
  }}
  ${(props) => {
    if (props.red) {
      return css`
        background-color: #ff3939;
      `;
    }
    if (props.kakao) {
      return css`
        background-color: #fee500;
        color: #000;
      `;
    }
  }}
  .icon {
    height: 20px;
    margin-right: 20px;
  }
  @media (max-width: 450px) {
    padding: 16px 30px;
  }
`;

export const Description = styled.div`
  margin-top: 20px;
  > .desc {
    font-weight: 400;
    font-size: 18px;
    line-height: 160%;
    letter-spacing: -0.03em;
    color: #000000;
  }
  .box {
    padding: 25px;
    margin-top: 34px;
    background: #f7f9fe;
    letter-spacing: -0.03em;
    color: #000000;
    .title {
      font-weight: 500;
      font-size: 18px;
      line-height: 23px;
      margin-top: 20px;
      &:first-child {
        margin-top: 0px;
      }
    }
    .desc {
      margin-top: 6px;
      font-weight: 400;
      font-size: 16px;
      line-height: 26px;
    }
  }
  @media (max-width: 450px) {
    >.desc {
      font-size: 14px;
    }
    .box {
      margin-top: 15px;
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      .desc {
        font-size: 14px;
      }
    }
  }
`;

export const InfoBox = styled.div`
  background: #ffffff;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.08);
  padding: 28px 20px;
  margin-top: 30px;
  border-top: 1px solid #07297c;
  letter-spacing: -0.03em;
  color: #000000;
  &:first-child {
    margin-top: 0px;
  }
  .forms {
    display: flex;
    flex-direction: column;
    > div {
      margin-left: auto;
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0px;
      }
      @media (max-width: 450px) {
        margin-left: 0px;
      }
    }
  }
  .form_info {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .form_title {
    font-weight: 700;
    font-size: 18px;
    line-height: 23px;
    margin-bottom: 6px;
  }
  .form_check {
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
    letter-spacing: -0.03em;
    color: #000000;
    margin-top: auto;
  }
  .form_desc {
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
  }
  .form_input {
    display: flex;
    align-items: center;
    letter-spacing: -0.03em;
    color: #000000;
    .label {
      font-weight: 500;
      font-size: 18px;
      line-height: 23px;
      margin-right: 18px;
    }
    .input {
      display: flex;
      padding: 12px;
      border: 1px solid #c9c9c9;
      input {
        border: 0ex;
        font-weight: 500;
        font-size: 18px;
        line-height: 23px;
        letter-spacing: -0.03em;
        color: #383838;
        outline: none;
        width: 100px;
      }
      div {
        font-weight: 500;
        font-size: 18px;
        letter-spacing: -0.03em;
        color: #747474;
        margin-right: 5px;
      }
    }
  }
  @media (max-width: 450px) {
    .form_input {
      .label {
        margin-right: auto;
      }
      .input {
        input {
          width: 150px;
        }
      }
    }
  }
`;

export const WarningBox = styled(InfoBox)`
  background: rgba(0, 61, 219, 0.03);
  .title {
    font-weight: 500;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: -0.03em;
    color: #07287c;
  }
  .desc {
    margin-top: 10px;
    font-weight: 400;
    font-size: 14px;
    line-height: 170%;
    color: #383838;
  }
`;

export const Label = styled.div`
  font-weight: 400;
  font-size: 16px;
  width: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.03em;
  color: #07287c;
  border: 1px solid #07287c;
  border-radius: 5px;
  margin: auto;
  cursor: pointer;

  ${(props) => {
    if (props.red) {
      return css`
        border-color: #ff0000;
        color: #ff0000;
      `;
    }
  }}

  ${(props) => {
    if (props.gray) {
      if (props.background) {
        return css`
          background-color: #f0f0f0;
          color: #747474;
          border: 1px solid #747474;
        `;
      } else {
        return css`
          background-color: #747474;
          color: #f0f0f0;
          border: 1px solid #f0f0f0;
        `;
      }
    }
    if (props.background) {
      return css`
        background-color: #07287c;
        color: #fff;
        border: 1px solid #07287c;
      `;
    }
  }}
`;


export const StyledPagination = styled(Pagination)`
  /* #TODO: 구현 */
  display: none !important;
  a:first-child, a:last-child {
    display: none !important;
  }
  a {
    background-color: #fff !important;
  }
  a.active {
    font-weight: bold !important;
  }
`

export const SmallButton = styled.div`
  display: inline-flex;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  margin-right: 5px;
  &:last-child {
    margin-right: 0px;
  }
  &:hover {
    background-color: #eee;
    cursor: pointer;
  }
`;

export const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  margin-top: 5px;
  min-height: 400px;
  border-radius: 5px;
  resize: none;
`

export const Title = styled.div`
  font-family: "Spoqa Han Sans Neo";
  font-weight: 700;
  font-size: 42px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #000000;
  margin-top: 130px;
  margin-bottom: 100px;
  @media (max-width: 450px) {
    margin-top: 45px;
    margin-bottom: 22px;
    font-size: 22px;
  }
`;

export const SlideCards = styled.div`
  display: flex;
  @media (max-width: 450px) {
    display: block;
  }
`

export const Card = styled.div`
  width: 100%;
  cursor: pointer;
  user-select: none;
  background-size: cover !important;
  background-position: center center;
  font-weight: 700;
  font-size: 32px;
  line-height: 32px;
  text-align: center;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  ${props => {
    if(props.image) {
      return css`
        @media (max-width: 450px) {
          background: url(${props.image}), rgba(0, 0, 0, 1);
        }
        @media (min-width: 450px) {
          background: url(${props.image}), rgba(0, 0, 0, 1);
          ${props.hover && css`
            &:hover {
              background: url(${props.hover}), rgba(0, 0, 0, 1);
            }
          `
          }
        }
      `
    } else {
      return css`
        background: #fff;
        color: #000;
        margin-right: 20px;
      `
    }
  }}
  display: flex;
  flex-direction: column;
  >div {
    &:first-child {
      margin-top: auto;
      margin-bottom: 40px;
    }
    &:last-child {
      margin-bottom: auto;
      font-size: 50px;
    }
  }
`;

export const Image = styled.div`
  background-size: cover;
  background-position: center center;
  width: 100%;
  padding-top: 100%;
  ${props => {
    return css`
      background-image: url(${props.image});
    `
  }}
`

export const Mobile = styled.div`
  display: none;
  @media (max-width: 450px) {
    display: block;
  }
`

export const Computer = styled.div`
  display: block;
  @media (max-width: 450px) {
    display: none;
  }
`