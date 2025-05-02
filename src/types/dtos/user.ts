export interface RolePointResponseDto {
  role: string;
  point: number;
}

export interface UserInfoResponseDto {
  id: number;
  nickname: string;
  roles: RolePointResponseDto[];
}
