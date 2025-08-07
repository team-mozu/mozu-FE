import { Toast } from "../components/Toast";
import { CustomToastContainer } from "../components/ToastContainer";
import { color } from "@mozu/design-token";

export default {
  "Toast Examples": () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button
        onClick={() =>
          Toast("성공적으로 작업을 완료했습니다!", { type: "success" })
        }
        style={{
          padding: "10px 20px",
          backgroundColor: color.green[500],
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Show Success Toast
      </button>
      <button
        onClick={() => Toast("오류가 발생했습니다.", { type: "error" })}
        style={{
          padding: "10px 20px",
          backgroundColor: color.red[500],
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Show Error Toast
      </button>
      <button
        onClick={() => Toast("정보 메시지입니다.", { type: "info" })}
        style={{
          padding: "10px 20px",
          backgroundColor: color.black,
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Show Info Toast
      </button>
      <button
        onClick={() => Toast("경고 메시지입니다.", { type: "warning" })}
        style={{
          padding: "10px 20px",
          backgroundColor: color.orange[500],
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Show Warning Toast
      </button>
      <CustomToastContainer />
    </div>
  ),
};
