import { color } from "@mozu/design-token";
import { Button } from "../components/Button";

export default {
  "Default Button": <Button>기본 버튼</Button>,

  "Primary Button": (
    <Button
      backgroundColor={color.orange[500]}
      color={color.white}
      borderColor={color.orange[500]}
      hoverBackgroundColor={color.orange[600]}
      hoverBorderColor={color.orange[600]}
      activeBackgroundColor={color.orange[700]}
      activeBorderColor={color.orange[700]}
    >
      Primary 버튼
    </Button>
  ),

  "Secondary Button": (
    <Button
      backgroundColor="transparent"
      color={color.orange[500]}
      borderColor={color.orange[500]}
      hoverBackgroundColor={color.orange[50]}
      hoverColor={color.orange[600]}
      activeBackgroundColor={color.orange[100]}
    >
      Secondary 버튼
    </Button>
  ),

  "Danger Button": (
    <Button
      backgroundColor={color.red[500]}
      color={color.white}
      borderColor={color.red[500]}
      hoverBackgroundColor={color.red[600]}
      hoverBorderColor={color.red[600]}
      activeBackgroundColor={color.red[700]}
    >
      Danger 버튼
    </Button>
  ),

  // Icon Buttons - All Types
  "Start Icon Button": (
    <Button
      isIcon={true}
      type="startImg"
      iconSize={20}
      iconColor={color.white}
      backgroundColor={color.orange[500]}
      borderColor={color.orange[500]}
      hoverBackgroundColor={color.orange[600]}
    >
      시작
    </Button>
  ),

  "Plus Icon Button": (
    <Button
      isIcon={true}
      type="plusImg"
      iconSize={18}
      iconColor={color.white}
      backgroundColor={color.green[500]}
      borderColor={color.green[500]}
      hoverBackgroundColor={color.green[600]}
    >
      추가
    </Button>
  ),

  "Edit Icon Button": (
    <Button
      isIcon={true}
      type="editImg"
      iconSize={16}
      iconColor={color.white}
      backgroundColor={color.blue[500]}
      borderColor={color.blue[500]}
      hoverBackgroundColor={color.blue[600]}
    >
      편집
    </Button>
  ),

  "Delete Icon Button": (
    <Button
      isIcon={true}
      type="delImg"
      iconSize={16}
      iconColor={color.white}
      backgroundColor={color.red[500]}
      borderColor={color.red[500]}
      hoverBackgroundColor={color.red[600]}
    >
      삭제
    </Button>
  ),

  "Save Icon Button": (
    <Button
      isIcon={true}
      type="saveImg"
      iconSize={16}
      iconColor={color.white}
      backgroundColor={color.green[500]}
      borderColor={color.green[500]}
      hoverBackgroundColor={color.green[600]}
    >
      저장
    </Button>
  ),

  "Cancel Icon Button": (
    <Button
      isIcon={true}
      type="cancelImg"
      iconSize={16}
      iconColor={color.zinc[600]}
      backgroundColor="transparent"
      borderColor={color.zinc[300]}
      hoverBackgroundColor={color.zinc[50]}
    >
      취소
    </Button>
  ),

  "Logout Icon Button": (
    <Button
      isIcon={true}
      type="logOutImg"
      iconSize={16}
      iconColor={color.white}
      backgroundColor={color.red[500]}
      borderColor={color.red[500]}
      hoverBackgroundColor={color.red[600]}
    >
      로그아웃
    </Button>
  ),

  "Article Icon Button": (
    <Button
      isIcon={true}
      type="articleImg"
      iconSize={18}
      iconColor={color.white}
      backgroundColor={color.blue[500]}
      borderColor={color.blue[500]}
      hoverBackgroundColor={color.blue[600]}
    >
      게시글
    </Button>
  ),

  "Ranking Icon Button": (
    <Button
      isIcon={true}
      type="rankingImg"
      iconSize={18}
      color={color.orange[500]}
      iconColor={color.orange[500]}
      backgroundColor={color.orange[50]}
      borderColor={color.orange[500]}
      hoverBackgroundColor={color.orange[100]}
    >
      최종 랭킹 보기
    </Button>
  ),

  // Icon Only Buttons
  "Icon Only - Plus": (
    <Button
      isIcon={true}
      type="plusImg"
      iconSize={20}
      iconColor={color.orange[500]}
      backgroundColor="transparent"
      borderColor={color.orange[500]}
      hoverBackgroundColor={color.orange[50]}
      width={40}
    />
  ),

  "Icon Only - Edit": (
    <Button
      isIcon={true}
      type="editImg"
      iconSize={16}
      iconColor={color.blue[500]}
      backgroundColor="transparent"
      borderColor={color.blue[500]}
      hoverBackgroundColor={color.blue[50]}
      width={36}
    />
  ),

  // Size Variations
  "Small Button": (
    <Button
      backgroundColor={color.orange[500]}
      color={color.white}
      borderColor={color.orange[500]}
      width={80}
    >
      Small
    </Button>
  ),

  "Large Button": (
    <Button
      backgroundColor={color.orange[500]}
      color={color.white}
      borderColor={color.orange[500]}
      width={200}
    >
      Large Button
    </Button>
  ),

  // States
  "Disabled Button": (
    <Button
      disabled
      backgroundColor={color.zinc[300]}
      color={color.zinc[500]}
      borderColor={color.zinc[300]}
    >
      비활성화 버튼
    </Button>
  ),

  "Disabled Icon Button": (
    <Button
      disabled
      isIcon={true}
      type="plusImg"
      iconSize={16}
      iconColor={color.zinc[400]}
      backgroundColor={color.zinc[200]}
      borderColor={color.zinc[300]}
    >
      비활성화
    </Button>
  ),

  // Special Effects
  "Button with Box Shadow": (
    <Button
      backgroundColor={color.orange[500]}
      color={color.white}
      borderColor={color.orange[500]}
      hoverBackgroundColor={color.orange[600]}
      hoverBoxShadow="0 4px 12px rgba(255, 165, 0, 0.3)"
    >
      Shadow Effect
    </Button>
  ),

  "Gradient-like Button": (
    <Button
      backgroundColor={color.blue[500]}
      color={color.white}
      borderColor={color.blue[600]}
      hoverBackgroundColor={color.blue[600]}
      hoverBorderColor={color.blue[700]}
      activeBackgroundColor={color.blue[700]}
      activeBorderColor={color.blue[800]}
      activeColor={color.blue[50]}
    >
      Gradient Style
    </Button>
  ),
};
