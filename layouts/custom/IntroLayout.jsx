import { Center } from "../../components/AmongStyle";
import Footer from "../../components/Footer";
import { SmallMenu, SmallMenuItem } from "../../components/SmallMenu";
import TopImageLayout from "../../layouts/TopImageLayout";

export default function IntroLayout(props) {
  return (
    <TopImageLayout image="/next/intro/top.png" title="소개" desc="교육을 위해 달려온 지난 20년의 발자취를 소개합니다.">
      <Center style={{ marginTop: 80 }} className="submenu">
        <SmallMenu>
          <SmallMenuItem isActive={props.id === "intro"} href="/intro/">
            인사말
          </SmallMenuItem>
          <SmallMenuItem isActive={props.id === "members"} href="/intro/members">
            구성원
          </SmallMenuItem>
          <SmallMenuItem isActive={props.id === "place"} href="/intro/place">
            시설안내
          </SmallMenuItem>
          <SmallMenuItem isActive={props.id === "roadmap"} href="/intro/roadmap">
            오시는길
          </SmallMenuItem>
        </SmallMenu>
      </Center>
      {props.children}
      <Footer/>
    </TopImageLayout>
  );
}
