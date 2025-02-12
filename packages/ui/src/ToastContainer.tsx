import styled from '@emotion/styled';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CustomToastContainer = styled(ToastContainer)`
  .Toastify__progress-bar {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .Toastify__close-button:hover {
    color: white;
  }
`;
