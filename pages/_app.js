import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";
import { ChannelService } from "../components/ChannelService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const Wrapper = styled.div`
  min-height: 100vh;
  position: relative;
  padding-bottom: 400px;
  @media (max-width: 450px) {
    padding-bottom: 0px;
  }
`;

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    if(typeof window === undefined) return
    const service = new ChannelService()
    service.boot({
      "pluginKey": "2645802b-c18f-48d0-8bcf-8117f9110832",
    });
  }, []);

  return (
    <Wrapper>
      <Head>
        <title>다이빙의 꿈이 실현되는 곳 테마입니다.</title>
      </Head>
      <Script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js" />
      <Script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js" />
      <Component {...pageProps} />
      <ToastContainer />
    </Wrapper>
  );
}

export default MyApp;
