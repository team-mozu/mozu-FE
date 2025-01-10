import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Search } from './assets';

interface ISearchInputType {
  inputText: string;
}

export const SearchInput = ({ inputText }: ISearchInputType) => {
  return (
    <SearchInputContaniner>
      <Search size={20} color={color.zinc[400]} />
      <Input type="text" placeholder={inputText} />
    </SearchInputContaniner>
  );
};

const SearchInputContaniner = styled.div`
  display: flex;
  padding: 10px 12px;
  gap: 10px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
`;

const Input = styled.input`
  width: 100%;
  background-color: ${color.zinc[50]};
  color: ${color.black};
  font: ${font.b2};
  font-weight: ${font.b2.fontWeight};
  ::placeholder {
    color: ${color.zinc[500]};
    font: ${font.b2};
    font-weight: ${font.b2.fontWeight};
  }
`;
