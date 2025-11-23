interface KpxIdentifierDto {
  id: number;
  kpx_cbp_gen_id: string;
}

interface ResourceInverterDto {
  id: number;
  capacity: number;
  tilt: number;
  azimuth: number;
  install_type: string;
  module_type: string;
}

interface ResourceEssDto {
  // TODO:
}

interface ResourceInfraDto {
  name: string;
  type: '태양광' | '풍력';
  address: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
  capacity: number;
  install_date: string | null;
  kpx_identifier: KpxIdentifierDto | null;
  inverter: Array<ResourceInverterDto>
  ess: Array<ResourceEssDto>;
}

interface ResourceMonitoringDto {
  id: number;
  company: number; // company ID
  rtu_id: string;
}

interface ResourceControlDto {
  id: number;
  company: number; // company ID
  control_type: number; // controlTypeId
  controllable_capacity: number;
  // rtu_id: string,
  // onoff_inverter_capacity: {},
  // priority: number,
}

interface Contract {
  id: number;
  modified_at: string | null;
  contract_type: string;
  contract_date: string;
  weight: number;
  fixed_contract_type: string;
  fixed_contract_price: number;
  fixed_contract_agreement_date: string;
  rec_price: number | null;
}

export interface ResourceDto {
  id: number;
  modified_at: string;
  infra: ResourceInfraDto;
  monitoring: ResourceMonitoringDto | null;
  control: Array<ResourceControlDto> | null;
  contract: Contract | null;

  substation: number | null; // substation ID
  dl: number | null; // dl ID
  fixed_contract_price: number;
  control_lower_limit: number | null;
  guaranteed_capacity: number;
}