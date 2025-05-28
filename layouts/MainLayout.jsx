import { useRouter } from "next/router";
import { Icon } from "semantic-ui-react";
import styled, { css } from "styled-components";
import { Card, Container, SlideCards, Title } from "../components/AmongStyle";
import { DoubleGrid } from "../components/DoubleGrid";
import Footer from "../components/Footer";
import { Justify } from "../components/Justify";
import Fullpage from "../components/main/Fullpage";
import ImageSlide from "../components/main/ImageSlide";
import Theme from "../components/main/Theme";
import TrainerComment from "../components/main/TrainerComment";
import ShortCut from "../components/main/ShortCut";
import Menu from "../components/Menu";
import { Roadmap } from "../components/Roadmap";
import { TopLeftRightButton } from "../components/TopLeftRightButton";
import HowToFind from "../components/main/HowToFind";


export default function Mainlayout(props) {
  const router = useRouter();
  return (
    <>
      <Menu />
      <Fullpage />

      {/*
        남녀노소 즐길 수 있는
        필드에서 신나는 하루를 즐겨보세요요
       */}
      <Theme />

  



      {/* Footer */}
      <Footer />
    </>
  );
}
