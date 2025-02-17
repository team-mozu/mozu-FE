import { color, font } from '@mozu/design-token';
import styled from '@emotion/styled';
import { useRef, useState, useEffect } from 'react';
import { Imglogo, Button } from '@mozu/ui';

interface IImgType {
  label?: string;
  img?: string;
  onImageChange?: (file: File | null) => void
}

export const ImgContainer = ({ label, img, onImageChange }: IImgType) => {
  const imgRef = useRef<HTMLInputElement>(null); // 타입 명시적 지정
  const [imgUrl, setImgUrl] = useState<File | null>(null);

  const imgClick = () => {
    imgRef.current?.click();
  };

  useEffect(() => {
    if (img) {
      setImgUrl(img);
    }
  }, [img]);

  const delClick = () => {
    setImgUrl(null); // 이미지 URL 초기화
    if (imgRef.current) {
      imgRef.current.value = ''; // 파일 입력값 초기화 (핵심 수정 부분)
    }
  };

  const handleChange = () => {
    const file = imgRef.current?.files?.[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setImgUrl(newUrl);
      onImageChange?.(file)
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
  background-image: ${({ imgUrl }) =>
    imgUrl ? `url(${imgUrl})` : 'none'}; // 명시적 배경 설정
  background-size: cover;
  background-position: center;
`;
