import { useRouter } from "next/router";
import { Center } from "../../components/AmongStyle";
import Footer from "../../components/Footer";
import Menu from "../../components/Menu";
import { SmallMenu, SmallMenuItem } from "../../components/SmallMenu";

export default function BookingIndex(props) {
  const router = useRouter();
  return (
    <div>
      <Menu flatten block />
        <Center style={{ marginTop: 80 }}>
          <SmallMenu>
            <SmallMenuItem isActive={props.id === "mypage"} href="/mypage/">
            회원정보
            </SmallMenuItem>
            <SmallMenuItem isActive={props.id === "booked"} href="/mypage/booked">
            예약내역
            </SmallMenuItem>
            <SmallMenuItem isActive={props.id === "paid"} href="/mypage/paid">
            결제내역
            </SmallMenuItem>
            {/* <SmallMenuItem isActive={props.id === "point"} href="/mypage/point">
            포인트
            </SmallMenuItem> */}
            <SmallMenuItem isActive={props.id === "comment"} href="/mypage/comment">
            내 댓글
            </SmallMenuItem>
          </SmallMenu>
        </Center>
        {props.children}
      <Footer />
    </div>
  );
}
