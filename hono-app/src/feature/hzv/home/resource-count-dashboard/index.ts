import { Hono } from "hono";
import nunjucks from "nunjucks";

import { getVerifiedAccessToken, updateSessionTokens } from "../../utils";
import { resourcesRepository } from "../../resource/repository";

export const viewHzvResourceCountDashboard = (app: Hono) => {
  app.get('/hzv/_partial/resource-count-dashboard', async (c) => {
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

    const htmlContent = nunjucks.render('feature/hzv/home/resource-count-dashboard/index.html', {
      totalResourceCount: allResources.length,
      assignedResourceCount: allResources.filter(r => r.group).length,
      unassignedResourceCount: allResources.filter(r => !r.group).length,

      subCentralizedResourceCount: subCentralResources.length,
      assignedSubCentralizedResourceCount: subCentralResources.filter(r => r.group!.name !== '무소속자원').length,
      unassignedSubCentralizedResourceCount: subCentralResources.filter(r => r.group!.name === '무소속자원').length,

      biddingResourcesCount: biddingResources.length,
      assignedBiddingResourcesCount: biddingResources.filter(r => r.group).length,
      unassignedBiddingResourcesCount: biddingResources.filter(r => !r.group).length,
    });
    return c.html(htmlContent);
  });
}

