import { color, font } from '@mozu/design-token';
import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import { Imglogo } from './assets';
import { Button } from './Button';

interface IImgType {
  label?: string;
}

export const ImgContainer = ({ label }: IImgType) => {
  const imgRef = useRef<HTMLInputElement | null>();
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const imgClick = () => {
    imgRef.current?.showPicker();
  };

  const delClick = () => {
    setImgUrl(null);
  };

  const handleChange = () => {
    const file = imgRef.current?.files?.[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setImgUrl(newUrl);
    }
  };

  return (
    <BtnImgContainer>
      <ImgContent type="file" ref={imgRef} onChange={handleChange} />
      <ImgContentContainer>
        <Label>{label}</Label>
        <FakeImgContent imgUrl={imgUrl}>
          {!imgUrl && <Imglogo />}
        </FakeImgContent>
      </ImgContentContainer>
      <Button
        backgroundColor={color.zinc[50]}
        color={color.zinc[800]}
        borderColor={color.zinc[200]}
        onClick={imgClick}
      >
        이미지 업로드
      </Button>
      <Button
        backgroundColor={color.red[500]}
        color={color.white}
        borderColor={color.red[500]}
        onClick={delClick}
      >
        이미지 삭제
      </Button>
    </BtnImgContainer>
  );
};

const BtnImgContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: end;
`;

const ImgContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: start;
`;

const Label = styled.div`
  font: ${font.b1};
  color: ${color.zinc[800]};
`;

const ImgContent = styled.input`
  width: 580px;
  height: 320px;
  display: none;
`;
const FakeImgContent = styled.div<{ imgUrl: string }>`
  width: 580px;
  height: 320px;
  border-radius: 12px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${({ imgUrl }) => imgUrl});
`;
