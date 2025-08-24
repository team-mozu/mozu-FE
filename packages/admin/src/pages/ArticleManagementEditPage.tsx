import styled from "@emotion/styled";
import { color } from "@mozu/design-token";
import { EditDiv, Input, TextArea } from "@mozu/ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useEditArticle, useGetArticleDetail } from "@/apis";
import { ImgContainer } from "@/components";

export const ArticleManagementEditPage = () => {
  const { classId, id } = useParams();
  const articleId = id ? parseInt(id) : null;

  const [datas, setDatas] = useState<{
    title: string;
    content: string;
    imgUrl: File | string | null;
  }>({
    title: "",
    content: "",
    imgUrl: null,
  });

  const { data: articleData, isLoading } = useGetArticleDetail(articleId);

  useEffect(() => {
    if (articleData) {
      setDatas({
        title: articleData.title || "",
        content: articleData.description || "",
        imgUrl: articleData.image || null,
      });
    }
  }, [
    articleData,
  ]);

  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatas(prev => ({
      ...prev,
      title: e.target.value,
    }));
  };
  const contentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDatas(prev => ({
      ...prev,
      content: e.target.value,
    }));
  };

  const apiData = useEditArticle();

  const saveClick = () => {
    let imageFile = datas.imgUrl;

    if (typeof datas.imgUrl === "string") {
      imageFile = "";
    } else if (datas.imgUrl instanceof File) {
      imageFile = datas.imgUrl;
    }

    apiData.mutate({
      title: datas.title,
      description: datas.content,
      image: imageFile ?? undefined,
      articleId: articleId ?? 0,
    });
  };

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
            <ImgContainer
              label="기사 이미지"
              img={datas.imgUrl && datas.imgUrl instanceof File ? URL.createObjectURL(datas.imgUrl) : datas.imgUrl}
              onImageChange={newImgUrl =>
                setDatas(prev => ({
                  ...prev,
                  imgUrl: newImgUrl,
                }))
              }
            />
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
  width: 100%;
  padding: 40px;
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 1028px;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.white};
  border-radius: 16px;
  padding: 530px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;
