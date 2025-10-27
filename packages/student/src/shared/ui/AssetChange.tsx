import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { ArrowRight } from "@mozu/ui";

interface IProp {
  baseMoney: number;
  totalMoney: number;
}

export const AssetChange = ({ baseMoney = 0, totalMoney = 0 }: IProp) => {
  return (
    <Container>
      <Beginning>
        <label>초기 자산</label>
        <p>{baseMoney.toLocaleString() ?? "0"}</p>
      </Beginning>
      <ArrowRight
        size={24}
        color={color.black}
      />
      <Final status={totalMoney > baseMoney ? "profit" : totalMoney < baseMoney ? "loss" : "same"}>
        <label>최종 자산</label>
        <p>{totalMoney.toLocaleString() ?? "0"}원</p>
      </Final>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 80px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${color.zinc[50]};
  border-radius: 8px;
`;

const Beginning = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  > label {
    font: ${font.b1};
    color: ${color.zinc[600]};
  }
  > p {
    font: ${font.t1};
    color: ${color.black};
  }
`;

const Final = styled.div<{
  status: "profit" | "loss" | "same";
}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  > label {
    font: ${font.b1};
    color: ${color.zinc[600]};
    text-align: end;
  }
  > p {
    font: ${font.t1};
    color: ${props =>
    props.status === "profit" ? color.red[500] : props.status === "loss" ? color.blue[500] : color.green[500]};
  }
`;
