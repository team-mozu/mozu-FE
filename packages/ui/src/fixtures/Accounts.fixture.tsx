import { Accounts } from "../components/Accounts";

export default {
  "Default Accounts": (
    <Accounts
      title="총 자산"
      content={123456789}
    />
  ),
  "String Content Accounts": (
    <Accounts
      title="계좌 상태"
      content="활성"
    />
  ),
};
