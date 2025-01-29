import { color } from '@mozu/design-token';
import { ArrowLeft } from './assets';
import styled from '@emotion/styled';

export const ExitBtn = () => {
  {
    return (
      <Btn>
        <ArrowLeft color={color.zinc[800]}></ArrowLeft>
      </Btn>
    );
  }
};

const Btn = styled.button`
  cursor: pointer;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  display: flex;
  justify-content: center;
  align-items: center;
`;
