import styled from "@emotion/styled";
import { color, font, Skeleton } from "@mozu/design-token";
import { Button, Modal, SvgIcon } from "@mozu/ui";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDeleteClass, useGetClassDetail, useStartClass } from "@/entities/class";
import { ArticleTables } from "@/features/articleCRUD/ui/ArticleTables";
import { formatPrice } from "@/shared/lib";
import { FullPageLoader, StockTables } from "@/shared/ui";

export const ClassEnvironment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // API 호출
  const { data: classData, isLoading: apiLoading, refetch } = useGetClassDetail(id ?? "");

  const [isLoading, setIsLoading] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    setIsLoading(true);
  }, [
    id,
  ]);

  useEffect(() => {
    if (!apiLoading && classData) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [
    apiLoading,
    classData,
  ]);

  const { mutate: startClass } = useStartClass(id ?? "");
  const { mutate: deleteClass, isPending } = useDeleteClass(id, () => setIsModal(false));

  // 상태 관리
  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [isStarting, setIsStarting] = useState<boolean>(false);

  // 차수 변경 시 최대 차수로 업데이트
  useEffect(() => {
    if (classData?.maxInvRound) {
      setSelectedRound(classData.maxInvRound);
    }
  }, [
    classData?.maxInvRound,
  ]);

  // 페이지 이동 시 데이터 갱신
  // biome-ignore lint/correctness/useExhaustiveDependencies: <임시>
  useEffect(() => {
    refetch();
  }, [
    location.pathname,
    refetch,
  ]);

  // 삭제 모달 열기
  const openDeleteModal = () => {
    setIsModal(true);
  };

  // 클래스 삭제
  const handleDelete = () => {
    if (id !== null) {
      deleteClass();
      navigate("/class-management");
    }
  };

  // 수업 시작
  const handleStartClass = () => {
    if (isStarting || !id) return;
    setIsStarting(true);
    startClass(undefined, {
      onSettled: () => {
        setIsStarting(false);
      },
    });
  };

  // 정보 배열 구성
  const infos = classData
    ? [
      {
        kind: "수업 이름",
        value: classData.name || "정보 없음",
      },
      {
        kind: "투자 차수",
        value: `${classData.maxInvRound}차` || "정보 없음",
      },
      {
        kind: "기초자산",
        value: `${formatPrice(classData.baseMoney)}원` || "정보 없음",
      },
      {
        kind: "생성일자",
        value: classData.createdAt || "정보 없음",
      },
    ]
    : [];

  // 투자 종목 데이터 가공
  const stockTableData = classData?.lessonItems
    ? classData.lessonItems.map(item => ({
      itemId: item.itemId,
      itemCode: item.itemId,
      itemName: item.itemName,
      money: item.money,
      stockChecked: false,
    }))
    : [];

  // 기사 데이터 가공
  const articleTableData = classData?.lessonArticles || [];

  //리렌더링 최적화
  const stockData = useMemo(
    () => stockTableData,
    [
      stockTableData,
    ],
  );
  const articleData = useMemo(
    () => articleTableData,
    [
      articleTableData,
    ],
  );

  if (apiLoading) return <FullPageLoader />;

  return (
    <>
      {isModal && (
        <Modal
          mainTitle={`'${classData?.name || ""}'을 삭제하실 건가요?`}
          subTitle="삭제하면 복구가 불가능합니다."
          onSuccessClick={handleDelete}
          icon={
            <SvgIcon
              name="del"
              size={24}
              color={color.red[400]}
            />
          }
          isOpen={isModal}
          setIsOpen={setIsModal}
          isPending={isPending}
        />
      )}
      <Wrapper>
        <Head>
          <Container>
            <BackBtn onClick={() => navigate("/class-management")}>
              <SvgIcon name="arrow-left" />
            </BackBtn>
            <TextBox>
              {isLoading ? <H2Div>{classData?.name}</H2Div> : <h2>{classData?.name || "정보 없음"}</h2>}
              {isLoading ? <PDiv>{classData?.createdAt}</PDiv> : <p>{classData?.createdAt || "날짜 없음"}</p>}
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
              disabled={isLoading || isStarting}>
              모의주식투자 시작하기
              <SvgIcon name="start" />
            </Button>
          </div>
        </Head>
        <Content>
          <Option>
            <InfoBox>
              {isLoading
                ? infos.map(data => (
                  <InfoDiv key={data.kind}>
                    <span>{data.kind}</span>
                    {data.value}
                  </InfoDiv>
                ))
                : infos.map(data => (
                  <Info key={data.kind}>
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
                disabled={isLoading}>
                삭제하기
                <SvgIcon
                  name="del"
                  color="black"
                  size={20}
                />
              </Button>
              <Button
                backgroundColor={color.orange[50]}
                borderColor={color.orange[200]}
                color={color.orange[500]}
                hoverBackgroundColor={color.orange[100]}
                hoverBorderColor={color.orange[100]}
                onClick={() => navigate(`/class-management/${id}/edit`)}
                disabled={isLoading}>
                수정하기
                <SvgIcon
                  name="edit"
                  color={color.orange[500]}
                  size={20}
                />
              </Button>
            </BtnContainer>
          </Option>
          <TableBox>
            <StockTables
              isApiLoading={isLoading}
              isEdit={false}
              degree={selectedRound.toString()}
              data={stockData}
            />
            <ArticleTables
              isApiLoading={isLoading}
              isEdit={false}
              degree={selectedRound.toString()}
              data={articleData}
            />
          </TableBox>
        </Content>
      </Wrapper>
    </>
  );
};

const PDiv = styled(Skeleton)`
  color: transparent;
  width: fit-content;
`;

const H2Div = styled(Skeleton)`
  color: transparent;
`;

const TableBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
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

const InfoDiv = styled(Skeleton)`
  display: flex;
  font: ${font.t2};
  color: transparent;
  > span {
    width: 120px;
    color: transparent;
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: fit-content;
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
  width: fit-content;
  > h2 {
    font: ${font.h2};
  }
  > p {
    font: ${font.b1};
    color: ${color.zinc[500]};
  }
`;
