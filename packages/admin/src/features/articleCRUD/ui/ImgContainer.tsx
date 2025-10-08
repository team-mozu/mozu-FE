import styled from "@emotion/styled";
import { color, font } from "@mozu/design-token";
import { Button, Imglogo } from "@mozu/ui";
import { useEffect, useRef, useState } from "react";

interface IImgType {
  label?: string;
  img?: string | File | null;
  onImageChange?: (file: File | string | null | "DELETE") => void;
}

export const ImgContainer = ({ label, img, onImageChange }: IImgType) => {
  const imgRef = useRef<HTMLInputElement>(null); // 타입 명시적 지정
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const imgClick = () => {
    imgRef.current?.click();
  };

  useEffect(() => {
    if (img) {
      if (typeof img === "string") {
        setImgUrl(img);
      } else if (img instanceof File) {
        const url = URL.createObjectURL(img);
        setImgUrl(url);
      }

      if (img === "https://mozu-bucket.s3.ap-northeast-2.amazonaws.com/기사 기본 이미지.svg") {
        setImgUrl("");
      }
    }
  }, [
    img,
  ]);

  const delClick = () => {
    setImgUrl(null);
    if (onImageChange) {
      onImageChange("DELETE");
    }
    if (imgRef.current) {
      imgRef.current.value = "";
    }
  };

  const handleChange = () => {
    const file = imgRef.current?.files?.[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setImgUrl(newUrl);
      onImageChange?.(file);
    }
  };

  return (
    <BtnImgContainer>
      <ImgContent
        type="file"
        ref={imgRef}
        onChange={handleChange}
      />
      <ImgContentContainer>
        <Label>{label}</Label>
        <FakeImgContent>
          {!imgUrl ? (
            <Imglogo />
          ) : (
            <Image
              src={imgUrl}
              alt="기사 이미지"
            />
          )}
        </FakeImgContent>
      </ImgContentContainer>
      <Button
        backgroundColor={color.zinc[50]}
        color={color.zinc[800]}
        borderColor={color.zinc[200]}
        onClick={imgClick}>
        이미지 업로드
      </Button>
      <Button
        backgroundColor={color.red[500]}
        color={color.white}
        borderColor={color.red[500]}
        onClick={delClick}
        disabled={!imgUrl}>
        이미지 삭제
      </Button>
    </BtnImgContainer>
  );
};

const BtnImgContainer = styled.div`
  display: flex;
  gap: 12px 12px;
  align-items: end;
  min-width: 580px;
  @media (min-width: 700px) {
    flex-wrap: wrap;
    margin-bottom: 36px;
  }
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

const Image = styled.img`
  width: 580px;
`;
const FakeImgContent = styled.div`
  overflow: hidden;
  width: 580px;
  height: 320px;
  border-radius: 12px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  display: flex;
  justify-content: center;
  align-items: center;
`;
