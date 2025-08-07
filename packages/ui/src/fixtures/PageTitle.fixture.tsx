import { PageTitle } from "../components/PageTitle";

export default {
  "Default Page Title": (
    <PageTitle mainTitle="페이지 제목" subTitle="페이지에 대한 설명입니다." />
  ),
  "Page Title Only Main": <PageTitle mainTitle="메인 제목만" />,
  "Page Title Only Sub": <PageTitle subTitle="서브 제목만" />,
};
