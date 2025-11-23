import got from "got";
import { Tokens } from "../../../types/tokens";
import { createGotOptions } from "../utils";
import { GroupDto } from "./dto";

export const groupsRepository = (() => {
  let listCache: Promise<Array<GroupDto> | null> = Promise.resolve(null);

  const clearCache = () => {
    listCache = Promise.resolve(null);
  };

  const getList = async (token: Tokens['accessToken']): Promise<Array<GroupDto> | null> => {
    let listResponse = await listCache;

    if (listResponse === null) {
      const groupsPromise = got('https://apidev.vpphaezoom.com/api/group/total/', createGotOptions('GET', token))
        .json<Array<GroupDto>>()
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

  return {
    clearCache,
    getList,
  }
})();