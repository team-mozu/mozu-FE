import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { color, font } from '@mozu/design-token';
import { Imglogo, Button } from '@mozu/ui';

interface ILogoType {
  img?: string;
  onImageChange?: (file: File | null) => void
}

export const LogoUploader = ({img, onImageChange}: ILogoType) => {
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        onImageChange?.(file)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLogo = () => {
    setLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      onImageChange(null);
    }
  };

  useEffect(() => {
      if(img) {
        if (typeof img === 'string') {
          setLogo(img);
        } else if (img instanceof File) {
          const url = URL.createObjectURL(img)
          setLogo(url);
        }
      }
    }, [img]);

  return (
    <Container>
      <Label>종목 로고</Label>
      <div>
        <LogoContainer>
          {logo ? (
            <LogoImage
              src={logo}
              alt="로고 미리보기"
              onError={(e) => {
                e.currentTarget.src = 'fallback-image-url';
                setLogo(null);
              }}
            />
          ) : (
            <Imglogo size={24} color={color.black} />
          )}
        </LogoContainer>
        <ButtonContaienr>
          <Button
            backgroundColor={color.zinc[50]}
            borderColor={color.zinc[200]}
            color={color.zinc[800]}
            onClick={() => document.getElementById('fileInput')?.click()}
            hoverBackgroundColor={color.zinc[100]}
          >
            로고 업로드
          </Button>
          <Button
            backgroundColor={color.red[500]}
            color={color.white}
            onClick={handleDeleteLogo}
            disabled={!logo}
            hoverBackgroundColor={color.red[600]}
          >
            로고 삭제
          </Button>
        </ButtonContaienr>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          ref={fileInputRef} // 추가
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  > div {
    display: flex;
    align-items: end;
    gap: 8px;
  }
`;

const LogoContainer = styled.div`
overflow: hidden;
  width: 128px;
  height: 128px;
  background-color: ${color.zinc[50]};
  border-radius: 12px;
  border: 1px solid ${color.zinc[200]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContaienr = styled.div`
  display: flex;
  align-items: end;
  gap: 8px;
`;

const LogoImage = styled.img`
  width: 100%;
  object-fit: contain;
  border-radius: 12px;
`;

const UploadButton = styled(Button)`
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  color: ${color.zinc[800]};
`;

const Label = styled.label`
  font: ${font.b1};
  color: ${color.zinc[800]};
`;
