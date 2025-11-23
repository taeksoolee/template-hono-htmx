export interface GroupDto {
  id: number;
  name: string;
  kpx_code: string;
  grid: '제주' | '육지';
  // ems_did: number;
  participation_type: "입찰제도" | "준중앙제도";
}