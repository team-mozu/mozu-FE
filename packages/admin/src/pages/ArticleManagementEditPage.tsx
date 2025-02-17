import { color } from '@mozu/design-token';
import { EditDiv, Input, TextArea } from '@mozu/ui';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { ImgContainer } from '@/components';
import { articleManagementDetail, articleManagementEdit } from '@/apis';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

export const ArticleManagementEditPage = () => {
  const {id} = useParams();
  const articleId = id? parseInt(id) : null;

  const [datas, setDatas] = useState<{
    title: string;
    content: string;
    imgUrl: File;
  }>({
    title: '',
    content:
      '',
    imgUrl: null,
  });

  const {data: articleData, isLoading} = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => articleManagementDetail(articleId),
    enabled: !!articleId,
  })

  useEffect(() => {
    if(articleData?.data) {
      setDatas({
        title: articleData.data.title || '',
        content: articleData.data.description || '',
        imgUrl: articleData.data.image || null,
      });
    }
  }, [articleData])

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatas((prev) => ({ ...prev, title: e.target.value }));
  };
  const contentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDatas((prev) => ({ ...prev, content: e.target.value }));
  };

  const apiData = articleManagementEdit();

  const saveClick = () => {
    if(articleId) {
      const imageFile = new File([datas.imgUrl], "image.jpg", { type: datas.imgUrl.type });
      apiData.mutate({title: datas.title, description: datas.content, image: imageFile, articleId:articleId})
    }
  }

  console.log(datas)

  return (
    <AllContainer>
      <AddContainer>
        <EditDiv
          value1="취소"
          value2="저장하기"
          title="기사 수정"
          iconColor2={color.white}
          iconSize2={20}
          isIcon2={true}
          type2="saveImg"
          onClick={saveClick}
        />
        <ContentContainer>
          <InputContainer>
            <Input
              placeholder="기사 제목을 입력해 주세요.."
              label="기사 제목"
              value={datas.title}
              onChange={titleChange}
            />
            <TextArea
              placeholder="기사 내용을 입력해 주세요.."
              label="기사 내용"
              height={480}
              value={datas.content}
              onChange={contentChange}
            />
            <ImgContainer label="기사 이미지" img={datas.imgUrl} onImageChange={(newImgUrl) => setDatas((prev) => ({...prev, imgUrl: newImgUrl}))}/>
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
  margin-top: 40px;
`;

const InputContainer = styled.div`
  width: 1512px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 1560px;
  gap: 8px;
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
