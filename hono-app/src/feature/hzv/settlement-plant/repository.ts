import got from "got";
import { Tokens } from "../../../types/tokens";
import { createGotOptions } from "../utils";
import { SettlementPlantDto } from "./dto";

export const settlementPlantsRepository = (() => {
  let listCache: Promise<Array<SettlementPlantDto> | null> = Promise.resolve(null);

  const clearCache = () => {
    listCache = Promise.resolve(null);
  };

  const getList = async (token: Tokens['accessToken']): Promise<Array<SettlementPlantDto> | null> => {
    let listResponse = await listCache;

    if (listResponse === null) {
      const settlementPlantsPromise = got('https://settlement.dev.vpphaezoom.com/api/settlement/plants/', createGotOptions('GET', token))
        .json<Array<SettlementPlantDto>>()
        .catch((err) => {
          console.log('Failed to fetch settlementPlants ::: ' + err);
          return [];
        });

      

      listCache = Promise.all([settlementPlantsPromise])
        .then(([settlementPlants]) => {
          if (!settlementPlants) {
            return null;
          }

          return settlementPlants;
        }).catch((err) => {
          console.log('Failed to process settlementPlants ::: ' + err);
          return null;
        });

      listResponse = await listCache;
    }

    return listResponse ?? null;
  }

  return {
    clearCache,
    getList,
  }
})();