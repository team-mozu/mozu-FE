import { formatPrice } from '@/utils/formatPrice';
import styled from '@emotion/styled';
import { font, color } from '@mozu/design-token';
import { Button, Input, Select } from '@mozu/ui';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { useClassCreate } from '@/apis';
import { InvestmentItemsTable } from './InvestmentItemsTable';
import { AddInvestItemModal } from './AddInvestItemModal';
import { ClassItemRequest } from '@/apis/class/type';

export const CreateClass = () => {
  const navigate = useNavigate();
  const { mutate: mutateClassCreate } = useClassCreate();
  const [className, setClassName] = useState<string>('');
  const [classDeg, setClassDeg] = useState<'3' | '4' | '5'>('3');
  const [baseMoney, setBaseMoney] = useState<number>(1000000);
  const [classItems, setClassItems] = useState<ClassItemRequest[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [stockData, setStockData] = useState<any[]>([]);

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
  };

  const onDegreeChange = (value: '3' | '4' | '5') => {
    setClassDeg(value);
  };

  const onBaseMoneyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const numValue = value === '' ? 0 : parseInt(value, 10);

    setBaseMoney(numValue);
  };

  const handleAddItems = (newItems: ClassItemRequest[]) => {
    // Add new items to the classItems array
    setClassItems([...classItems, ...newItems]);

    // Convert ClassItemRequest[] to display format for the table
    const newStockData = newItems.map((item) => {
      // Fetch the item name from the server response or use a placeholder
      // In a real app, you would store the name in the state or fetch it
      const itemName = `Item ${item.id}`;

      return {
        itemId: item.id,
        itemCode: String(item.id), // Using ID as code for now
        itemName: itemName,
        money: item.money,
        stockChecked: false,
      };
    });

    setStockData([...stockData, ...newStockData]);
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const onDeleteItems = (itemIds: number[]) => {
    // Remove items from the classItems array
    setClassItems(classItems.filter((item) => !itemIds.includes(item.id)));

    // Remove items from the stockData array
    setStockData(stockData.filter((item) => !itemIds.includes(item.itemId)));
  };

  const handleUpdateItemPrice = (
    itemId: number,
    levelIndex: number,
    value: number | null,
  ) => {
    // Update the price in classItems
    setClassItems((items) =>
      items.map((item) => {
        if (item.id === itemId) {
          const updatedMoney = [...item.money];
          updatedMoney[levelIndex] = value || 0;
          return { ...item, money: updatedMoney };
        }
        return item;
      }),
    );

    // Update the price in stockData for display
    setStockData((data) =>
      data.map((item) => {
        if (item.itemId === itemId) {
          const updatedMoney = [...item.money];
          updatedMoney[levelIndex] = value;
          return { ...item, money: updatedMoney };
        }
        return item;
      }),
    );
  };

  const onSubmit = () => {
    // Validate inputs
    if (!className.trim()) {
      alert('수업 이름을 입력해주세요.');
      return;
    }

    if (classItems.length === 0) {
      alert('최소 하나 이상의 투자 종목을 추가해주세요.');
      return;
    }

    console.log({
      className: className,
      classDeg: parseInt(classDeg),
      baseMoney: baseMoney,
      classItems: classItems,
    });

    // Submit the data using the mutation function
    // mutateClassCreate({
    //   className: className,
    //   classDeg: parseInt(classDeg),
    //   baseMoney: baseMoney,
    //   classItems: classItems,
    // });
  };

  return (
    <Container>
      <Header>
        수업환경 생성
        <BtnContainer>
          <Button
            backgroundColor={color.zinc[50]}
            borderColor={color.zinc[200]}
            color={color.zinc[800]}
            hoverBackgroundColor={color.zinc[100]}
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button
            backgroundColor={color.orange[500]}
            borderColor={color.orange[500]}
            color={color.white}
            hoverBackgroundColor={color.orange[600]}
            onClick={onSubmit}
          >
            생성하기
          </Button>
        </BtnContainer>
      </Header>
      <Contents>
        <TextField>
          <FlexColumnBox>
            수업 이름
            <Input
              placeholder="수업 이름을 입력해 주세요.."
              width="1080px"
              value={className}
              onChange={onTitleChange}
            />
          </FlexColumnBox>
          <FlexColumnBox>
            투자 차수
            <SelectField>
              <Select
                data={['3', '4', '5']}
                width={120}
                height={48}
                padding={{ top: 14, bottom: 14, left: 16, right: 10 }}
                value={classDeg}
                onChange={onDegreeChange}
              />
              차
            </SelectField>
          </FlexColumnBox>
          <FlexColumnBox>
            기초자산
            <AssetField>
              <AssetInput
                type="text"
                onChange={onBaseMoneyChange}
                value={formatPrice(baseMoney)}
              />
              원
            </AssetField>
          </FlexColumnBox>
        </TextField>
        <TableField>
          <TableHeader>
            <Text>투자 종목</Text>
            <Button
              backgroundColor={color.orange[500]}
              borderColor={color.orange[500]}
              color={color.white}
              hoverBackgroundColor={color.orange[600]}
              onClick={handleOpenAddModal}
            >
              투자 종목 추가
            </Button>
          </TableHeader>
          <InvestmentItemsTable
            isEdit
            degree={classDeg}
            data={stockData}
            onPriceChange={handleUpdateItemPrice}
            onDeleteItems={onDeleteItems}
          />
        </TableField>
      </Contents>

      {showAddModal && (
        <AddInvestItemModal
          close={handleCloseAddModal}
          onItemsSelected={handleAddItems}
          selectedDegree={parseInt(classDeg)}
          existingItems={classItems}
        />
      )}
    </Container>
  );
};

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Text = styled.div`
  font: ${font.t2};
`;

export const TableField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const AssetField = styled.div`
  display: flex;
  align-items: center;
  font: ${font.t4};
  gap: 8px;
`;

export const AssetInput = styled.input`
  background-color: ${color.zinc[50]};
  border: 1px solid ${color.zinc[200]};
  border-radius: 8px;
  padding: 14px 16px;
  height: 48px;
  width: 210px;
  font: ${font.b2};
  :focus {
    border: 1px solid ${color.orange[300]};
  }
`;

export const FlexColumnBox = styled.div`
  display: flex;
  flex-direction: column;
  font: ${font.b1};
  gap: 8px;
`;

export const SelectField = styled.div`
  display: flex;
  align-items: center;
  font: ${font.t4};
  gap: 8px;
`;

export const TextField = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

export const Contents = styled.div`
  background-color: ${color.white};
  border: 1px solid ${color.zinc[200]};
  width: 1560px;
  height: fit;
  border-radius: 16px;
  padding: 32px 24px 52px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

export const BtnContainer = styled.div`
  display: flex;
  gap: 12px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  gap: 8px;
`;

export const Header = styled.div`
  width: 1560px;
  height: 64px;
  border: 1px solid ${color.zinc[200]};
  border-radius: 16px;
  background-color: ${color.white};
  font: ${font.t1};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px 12px 24px;
`;
