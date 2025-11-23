export interface SettlementLocationDto {
  id: number,
  location_code: string,
  name: string,
  created_at: string,
  updated_at: string,
  deleted_at: string | null
}

export interface SettlementPlantContractDto {
  id: number;
  updated_at: string;
  created_at: string;
  modified_at: string;
  deleted_at: string | null;
  haezoom_number: string;
  contract_hz_date: string;
  tax_invoice_method: string;
  settlement_cycle: string;
  contract_number: string;
  contract_start_date: string;
  contract_end_date: string;
  auto_renewal: boolean;
  e_powermarket_code: string;
  generator_code: string;
  main_company_ratio: string;
  partner_company_ratio: string | null;
  delegation_settlement: boolean;
  kpx_identifier: number;
  main_company: number;
  partner_company: number | null;
  location: number;
}

export interface SettlementPlantDto {
  id: number;
  // location_id: number;
  location: SettlementLocationDto;
  plant_contracts: Array<SettlementPlantContractDto>;

  created_at: string;
  updated_at: string;
  kpx_cbp_gen_id: string;
  name: string;
}