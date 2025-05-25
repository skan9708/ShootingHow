import { useRouter } from "next/router";
import { Center } from "../../components/AmongStyle";
import Footer from "../../components/Footer";
import Menu from "../../components/Menu";
import { SmallMenu, SmallMenuItem } from "../../components/SmallMenu";

export default function UserLayout(props) {
  const router = useRouter();
  return (
    <div>
      <Menu flatten block />
        {props.children}
      <Footer />
    </div>
  );
}
