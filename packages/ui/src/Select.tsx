import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { useEffect, useRef, useState, MouseEvent } from 'react';
import { ChevronDown } from '.';

interface ISelectProps {
  data: string[];
  width?: number;
  height?: number;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

interface ISelectOptionsType {
  show: boolean;
}

export const Select = ({ data, width, height, padding }: ISelectProps) => {
  const [currentValue, setCurrentValue] = useState<string>(data[0]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const handleOnChangeSelectValue = (e: React.MouseEvent<HTMLLIElement>) => {
    const value = e.currentTarget.getAttribute('value');
    if (value) {
      setCurrentValue(value);
      setShowOptions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: unknown) => {
      const mouseEvent = event as MouseEvent;
      if (
        selectRef.current &&
        !selectRef.current.contains(mouseEvent.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside as EventListener);
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside as EventListener,
      );
    };
  }, [selectRef]);

  return (
    <SelectContainer
      onClick={() => setShowOptions((prev) => !prev)}
      width={width}
      height={height}
      padding={padding}
      show={showOptions}
      ref={selectRef}
    >
      <Label>{currentValue}</Label>
      <ChevronWrapper show={showOptions}>
        <ChevronDown size={20} color={color.black} />
      </ChevronWrapper>
      <SelectOptions show={showOptions}>
        {data.map((item, index) => (
          <Option key={index} value={item} onClick={handleOnChangeSelectValue}>
            {item}
          </Option>
        ))}
      </SelectOptions>
    </SelectContainer>
  );
};

// 스타일 정의
const SelectContainer = styled.div<
  Pick<ISelectProps, 'width' | 'height' | 'padding'> & { show: boolean }
>`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  padding: ${(props) =>
    `${props.padding?.top}px ${props.padding?.right}px ${props.padding?.bottom}px ${props.padding?.left}px`};
  border-radius: 8px;
  background-color: ${color.zinc[50]};
  align-self: center;
  border: 1px solid ${color.zinc[200]};
  cursor: pointer;
`;

const Label = styled.label`
  color: ${color.black};
  font: ${font.b1};
  display: inline-block;
`;

const ChevronWrapper = styled.div<{ show: boolean }>`
  position: absolute;
  top: 4px;
  right: 8px;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.show ? 'rotate(0deg)' : 'rotate(180deg)')};
`;

const SelectOptions = styled.ul<ISelectOptionsType>`
  position: absolute;
  top: 38px;
  left: 0;
  width: 100%;
  max-height: ${(props) => (props.show ? '180px' : '0')};
  overflow-y: auto;
  border: ${(props) => (props.show ? `1px solid ${color.zinc[200]}` : 'none')};
  border-radius: 8px;
  background-color: ${color.white};
  transition: max-height 0.2s ease-in-out;
`;

const Option = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background-color: ${color.zinc[100]};
  }
  &:active {
    color: ${color.orange[600]};
  }
`;
