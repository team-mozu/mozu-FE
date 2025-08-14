import { color } from "@mozu/design-token";
import { Button } from "../components/Button";

export default {
  "Default Button": <Button>기본 버튼</Button>,
  "Orange Button": (
    <Button
      backgroundColor={color.orange[500]}
      color={color.white}
      borderColor={color.orange[500]}
      hoverBackgroundColor={color.orange[600]}
    >
      주황색 버튼
    </Button>
  ),
  "Icon Button": (
    <Button
      isIcon={true}
      type="plusImg"
      iconSize={20}
      iconColor={color.white}
      backgroundColor={color.orange[500]}
      borderColor={color.orange[500]}
      hoverBackgroundColor={color.orange[600]}
    >
      아이콘 버튼
    </Button>
  ),
  "Disabled Button": <Button disabled>비활성화 버튼</Button>,
};
