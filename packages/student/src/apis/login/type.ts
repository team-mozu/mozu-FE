export interface AuthResponse {
  accessToken: string;
}

export interface StudentLoginProps {
  lessonNum: number | null;
  schoolName: string;
  teamName: string;
}
