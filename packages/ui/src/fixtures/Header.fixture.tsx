import { Header } from "../components/Header";
import { BrowserRouter } from "react-router-dom";

export default {
  "Admin Header": (
    <BrowserRouter>
      <Header
        isAdmin={true}
        showNav={false}
        showRound={false}
      />
    </BrowserRouter>
  ),
  "Student Header": (
    <BrowserRouter>
      <Header
        isAdmin={false}
        invDeg={1}
        showNav={true}
        showRound={true}
      />
    </BrowserRouter>
  ),
};
