export interface AuthResponse {
  accessToken: string;
}

export interface StudentLoginProps {
  classNum: number | null;
  schoolName: string;
  teamName: string;
}
