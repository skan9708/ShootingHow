import axios from "axios";
import { useEffect, useState } from "react";
import { Icon } from "semantic-ui-react";
import styled, { css } from "styled-components";
import { Container, Section, Sections } from "../../components/AmongStyle";
import CustomerLayout from "../../layouts/custom/CustomerLayout";

const FAQ = styled.div`
  &:first-child {
    border-top: 1px solid #07287c;
  }
  .question {
    height: 64px;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 23px;
    letter-spacing: -0.03em;
    color: #383838;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0px 15px;
    > div.icon {
      font-size: 16px;
      color: #fff;
      background-color: #07287c;
      width: 25px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      border-radius: 30px;
      margin-right: 8px;
    }
    > div:last-child {
      margin-left: auto;
    }
    .up {
      display: block;
      margin-left: auto;
    }
    .down {
      display: none;
      margin-left: auto;
    }
    ${(props) => {
      if (props.isOpen) {
        return css`
          .up {
            display: none;
            margin-left: auto;
          }
          .down {
            display: block;
            margin-left: auto;
          }
        `;
      }
    }}
  }
  border-bottom: 1px solid #f0f0f0;
  .answer {
    display: none;
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
    letter-spacing: -0.03em;
    color: #383838;
    padding: 29px 49px;
    background-color: #FAFAFA;
  }

  ${(props) => {
    return (
      props.isOpen &&
      css`
        .answer {
          display: block;
        }
      `
    );
  }}
`;

export default function CustomerFaq() {
  const [open, setOpen] = useState(0)
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios.get("/api/article/faq?page_size=10000").then((r) => {
      setItems(r.data.results);
    });
  }, []);
  return (
    <CustomerLayout id="faq">
      <Sections>
        <Section className="customer-section">
          <Container>
            {items.map((item, i) => {
              return (
                <FAQ key={i} isOpen={i === open}>
                  <div className="question" onClick={() => setOpen(i)}>
                    <div className="icon">Q</div>
                    <div>{item.question}</div>
                    <div className="up">
                      <Icon name="chevron up" />
                    </div>
                    <div className="down">
                      <Icon name="chevron down" />
                    </div>
                  </div>
                  <div className="answer">{item.answer}</div>
                </FAQ>
              );
            })}
          </Container>
        </Section>
      </Sections>
    </CustomerLayout>
  );
}
