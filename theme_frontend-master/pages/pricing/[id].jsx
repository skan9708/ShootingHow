import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Section, Sections } from "../../components/AmongStyle";
import { PriceTable } from "../../components/PriceTable";
import PricingLayout from "../../layouts/custom/PricingLayout";

export default function PricePool() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const type = router.query.id || "pricing"
  useEffect(() => {
    var t = "잠수풀"
    if(type === "tour") {
      t = "투어비"
    } else if(type === "training") {
      t = "교육비"
    }
    axios.get("/api/product/price/?type=" + t)
    .then(res => {
      setItems(res.data)
    })
  }, [type])
  return (
    <PricingLayout id={type}>
      <Sections>
        <Section>
          <Container className="prices">
            {
              items.child?.map((item, idx) => {
                return (
                  <PriceTable {...item} key={idx} />
                )
              })
            }
          </Container>
        </Section>
      </Sections>
    </PricingLayout>
  );
}
