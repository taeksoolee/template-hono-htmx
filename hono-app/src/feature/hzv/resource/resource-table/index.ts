import { Hono } from "hono";
import nunjucks from "nunjucks";
import { resourcesRepository } from "../repository";
import { getVerifiedAccessToken, updateSessionTokens } from "../../utils";

export const viewHzvResourceTable = (app: Hono) => {
  app.get('/hzv/_partial/resource-table', async (c) => {
    const { accessToken, refreshToken } = (await c.var.session.get() || {})?.hzv?.tokens || {};

    if (!accessToken || !refreshToken) {
      return c.html('<p>Error: Not authenticated.</p>');
    }

    const verifiedAccessToken = await getVerifiedAccessToken({ accessToken, refreshToken });
    if (!verifiedAccessToken) {
      return c.html('<p>Error: Unable to verify access token. Please log in again.</p>');
    }

    await updateSessionTokens(c.var.session, { accessToken: verifiedAccessToken, refreshToken });

    const data = await resourcesRepository.getBothListsByDate(verifiedAccessToken, (new Date()).toISOString().split('T')[0]);
    if (!data) {
      return c.html('<p>Error: Unable to fetch resources.</p>');
    }

    const { allResources, subCentralResources, biddingResources } = data;

    const type = c.req.query().type; // sub_centralized
    const resources = (() => {
      if (type === 'sub_centralized') {
        return subCentralResources;
      } else if (type === 'bidding') {
        return biddingResources;
      } else {
        return allResources;
      }
    })();

    const page = Number(c.req.query().page) || 1;
    const pageCount = Number(c.req.query().page_count) || 10;

    const startIdx = (page - 1) * pageCount;
    const endIdx = startIdx + pageCount;

    const totalPages = resources ? Math.ceil(resources.length / pageCount) : 1;

    const movePages = (() => {
      const result: number[] = [];
      let cur = page;
      for (let i = 1; i <= 10; i++) {
        if (cur > 0 && cur <= totalPages) {
          result.push(cur);
        }

        const step = Math.ceil(i / 2);
        if (i % 2 === 1) {
          cur = page + step;
        } else {
          cur = page - step;
        }
      }
      return result.slice(0, 5).sort((a, b) => a - b);
    })();


    const htmlContent = nunjucks.render('feature/hzv/resource/resource-table/index.html', {
      type: type || 'all',
      resources: resources?.slice(startIdx, endIdx) || [],
      pagination: {
        page,
        pageCount,
        totalPages,
        movePages,
      }
    });
    return c.html(htmlContent);
  });
}

