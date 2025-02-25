import { color } from '@mozu/design-token';
import { EditDiv, Input, TextArea } from '@mozu/ui';
import styled from '@emotion/styled';
import { ImgContainer } from '@/components';
import { useState } from 'react';
import { articleManagementAdd } from '@/apis';

export const ArticleManagementAddPage = () => {
  const [datas, setDatas] = useState<{title: string,description: string, image: File}>({title: '', description: '', image: null});

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatas((prev) => ({ ...prev, title: e.target.value }));
  };
  const contentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDatas((prev) => ({ ...prev, description: e.target.value }));
  };


  const apiData = articleManagementAdd();
  const addClick = () => {
    apiData.mutate({title: datas.title, description: datas.description, image: datas.image})
  }


  return (
    <AllContainer>
      <AddContainer>
        <EditDiv value1="취소" value2="추가하기" title="기사 추가" onClick={addClick}/>
        <ContentContainer>
          <InputContainer>
            <Input
              value={datas.title}
              onChange={titleChange}
              placeholder="기사 제목을 입력해 주세요.."
              label="기사 제목"
            />
            <TextArea
             value={datas.description}
             onChange={contentChange}
              placeholder="기사 내용을 입력해 주세요.."
              label="기사 내용"
              height={480}
            />
            <ImgContainer label="기사 이미지" img={datas.image ? URL.createObjectURL(datas.image) : ""} onImageChange={(file) => setDatas((prev) => ({...prev, image: file}))}/>
          </InputContainer>
        </ContentContainer>
      </AddContainer>
    </AllContainer>
  );
};

const AllContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 1028px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;
