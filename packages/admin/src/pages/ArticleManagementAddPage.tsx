import { color } from '@mozu/design-token';
import { EditDiv, Input, TextArea } from '@mozu/ui';
import styled from '@emotion/styled';
import { ImgContainer } from '@/components';
import { useAddArticle } from '@/apis';
import { useForm } from '@/hooks';

type FormState = {
  title: string;
  description: string;
  image?: File | null;
};

export const ArticleManagementAddPage = () => {
  const { state, onChangeInputValue, setState } = useForm<FormState>({
    title: '',
    description: '',
    image: null,
  });

  const apiData = useAddArticle();
  const addClick = () => {
    apiData.mutate({
      title: state.title,
      description: state.description,
      image: state.image,
    });
  };

  return (
    <AllContainer>
      <AddContainer>
        <EditDiv
          value1="취소"
          value2="추가하기"
          title="기사 추가"
          onClick={addClick}
        />
        <ContentContainer>
          <InputContainer>
            <Input
              value={state.title}
              name="title"
              onChange={onChangeInputValue}
              placeholder="기사 제목을 입력해 주세요.."
              label="기사 제목"
            />
            <TextArea
              value={state.description}
              name="description"
              onChange={onChangeInputValue}
              placeholder="기사 내용을 입력해 주세요.."
              label="기사 내용"
              height={480}
            />
            <ImgContainer
              label="기사 이미지"
              img={state.image ? URL.createObjectURL(state.image) : ''}
              onImageChange={(file) =>
                setState((prev) => ({ ...prev, image: file as File | null }))
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
