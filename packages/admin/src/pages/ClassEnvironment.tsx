import { StockTables } from '@/components/common/StockTables';
import { ArticleTables } from '@/components/common/ArticleTables';
import styled from '@emotion/styled';
import { color, font } from '@mozu/design-token';
import { ArrowLeft, Button, Del, DeleteModal, Edit, Play } from '@mozu/ui';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useClassStart, useGetClassDetail, useClassDelete } from '@/apis';
import { formatPrice } from '@/utils/formatPrice';

export const ClassEnvironment = () => {
  const { id } = useParams();
  const classId = id ? parseInt(id) : null;
  const navigate = useNavigate();
  const location = useLocation();

  // API 호출
  const { data: classData, isLoading, refetch } = useGetClassDetail(classId);
  const { mutate: startClass } = useClassStart(classId);
  const { mutate: deleteClass } = useClassDelete();

  // 상태 관리
  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectedRound, setSelectedRound] = useState<number>(1);

  // 차수 변경 시 최대 차수로 업데이트
  useEffect(() => {
    if (classData?.maxInvDeg) {
      setSelectedRound(classData.maxInvDeg);
    }
  }, [classData?.maxInvDeg]);

  // 페이지 이동 시 데이터 갱신
  useEffect(() => {
    refetch();
  }, [location.pathname, refetch]);

  // 삭제 모달 열기
  const openDeleteModal = () => {
    setIsModal(true);
  };

  // 삭제 모달 닫기
  const closeDeleteModal = () => {
    setIsModal(false);
  };

  // 클래스 삭제
  const handleDelete = () => {
    if (!classId) return;

    deleteClass(classId, {
      onSuccess: () => {
        navigate(-1); // 삭제 후 이전 페이지로 이동
      },
      onError: (error) => {
        console.error('클래스 삭제 중 오류 발생:', error);
        alert('클래스 삭제에 실패했습니다.');
      },
    });
    setIsModal(false);
  };

  // 수업 시작
  const handleStartClass = () => {
    startClass();
  };

  // 정보 배열 구성
  const infos = classData
    ? [
        { kind: '수업 이름', value: classData.name || '정보 없음' },
        { kind: '투자 차수', value: `${classData.maxInvDeg}차` || '정보 없음' },
        {
          kind: '기초자산',
          value: `${formatPrice(classData.baseMoney)}원` || '정보 없음',
        },
        { kind: '생성일자', value: classData.createdAt || '정보 없음' },
      ]
    : [];

  // 투자 종목 데이터 가공
  const stockTableData = classData?.classItems
    ? classData.classItems.map((item) => ({
        itemId: item.itemId,
        itemCode: String(item.itemId),
        itemName: item.itemName,
        money: item.money,
        stockChecked: false,
      }))
    : [];

  // 기사 데이터 가공
  const articleTableData = classData?.classArticles || [];

  if (isLoading) {
    return <LoadingWrapper>데이터를 불러오는 중입니다...</LoadingWrapper>;
  }

  return (
    <>
      {isModal && (
        <DeleteModal
          titleComment={`'${classData?.name || ''}' 삭제하실 건가요?`}
          subComment="삭제하면 복구가 불가능합니다."
          onCancel={closeDeleteModal}
          onDelete={handleDelete}
        />
      )}
      <Wrapper>
        <Head>
          <Container>
            <BackBtn onClick={() => navigate(-1)}>
              <ArrowLeft />
            </BackBtn>
            <TextBox>
              <h2>{classData?.name || '정보 없음'}</h2>
              <p>{classData?.createdAt || '날짜 없음'}</p>
            </TextBox>
          </Container>
          <div>
            <Button
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color="white"
              hoverBackgroundColor={color.orange[400]}
              hoverBorderColor={color.orange[400]}
              onClick={handleStartClass}
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
                onClick={openDeleteModal}
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
                onClick={() => navigate(`/class-management/${classId}/edit`)}
              >
                수정하기
                <Edit color={color.orange[500]} size={20} />
              </Button>
            </BtnContainer>
          </Option>
          <TableBox>
            <TableTitle>투자 종목</TableTitle>
            <StockTables
              isEdit={false}
              degree={selectedRound.toString()}
              data={stockTableData}
            />
            <TableTitle>기사 목록</TableTitle>
            <ArticleTables
              isEdit={false}
              degree={selectedRound.toString()}
              data={articleTableData}
            />
          </TableBox>
        </Content>
      </Wrapper>
    </>
  );
};

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  font: ${font.t1};
  color: ${color.zinc[500]};
`;

const TableTitle = styled.div`
  font: ${font.t2};
  margin-bottom: 16px;
`;

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
  font: ${font.t2};
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
