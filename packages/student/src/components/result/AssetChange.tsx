import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { ArrowRight } from '@mozu/ui';

export const AssetChange = () => {
  return (
    <Container>
      <Beginning>
        <label>초기 자산</label>
        <p>1,000,000원</p>
      </Beginning>
      <ArrowRight size={24} color={color.black} />
      <Final>
        <label>최종 자산</label>
        <p>1,850,000원</p>
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

const Final = styled.div`
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
    color: ${color.red[500]};
  }
`;
