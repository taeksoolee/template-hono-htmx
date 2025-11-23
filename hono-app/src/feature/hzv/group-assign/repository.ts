import got from "got";
import { Tokens } from "../../../types/tokens";
import { createGotOptions } from "../utils";
import { GroupAssignDto } from "./dto";

export const groupAssignsRepository = (() => {
  let listCache: Promise<Array<GroupAssignDto> | null> = Promise.resolve(null);

  const clearCache = () => {
    listCache = Promise.resolve(null);
  };

  const getList = async (token: Tokens['accessToken']): Promise<Array<GroupAssignDto> | null> => {
    let listResponse = await listCache;

    if (listResponse === null) {
      const maxDate = new Date();
      maxDate.setFullYear(2100); // 어느정도 큰값으로 설정
      const yyyymmdd = maxDate.toISOString().split('T')[0];
      const groupsPromise = got('https://apidev.vpphaezoom.com/api/group/assign/?date=' + yyyymmdd, createGotOptions('GET', token))
        .json<Array<GroupAssignDto>>()
        .catch((err) => {
          console.log('Failed to fetch groups ::: ' + err);
          return [];
        });

      listCache = Promise.all([groupsPromise])
        .then(([groups]) => {
          if (!groups) {
            return null;
          }

          return groups;
        }).catch((err) => {
          console.log('Failed to process groups ::: ' + err);
          return null;
        });

      listResponse = await listCache;
    }

    return listResponse ?? null;
  }

  const getAssignResourceMap = async (token: Tokens['accessToken']): Promise<Record<number, Array<GroupAssignDto>> | null> => {
    const list = await getList(token);

    if (!list) {
      return null;
    }

    return list.reduce((map, assign) => {
      if (!map[assign.resource_id]) {
        map[assign.resource_id] = [];
      }
      map[assign.resource_id].push(assign);
      return map;
    }, {} as Record<number, Array<GroupAssignDto>>);
  }

  return {
    clearCache,
    getList,
    getAssignResourceMap,
  }
})();