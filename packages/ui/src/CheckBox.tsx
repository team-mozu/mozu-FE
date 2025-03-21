import styled from '@emotion/styled';
import { color } from '@mozu/design-token';
import { Check } from './assets';

interface IProps {
  onChange?: () => void;
  checked?: boolean;
  id?: string;
}

interface ICheckType {
  backgroundColor: string;
  borderColor: string;
}

export const CheckBox = ({ onChange, checked, id }: IProps) => {
  return (
    <Container>
      <CheckBoxInput
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={id}
      />
      <label htmlFor={id}>
        <CheckBoxLabel
          borderColor={checked ? color.orange[500] : color.zinc[500]}
          backgroundColor={checked ? color.orange[500] : color.white}
        >
          {checked ? <Check /> : <div></div>}
        </CheckBoxLabel>
      </label>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CheckBoxLabel = styled.div<ICheckType>`
  background-color: ${(props) => props.backgroundColor};
  width: 20px;
  height: 20px;
  border: 1px solid ${(props) => props.borderColor};
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-item: center;
  line-height: 20px;
`;

const CheckBoxInput = styled.input`
  display: none;
`;
