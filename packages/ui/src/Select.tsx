import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { ChevronDown } from '.';

interface ISelectProps {
  data: string[];
  value: string;
  onChange?: (value: string) => void;
  width?: number;
  height?: number;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export const Select = forwardRef<HTMLDivElement, ISelectProps>(
  ({ data, value, onChange, width, height, padding }, ref) => {
    const [showOptions, setShowOptions] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    // 외부 ref와 내부 ref 동기화
    useImperativeHandle(ref, () => selectRef.current as HTMLDivElement);

    const handleSelectClick = () => {
      setShowOptions((prev) => !prev);
    };

    const handleOptionClick = (selectedValue: string) => {
      onChange?.(selectedValue);
      setShowOptions(false);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setShowOptions(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <SelectContainer
        ref={selectRef}
        width={width}
        height={height}
        padding={padding}
        show={showOptions}
      >
        <SelectHeader onClick={handleSelectClick}>
          <SelectedValue>{value}</SelectedValue>
          <ChevronWrapper show={showOptions}>
            <ChevronDown size={20} color={color.black} />
          </ChevronWrapper>
        </SelectHeader>

        <SelectOptions show={showOptions}>
          {data.map((item, index) => (
            <Option
              key={index}
              onClick={() => handleOptionClick(item)}
              selected={item === value}
            >
              {item}
            </Option>
          ))}
        </SelectOptions>
      </SelectContainer>
    );
  },
);

// 스타일 컴포넌트
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
  border: 1px solid ${color.zinc[200]};
  cursor: pointer;
  user-select: none;
`;

const SelectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const SelectedValue = styled.span`
  font: ${font.b1};
  color: ${color.zinc[800]};
`;

const ChevronWrapper = styled.div<{ show: boolean }>`
  transform: rotate(${(props) => (props.show ? '180deg' : '0deg')});
  transition: transform 0.2s ease-in-out;
`;

const SelectOptions = styled.ul<{ show: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: ${(props) => (props.show ? '200px' : '0')};
  overflow-y: auto;
  background-color: ${color.white};
  border: ${(props) => (props.show ? `1px solid ${color.zinc[200]}` : 'none')};
  border-radius: 8px;
  box-shadow: ${(props) =>
    props.show ? `0 4px 6px ${color.zinc[200]}` : 'none'};
  transition: all 0.2s ease-in-out;
  z-index: 10;
`;

const Option = styled.li<{ selected?: boolean }>`
  padding: 12px 16px;
  font: ${font.b2};
  color: ${(props) => (props.selected ? color.orange[600] : color.zinc[800])};
  background-color: ${(props) =>
    props.selected ? color.orange[50] : 'transparent'};
  cursor: pointer;
  transition: all 0.1s ease;
  text-align: start;

  &:hover {
    background-color: ${color.zinc[100]};
  }

  &:active {
    background-color: ${color.zinc[200]};
  }
`;
