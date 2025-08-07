import { InvestInfoTable } from "../components/InvestInfoTable";

const sampleClassItems = [
  {
    itemId: 1,
    itemName: "삼성전자",
    money: [100000, 105000, 110000, 112000, 115000],
  },
  {
    itemId: 2,
    itemName: "카카오",
    money: [50000, 52000, 51000, 53000],
  },
  {
    itemId: 3,
    itemName: "네이버",
    money: [200000, 201000, 205000, 203000, 208000, 210000],
  },
  {
    itemId: 4,
    itemName: "LG화학",
    money: [700000, 710000, 705000],
  },
];

export default {
  "Default InvestInfoTable": (
    <InvestInfoTable classItems={sampleClassItems} />
  ),
};
