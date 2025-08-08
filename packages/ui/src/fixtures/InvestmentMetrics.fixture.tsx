import { InvestmentMetrics } from "../components/InvestmentMetrics";

export default {
  "Default Investment Metrics": (
    <InvestmentMetrics
      title="총 투자 금액"
      subTitle="현재까지 투자한 총 금액"
      number="1,234,567,890원"
    />
  ),
  "Investment Metrics with Short Title": (
    <InvestmentMetrics
      title="수익률"
      subTitle="총 수익률"
      number="+15.23%"
    />
  ),
};
