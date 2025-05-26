import { Icon } from "semantic-ui-react";
import styled from "styled-components";

const Styled = styled.div`
  display: flex;
  > div {
    width: 100px;
    height: 100px;
    left: 1640px;
    top: 2277px;
    border: 1.5px solid rgba(0,0,0,0);
    &:hover {
      border: 1.5px solid #07287c;
      transition-duration: 0.5s;
      cursor: pointer;
    }
    border-radius: 100px;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 20px;
    /* &:first-child {
      margin-left: 0px;
      border: 0px;
    } */
    > i {
      height: 20px;
      width: 25px;
    }
  }
`;

export function TopLeftRightButton(props) {
  return (
    <Styled>
      <div onClick={props.onPrev}>
        <img src="/next/images/left_long.svg"/>
      </div>
      <div onClick={props.onNext}>
        <img src="/next/images/right_long.svg"/>
      </div>
    </Styled>
  );
}
