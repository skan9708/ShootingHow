import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import styled from "styled-components";
import {
  Center,
  Container,
  ImageContent,
  Section,
  Sections,
} from "../../components/AmongStyle";
import { GridCards } from "../../components/Cards";
import Footer from "../../components/Footer";
import Menu from "../../components/Menu";

const TextTitle = styled(Center)`
  flex-direction: column;
  .title {
    font-weight: 700;
    font-size: 42px;
    line-height: 150%;
    letter-spacing: -0.03em;
    color: #07287c;
  }
`;

// border: 1px solid #C9C9C9;
// border-radius: 4px;

const TextBody = styled.div`
  padding: 15px;
  border: 1px solid #c9c9c9;
  margin-top: 50px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 200%;
  letter-spacing: -0.02em;
  color: #000000;
`

export default function Terms(props) {
  const router = useRouter()
  const [data, setData] = useState(null)
  useEffect(() => {
    if(!router.isReady) return
    axios.get("/api/account/terms/" + router.query.id + "/").then(({data}) => {
      setData(data)
    })
    .catch(() => {})
  }, [router.isReady, router.query])

  if(!data) return <></>

  return (
    <div>
      <Menu flatten block />
      <Sections>
        <Section>
          <Container>
            <TextTitle>
              <div className="title">
                {data.title}
              </div>
            </TextTitle>
         </Container>
         <Container>
            <TextBody>
              {data.content.split(/\n/g).map((item, i) => {
                return (
                  <>
                    {item}
                    <br/>
                  </>
                )
              })}
            </TextBody>
          </Container>
        </Section>
      </Sections>
      <Footer />
    </div>
  );
}
