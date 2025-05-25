import styled from "styled-components";
import { Center } from "../../components/AmongStyle";
import Footer from "../../components/Footer";
import { SmallMenu, SmallMenuItem } from "../../components/SmallMenu";
import TopImageLayout from "../../layouts/TopImageLayout";

const Prices = styled.div`
  .prices {
    >div {
      margin-bottom: 60px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
  /*
  @media (max-width: 450px) {
    .prices {
      min-width: 1400px;
    }
    max-width: 100vw;
    overflow-x: auto;
  }*/
`

export default function PricingLayout(props) {
  return (
    <TopImageLayout
      image="/next/pricing/top.png"
      title="요금안내"
      desc="테마를 이용하기 위한 요금안내입니다."
    >
      <Center style={{ marginTop: 80 }}>
        <SmallMenu>
          <SmallMenuItem isActive={props.id === "pricing"} href="/pricing/">
            테마 이용료
          </SmallMenuItem>
          <SmallMenuItem
            isActive={props.id === "training"}
            href="/pricing/training"
          >
            교육비 안내
          </SmallMenuItem>
          {/* <SmallMenuItem isActive={props.id === "tour"} href="/pricing/tour">
            투어비 안내
          </SmallMenuItem> */}
        </SmallMenu>
      </Center>
      <Prices>
        {props.children}
      </Prices>
      <Footer />
    </TopImageLayout>
  );
}
