import { Center } from "../../components/AmongStyle";
import Footer from "../../components/Footer";
import { SmallMenu, SmallMenuItem } from "../../components/SmallMenu";
import TopImageLayout from "../TopImageLayout";

export default function CustomerLayout(props) {
  return (
    <TopImageLayout
      image="/next/customer/top.png"
      title="고객센터"
      desc="테마의 고객센터 입니다."
    >
      <Center className="center section">
        <SmallMenu>
          <SmallMenuItem isActive={props.id === "customer"} href="/customer/">
            공지사항
          </SmallMenuItem>
          <SmallMenuItem
            isActive={props.id === "faq"}
            href="/customer/faq"
          >
            자주하는 질문
          </SmallMenuItem>
          <SmallMenuItem isActive={props.id === "question"} href="/customer/question">
            1:1 문의
          </SmallMenuItem>
          <SmallMenuItem isActive={props.id === "board"} href="/customer/board">
            강사게시판
          </SmallMenuItem>
        </SmallMenu>
      </Center>
      {props.children}
      <Footer />
    </TopImageLayout>
  );
}
