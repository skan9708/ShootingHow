import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function BookSuccess(props) {
   const router = useRouter();
   useEffect(() => {
    if(!router.isReady) return
    axios.post("/api/payment/", router.query)
    .then(({data}) => {
        router.push("/mypage/booked/detail/" + data.message)
    }).catch(e => {
        const err = e?.response?.data?.error
        if(err) {
          alert(err)
          router.back()
        } else {
          alert("알 수 없는 에러가 발생했습니다.")
          console.log(e)
        }
      })
   }, [router.isReady])
   return (
        <>
        처리중입니다.
        </>
    )
}