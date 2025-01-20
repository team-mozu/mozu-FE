import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { Plus } from './assets';

interface IAddButtonType {
  text: string;
  onClick?: () => void;
}

export const AddButton = ({ text, onClick }: IAddButtonType) => {
  return (
    <AddButtonContainer onClick={onClick}>
      <Text>{text}</Text>
      <LogoContainer>
        <Plus size={20} color={color.white} />
      </LogoContainer>
    </AddButtonContainer>
  );
};

const AddButtonContainer = styled.div`
  cursor: pointer;
  width: 100%;
  height: 40px;
  background-color: ${color.orange[500]};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const LogoContainer = styled.div`
  width: 20px;
  height: 20px;
`;

const Text = styled.p`
  font: ${font.b1};
  color: ${color.white};
`;
