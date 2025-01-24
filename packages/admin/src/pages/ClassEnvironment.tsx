import { Tables } from '@/components';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { ArrowLeft, Button, Del, DeleteModal, Edit, Play } from '@mozu/ui';

import { useState } from 'react';
import { useNavigate } from 'react-router';

export const ClassEnvironment = () => {
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState<boolean>(false);
  const isOpen = () => {
    setIsModal(true);
  };
  const isCancle = () => {
    setIsModal(false);
  };
  const isDelete = () => {
    console.log('삭제');
    setIsModal(false);
  };
  const infos = [
    { kind: '수업 이름', value: '2024년도 모의투자' },
    { kind: '투자 차수', value: '5차' },
    { kind: '기초자산', value: '1,000,000원' },
    { kind: '생성일자', value: '2024-05-05' },
  ];
  return (
    <>
      {isModal ? (
        <DeleteModal
          titleComment={`'${infos[0].value}' 삭제하실 건가요?`}
          subComment="삭제하면 복구가 불가능합니다."
          onCancel={isCancle}
          onDelete={isDelete}
        />
      ) : (
        <></>
      )}
      <Wrapper>
        <Head>
          <Container>
            <BackBtn onClick={() => navigate(-1)}>
              <ArrowLeft />
            </BackBtn>
            <TextBox>
              <h2>2024년도 모의투자</h2>
              <p>2024-05-05</p>
            </TextBox>
          </Container>
          <div>
            <Button
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color="white"
              hoverBackgroundColor={color.orange[400]}
              hoverBorderColor={color.orange[400]}
              onClick={() => navigate('start')}
            >
              모의주식투자 시작하기
              <Play />
            </Button>
          </div>
        </Head>
        <Content>
          <Option>
            <InfoBox>
              {infos.map((data, index) => (
                <Info key={index}>
                  <span>{data.kind}</span>
                  {data.value}
                </Info>
              ))}
            </InfoBox>
            <BtnContainer>
              <Button
                backgroundColor={color.zinc[50]}
                borderColor={color.zinc[200]}
                hoverBackgroundColor={color.zinc[100]}
                hoverBorderColor={color.zinc[100]}
                onClick={isOpen}
              >
                삭제하기
                <Del color="black" size={20} />
              </Button>
              <Button
                backgroundColor={color.orange[50]}
                borderColor={color.orange[200]}
                color={color.orange[500]}
                hoverBackgroundColor={color.orange[100]}
                hoverBorderColor={color.orange[100]}
                onClick={() => navigate('edit')}
              >
                수정하기
                <Edit color={color.orange[500]} size={20} />
              </Button>
            </BtnContainer>
          </Option>
          <TableBox>
            <Tables edit={false} tableName="invest" />
            <Tables edit={false} tableName="aritlcle" />
          </TableBox>
        </Content>
      </Wrapper>
    </>
  );
};

const TableBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Option = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BtnContainer = styled.div`
  display: flex;
  gap: 12px;
  height: 40px;
`;

const Info = styled.div`
  display: flex;
  font: ${font.b2};
  > span {
    width: 120px;
    color: ${color.zinc[600]};
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 1260px;
`;

const Content = styled.div`
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  padding: 32px 24px 86px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const BackBtn = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid ${color.zinc[200]};
  background-color: ${color.zinc[50]};
  &:hover {
    background-color: ${color.zinc[100]};
  }
`;

const Wrapper = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Head = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  > div {
    font: ${font.b1};
  }
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  width: 1257px;
  > h2 {
    font: ${font.h2};
  }
  > p {
    font: ${font.b1};
    color: ${color.zinc[500]};
  }
`;
