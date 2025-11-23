import got from "got";
import { Tokens } from "../../../types/tokens";
import { ResourceDto } from "./dto";
import { createGotOptions } from "../utils";
import { groupsRepository } from "../group/repository";
import { settlementPlantsRepository } from "../settlement-plant/repository";
import { groupAssignsRepository } from "../group-assign/repository";
import { GroupDto } from "../group/dto";
import { GroupAssignDto } from "../group-assign/dto";
import { SettlementPlantDto } from "../settlement-plant/dto";


export interface ExpandedResourceDto extends ResourceDto {
  settlementPlant: SettlementPlantDto | null;
}

export interface ResourcesResponse {
  results: Array<ResourceDto>;
}

export interface ExpandedResourceWithGroupDto extends ExpandedResourceDto {
  group: GroupDto | null;
  group_assign: GroupAssignDto | null;
}

export const resourcesRepository = (() => {
  let listCache: Promise<Array<ExpandedResourceDto> | null> = Promise.resolve(null);

  const clearCache = () => {
    listCache = Promise.resolve(null);
  };

  const getList = async (token: Tokens['accessToken']): Promise<ExpandedResourceDto[] | null> => {
    let listResponse = await listCache;

    if (listResponse === null) {
      const settlementPlantsPromise = settlementPlantsRepository.getList(token);

      const resourcesPromise = got('https://apidev.vpphaezoom.com/api/resource/', createGotOptions('GET', token))
        .json<ResourcesResponse>()
        .then((response) => response.results)
        .catch((err) => {
          console.log('Failed to fetch resources ::: ' + err);
          return null;
        });

      listCache = Promise.all([resourcesPromise, settlementPlantsPromise])
        .then(([resources, settlementPlants]) => {
          if (!resources || !settlementPlants) {
            return null;
          }

          const settlementPlantsMap = settlementPlants.reduce((map, plant) => {
            map[plant.kpx_cbp_gen_id] = plant;
            return map;
          }, {} as Record<string, SettlementPlantDto>);

          return resources.map((resource) => ({
            ...resource,
            settlementPlant: settlementPlantsMap[resource.infra.kpx_identifier?.kpx_cbp_gen_id || ''] || null,
          })) satisfies ExpandedResourceDto[];
        }).catch((err) => {
          console.log('Failed to process resources ::: ' + err);
          return null;
        });

      listResponse = await listCache;
    }

    return listResponse ?? null;
  }

  const getListWithGroupByDate = async (token: Tokens['accessToken'], date: string): Promise<ExpandedResourceWithGroupDto[] | null> => {
    const resourcesPromise = getList(token);
    const groupsPromise = groupsRepository.getList(token);
    const groupAssignResourceMapPromise = groupAssignsRepository.getAssignResourceMap(token);

    return Promise.all([resourcesPromise, groupsPromise, groupAssignResourceMapPromise])
      .then(([resources, groups, groupAssignResourceMap]) => {
        if (!resources || !groups || !groupAssignResourceMap) {
          return null;
        }

        const groupAssignResourceMapByDate = Object.keys(groupAssignResourceMap).reduce((map, resourceId) => {
          const assigns = groupAssignResourceMap[Number(resourceId)];
          const validAssigns = assigns.filter(assign => assign.applied_at <= date);
          map[Number(resourceId)] = validAssigns;
          return map;
        }, {} as typeof groupAssignResourceMap);

        const groupMap = groups.reduce((map, group) => {
          map[group.id] = group;
          return map;
        }, {} as Record<number, GroupDto>);

        return resources.map<ExpandedResourceWithGroupDto>((resource) => {
          const assigns = groupAssignResourceMapByDate[resource.id] || [];

          const latestAssign = assigns[assigns.length - 1] || null;

          return {
            ...resource,
            group: latestAssign ? {
              ...groupMap[latestAssign.group_id],
            } : null,
            group_assign: latestAssign,
          };
        });
      })
      .catch((err) => {
        console.log('Failed to process resources with groups ::: ' + err);
        return null;
      });
  };

  const getBothListsByDate = async (token: Tokens['accessToken'], date: string): Promise<{
    allResources: ExpandedResourceWithGroupDto[];
    subCentralResources: ExpandedResourceWithGroupDto[];
    biddingResources: ExpandedResourceWithGroupDto[];
  } | null> => {
    const list = await getListWithGroupByDate(token, date);

    if (!list) {
      return null;
    }

    const [subCentralizedResources, biddingResources] = list.reduce(([subCentralized, bidding], r) => {
      if (r.group && r.group.participation_type === '준중앙제도') {
        subCentralized.push(r);
      } else {
        bidding.push(r);
      }
      return [subCentralized, bidding];
    }, [[], []] as [typeof list, typeof list]);

    return {
      allResources: list,
      subCentralResources: subCentralizedResources,
      biddingResources: biddingResources,
    }
  };

  return {
    clearCache,
    getList,
    getListWithGroupByDate,
    getBothListsByDate,
  }
})();