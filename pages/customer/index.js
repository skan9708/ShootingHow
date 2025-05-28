import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { Center, Container, Section, Sections, StyledPagination } from "../../components/AmongStyle";
import { Board } from "../../components/Board";
import CustomerLayout from "../../layouts/custom/CustomerLayout";

const board = {
  headers: ["번호", "제목", "작성일", "조회수"],
  maxPages: 10,
  centers: [0, 2, 3],
  width: {"0": 100, "2": 140, "3": 120},
};

export default function Customer() {
  const router = useRouter()
  const [page, setPage] = useState({})
  const [items, setItems] = useState([])
  useEffect(() => {
    const page_number = router.query.page || 1
    axios.get("/api/article/notice/?page_size=10&page=" + page_number).then(res => {
      const items = res.data.results.map(item => {
        const created = <Moment format="YYYY.MM.DD">{item.created}</Moment>
        return { "id": item.id, "isNotice": false, "data": [item.id, item.title, created, item.view_count], "raw": item }
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
    router.push("/customer/view/" + row.id)
  }
  return (
    <CustomerLayout id="customer">
      <Sections>
        <Section className="customer-section">
          <Container>
            <Board {...board} items={items} clickable onClickCell={onClickCellHandler}/>
            <Center style={{marginTop: 50}}>
              <StyledPagination
                active={router.query.page || page.page_number}
                secondary
                totalPages={page.page_count}
                onPageChange={(e, {activePage}) => { router.push("/customer/?page_size=10&page=" + activePage) }}
              />
            </Center>
          </Container>
        </Section>
      </Sections>
    </CustomerLayout>
  );
}





