import styled from "@emotion/styled";
import { Spinner } from "@mozu/ui";

export const FullPageLoader = () => {
  return (
    <LoaderWrapper>
      <Spinner size={48} />
    </LoaderWrapper>
  );
};

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;