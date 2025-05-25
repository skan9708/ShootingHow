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
        잠수풀로 신나는 하루를 즐겨보세요!
       */}
      <Theme />

      {/*
        테마로 오시는 길
      */}
      <HowToFind />


      {/*
        최신 시설과 쾌적한 환경에서
        해양 액티비티 체험의 신세계를 경험해 보세요.
      */}
      <ImageSlide />

      {/*
        20년의 노하우와 책임강사들의 업그레이드된 교육으로
        여러분의 다이빙과 서핑 실력을 향상시켜 보세요.
     */}
      <TrainerComment />

      {/*
        테마를 통해 해양 액티비티 체험 스포츠를 위한 다양한 서비스를 경험해보세요 
      */}
      <ShortCut />



      {/* Footer */}
      <Footer />
    </>
  );
}
