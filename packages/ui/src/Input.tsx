import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';

interface IInputContainerType {
  width: string;
  height: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
}

interface IInputType extends IInputContainerType {
  placeholder: string;
}

export const Input = ({
  width,
  height,
  placeholder,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
}: IInputType) => {
  return (
    <InputContainer
      width={width}
      height={height}
      paddingTop={paddingTop}
      paddingRight={paddingRight}
      paddingBottom={paddingBottom}
      paddingLeft={paddingLeft}
    >
      <InputContent placeholder={placeholder} />
    </InputContainer>
  );
};

const InputContainer = styled.div<IInputContainerType>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  padding-top: ${(props) => props.paddingTop};
  padding-left: ${(props) => props.paddingLeft};
  padding-right: ${(props) => props.paddingRight};
  padding-bottom: ${(props) => props.paddingBottom};
`;

const InputContent = styled.input`
  border: none;
  width: 100%;
  color: ${color.black};
  font: ${font.b2};
  :focus {
    outline: none;
  }
  ::placeholder {
    color: ${color.zinc[500]};
    font: ${font.b2};
  }
`;
