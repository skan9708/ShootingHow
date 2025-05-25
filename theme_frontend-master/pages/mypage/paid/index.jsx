import { useRouter } from "next/router";
import {
  Container,
  Label,
  Section,
  Sections,
} from "../../../components/AmongStyle";
import { TextTable } from "../../../components/Table";
import MypageLayout from "../../../layouts/custom/MypageLayout";

export default function MypagePaid(props) {
  const router = useRouter();
  return (
    <MypageLayout id="paid">
      <Sections>
        <Section>
          <Container>
            <TextTable style={{ maxWidth: 900, margin: "auto" }}>
              <thead>
                <tr>
                  <th style={{width: 100}}>번호</th>
                  <th>결제날짜</th>
                  <th>금액</th>
                  <th>결제방식</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7].map((item, key) => {
                  const id = key;
                  return (
                    <tr key={key} style={{ textAlign: "center" }}>
                      <td>{key}</td>
                      <td>2022.11.15</td>
                      <td>2022.12.16</td>
                      <td>계좌이체</td>
                      <td style={{ textAlign: "right" }}>
                        {key % 2 == 0 ? (
                          <>
                            <Label>입금전</Label>
                          </>
                        ) : (
                          <>
                            <Label gray background>입금완료</Label>
                          </>
                        )}
                        <Label style={{ marginLeft: 5 }} background>
                          거래명세서
                        </Label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </TextTable>
          </Container>
        </Section>
      </Sections>
    </MypageLayout>
  );
}
