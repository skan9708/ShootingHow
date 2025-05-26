import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid #07287c;
  tbody {
    tr {
      td {
        padding: 25px;
        border-bottom: 1px solid #c9c9c9;
        color: #383838;
        font-weight: 500;
        font-size: 20px;
        line-height: 25px;
        letter-spacing: -0.03em;
        &:first-child {
          width: 150px;
          color: #07287c;
        }
        @media (max-width: 450px) {
          padding: 15px 0px;
        }
      }
    }
  }
`;

export const TextTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid #07287c;
  thead {
    th {
      height: 64px;
      font-weight: 500;
      font-size: 18px;
      line-height: 23px;
      align-items: center;
      text-align: center;
      border-bottom: 1px solid #c9c9c9;
      white-space: nowrap;
    }
  }
  tbody {
    .clickable:hover {
      background-color: #f8f8f8;
      cursor: pointer;
    }
    td {
      padding: 0px 20px;
      font-weight: 500;
      font-size: 18px;
      line-height: 23px;
      letter-spacing: -0.03em;
      color: #383838;
      height: 64px;
      border-bottom: 1px solid #eee;
      &:first-child {
        text-align: center;
      }
    }
    td.price, td.desc {
      border: 1px solid #f0f0f0;
      &:first-child {
        border-left: 0px solid;
      }
      &:last-child {
        border-right: 0px solid;
      }
    }
    td.price {
      height: 95px;
      white-space: nowrap;
      text-align: center;
      font-weight: 400;
      font-size: 18px;
      line-height: 23px;
      font-weight: 700;
      color: #07287c;
    }
    td.desc {
      font-weight: 400;
      font-size: 16px;
      line-height: 26px;
      letter-spacing: -0.03em;
      color: #000000;
      text-align: center;
      white-space: pre-wrap; 
    }
    td.header {
      background: rgba(0, 61, 219, 0.03);
      font-weight: 400;
      color: #000000;
      white-space: pre-wrap; 
    }
    tr:last-child {
      td {
        border-bottom: 1px solid #c9c9c9;
      }
    }
    td.left {
      text-align: left;
    }
    td.require {
      &:after {
        content: "*";
        color: #ff0000;
        margin-left: 2px;
      }
    }
  }

  input {
    width: 100%;
    border: 0px solid;
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
    letter-spacing: -0.03em;
    color: #383838;
    outline: none;
  }

  @media (max-width: 450px) {
    tbody {
      td {
        font-size: 14px;
        padding: 10px;
      }
      tr {
        td:first-child {
          white-space: nowrap;
        }
      }
    }
  }
`;
