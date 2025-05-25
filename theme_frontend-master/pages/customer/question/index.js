import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { Button, Center, Container, Right, Section, Sections, StyledPagination } from "../../../components/AmongStyle";
import { Board } from "../../../components/Board";
import CustomerLayout from "../../../layouts/custom/CustomerLayout";

const board = {
  headers: ["상태", "제목", "작성일", "조회수"],
  maxPages: 10,
  centers: [0, 2, 3],
  width: {"0": 120, "2": 120, "3": 120},
  questionStatus: [0],
};

export default function Customer() {
  const router = useRouter()
  const [page, setPage] = useState({})
  const [items, setItems] = useState([])
  const [user, setUser] = useState({loading: true})

  useEffect(() => {
    axios.get("/api/account/")
    .then(({data}) => {
      setUser(data)
    })
    .catch(() => {
      setUser({})
    })
  }, [])

  useEffect(() => {
    const page_number = router.query.page || 1
    axios.get("/api/article/inquiry/?page_size=10&page=" + page_number).then(res => {
      const items = res.data.results.map(item => {
        const created = <Moment format="YYYY.MM.DD">{item.created}</Moment>
        return { "id": item.id, "isNotice": false, "data": [item.is_solved, item.title, created, item.view_count], "is_mine": item.is_mine, "is_solved": item.is_solved, "raw": item}
      })
      setPage(res.data)
      setItems(items)
    }).catch(e => {
      const err = e?.response?.data?.error
      if(err) {
        alert(err)
      } else {
        alert("알 수 없는 에러가 발생했습니다.")
        console.log(e)
      }
    })
  }, [router.query.page])
  const onClickCellHandler = (row) => {
    router.push("/customer/question/view/" + row.id)
  }

  if(user.loading) {
    return <></>
  }

  return (
    <CustomerLayout id="question">
      <Sections>
        <Section>
          <Container>
            <Board {...board} items={items} clickable onClickCell={onClickCellHandler} locked/>
            <Right style={{marginTop: 10}}>
              {
                user.phone && (
                  <Button fit onClick={() => router.push("/customer/question/write/")}>글쓰기</Button>  
                )
              }
            </Right>
            <Center style={{marginTop: 50}}>
              <StyledPagination
                active={router.query.page || page.page_number}
                secondary
                totalPages={page.page_count}
                onPageChange={(e, {activePage}) => { router.push("/customer/question/?page_size=10&page=" + activePage) }}
              />
            </Center>
          </Container>
        </Section>
      </Sections>
    </CustomerLayout>
  );
}





