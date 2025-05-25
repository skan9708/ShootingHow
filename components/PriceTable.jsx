import styled from "styled-components";
import { TextTable } from "./Table";

const StyledPriceTable = styled.div`
  letter-spacing: -0.03em;
  color: #000000;
  > .title {
    border-left: 3px solid #07287c;
    padding-left: 10px;
    font-weight: 500;
    font-size: 20px;
    line-height: 25px;
    margin-bottom: 16px;
  }
`;

function Table(props) {
  return (
    <TextTable>
      <thead>
        <tr>
          <th>구분</th>
          {props.child &&
            props.child.slice(props.from, props.to).map((item, idx) => {
              return <th key={idx}>{item.name}</th>;
            })}
        </tr>
      </thead>
      <tbody>
        {props.header &&
          props.header.map((item, hid) => {
            return (
              <tr key={hid}>
                <td className="header price" style={{ width: 250 }}>
                  {item}
                </td>
                {props.child.slice(props.from, props.to).map((item, idx) => {
                  const d = item.value[hid];
                  return !isNaN(d) ? (
                    <td key={idx} className="price">
                      {Number(d).toLocaleString() + " 원"}
                    </td>
                  ) : (
                    <td className="desc">{d}</td>
                  );
                })}
              </tr>
            );
          })}
      </tbody>
    </TextTable>
  );
}

export function PriceTable(props) {
  return (
    <StyledPriceTable>
      <div className="title">{props.name}</div>
      {props.child.length >= 9 ? (
        <>
          <Table {...props} from={0} to={4} />
          <br/>
          <Table {...props} from={4} to={12} />
        </>
      ) : (
        <>
          <Table {...props} from={0} to={6} />
        </>
      )}
    </StyledPriceTable>
  );
}
