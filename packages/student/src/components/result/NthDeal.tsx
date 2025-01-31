import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { History } from './History';

export const NthDeal = () => {
  return (
    <Container>
      <label>1차 거래</label>
      <div>
        <History type="buy" />
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  > label {
    font: ${font.b1};
    color: ${color.zinc[600]};
  }
  > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid ${color.zinc[100]};
    border-radius: 8px;
    background-color: ${color.zinc[50]};
  }
`;
