import { Grid } from "semantic-ui-react";
import styled from "styled-components";
import {
  Container,
  ImageContent,
  Section,
  Sections,
} from "../../components/AmongStyle";
import { DoubleGrid } from "../../components/DoubleGrid";
import { Justify } from "../../components/Justify";
import { TopLeftRightButton } from "../../components/TopLeftRightButton";
import IntroLayout from "../../layouts/custom/IntroLayout";

const StyledSections = styled.div`
  > div:last-child {
    padding-bottom: 0px;
  }
`;

const StyledJustify = styled(Justify)`
  margin-top: 0px;
  margin-bottom: 50px;
`;

const Title = styled.div`
  color: #000000;
  letter-spacing: -0.03em;
  .subtitle {
    font-weight: 400;
    font-size: 16px;
    line-height: 26px;
  }
  .title {
    font-weight: 700;
    font-size: 42px;
    line-height: 150%;
  }
`;

const SimpleText = styled.div`
  font-weight: 700;
  font-size: 42px;
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #07287c;
`;

const EdgeTable = styled.div`
  > .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: -0.03em;
    color: #07287c;
    padding-left: 13px;
    border-left: 2px solid #07287c;
    margin-bottom: 15px;
  }
  .row {
    letter-spacing: -0.03em;
    color: #000000;
    > div {
      display: flex;
      padding: 15px 0px;
      > div:first-child {
        font-weight: 800;
        font-size: 18px;
        line-height: 150%;
        width: 100px;
        @media (max-width: 450px) {
          font-size: 15px;
          width: 80px;
        }
      }
      > div:last-child {
        width: auto;
        font-weight: 400;
        font-size: 18px;
        line-height: 26px;
        @media (max-width: 450px) {
          font-size: 15px;
        }
      }
      border-bottom: 1px solid #f0f0f0;
    }
  }
`;

const SlideImage = styled(ImageContent)`
  width: 100%;
  padding-top: 55%;
`;

// #TODO: Slide

export default function IntroPlace() {
  return (
    <IntroLayout id="place">
      <StyledSections>
        <Section>
          <Container>
            <SlideImage image="/next/pricing/top.png" className="mobile"/>
            <StyledJustify>
              <Title>
                <div className="subtitle">Facility 01</div>
                <div className="title">외부 시설</div>
              </Title>
              <TopLeftRightButton />
            </StyledJustify>
            <Grid>
              <Grid.Column computer={6} mobile={16}>
                <EdgeTable>
                  <div className="title">주) 테마</div>
                  <div className="row">
                    <div>
                      <div>대지면적</div>
                      <div>3022.40 ㎡ (914.27 PY)</div>
                    </div>
                    <div>
                      <div>건축면적</div>
                      <div>3022.40 ㎡ (914.27 PY)</div>
                    </div>
                    <div>
                      <div>연면적</div>
                      <div>3653.95 ㎡ (1105.33 PY)</div>
                    </div>
                    <div>
                      <div>규모</div>
                      <div>지하2층 / 지상 4층</div>
                    </div>
                    <div>
                      <div>주차</div>
                      <div>최대 45대</div>
                    </div>
                  </div>
                </EdgeTable>
              </Grid.Column>
              <Grid.Column computer={10} mobile={16}>
                <SlideImage image="/next/pricing/top.png" className="computer"/>
              </Grid.Column>
            </Grid>
          </Container>
        </Section>
        <ImageContent image="/next/intro/place_bg.png">
          <Section>
            <Container>
              <SlideImage image="/next/pricing/top.png" className="mobile"/>
              <StyledJustify>
                <Title>
                  <div className="subtitle">Facility 02</div>
                  <div className="title">내부 시설</div>
                </Title>
                <TopLeftRightButton />
              </StyledJustify>
              <Grid columns={2}>
                <Grid.Column computer={6} mobile={16}>
                  <EdgeTable>
                    <div className="title">주) 테마</div>
                    <div className="row">
                      <div>
                        <div>가로 25m 세로 12m</div>
                      </div>
                      <div>
                        <div>수심 1.5 m, 5m, 12m</div>
                      </div>
                      <div>
                        <div>수온 연중 29도</div>
                      </div>
                    </div>
                  </EdgeTable>
                </Grid.Column>
                <Grid.Column computer={10} mobile={16}>
                  <SlideImage image="/next/pricing/top.png" className="computer"/>
                </Grid.Column>
              </Grid>
              <StyledJustify style={{ marginTop: 100 }}>
                <div></div>
                <TopLeftRightButton />
              </StyledJustify>

              <SlideImage image="/next/pricing/top.png" className="mobile"/>
              <Grid columns={2}>
                <Grid.Column computer={6} mobile={16}>
                  <EdgeTable>
                    <div className="title">실내서핑</div>
                    <div className="row">
                      <div>
                        <div>더블레인 1</div>
                      </div>
                      <div>
                        <div>싱글레인 1</div>
                      </div>
                      <div>
                        <div>총 3개의 레인</div>
                      </div>
                    </div>
                  </EdgeTable>
                </Grid.Column>
                <Grid.Column computer={10} mobile={16}>
                  <SlideImage image="/next/pricing/top.png" className="computer"/>
                </Grid.Column>
              </Grid>
            </Container>
          </Section>
        </ImageContent>
        <Section>
          <Container>
            <StyledJustify>
              <div></div>
              <TopLeftRightButton />
            </StyledJustify>
            <SlideImage image="/next/pricing/top.png" className="mobile"/>
            <Grid columns={2}>
              <Grid.Column computer={6} mobile={16}>
                <SimpleText style={{color: "#000"}}>B2</SimpleText>
                <EdgeTable style={{ marginTop: 20 }}>
                  <div className="title">지하 2층</div>
                  <div className="row">
                    <div>
                      <div>강의실</div>
                    </div>
                    <div>
                      <div>사무실, 탈의실, 샤워실</div>
                    </div>
                  </div>
                </EdgeTable>
              </Grid.Column>
              <Grid.Column computer={10} mobile={16}>
                <SlideImage image="/next/pricing/top.png" className="computer"/>
              </Grid.Column>
            </Grid>
          </Container>
        </Section>
      </StyledSections>
    </IntroLayout>
  );
}
