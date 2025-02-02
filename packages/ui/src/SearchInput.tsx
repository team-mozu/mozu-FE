import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Search } from './assets';
import React, { useState } from 'react'; // useState import

interface ISearchInputType {
  inputText: string;
}

export const SearchInput = ({ inputText }: ISearchInputType) => {
  const [isFocused, setIsFocused] = useState(false); // focus 상태 관리

  return (
    <SearchInputContaniner isFocused={isFocused}>
      {' '}
      {/* isFocused prop 전달 */}
      <Search size={20} color={color.zinc[400]} />
      <Input
        type="text"
        placeholder={inputText}
        onFocus={() => setIsFocused(true)} // focus 시 isFocused true로 변경
        onBlur={() => setIsFocused(false)} // blur 시 isFocused false로 변경
      />
    </SearchInputContaniner>
  );
};

const SearchInputContaniner = styled.div<{ isFocused: boolean }>`
  // isFocused prop 타입 정의
  display: flex;
  padding: 10px 12px;
  gap: 10px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};

  ${({ isFocused }) =>
    isFocused &&
    `
      border: 1px solid ${color.orange[300]};
    `}
`;

const Input = styled.input`
  width: 100%;
  background-color: ${color.zinc[50]};
  color: ${color.black};
  font: ${font.b2};
  font-weight: ${font.b2.fontWeight};
  border: none;
  outline: none;
  ::placeholder {
    color: ${color.zinc[500]};
    font: ${font.b2};
    font-weight: ${font.b2.fontWeight};
  }
`;
