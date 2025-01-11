import styled from '@emotion/styled';
import { color } from '@mozu/design-token';
import { useState } from 'react';
import { Check } from './assets';

export const Checkbox = () => {
  const [isCheck, setIsCheck] = useState<boolean>(false);

  const checkClick = () => {
    setIsCheck(!isCheck);
  };

  return (
    <>
      <CheckboxContainer isCheck={isCheck} onClick={checkClick}>
        <Check />
      </CheckboxContainer>
    </>
  );
};

const CheckboxContainer = styled.div<{ isCheck: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${({ isCheck }) =>
    isCheck ? color.orange[500] : 'transparent'};
  border: 1px solid
    ${({ isCheck }) => (isCheck ? color.orange[500] : color.zinc[500])};
`;
