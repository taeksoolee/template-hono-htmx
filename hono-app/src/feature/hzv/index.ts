import { Hono } from "hono";
import { viewHzvResourceTable } from "./resource/resource-table";
import { viewHzvResourceCountDashboard } from "./home/resource-count-dashboard";

export const viewHzvPartialTemplates = (app: Hono) => {
  // home
  viewHzvResourceCountDashboard(app);

  // resource
  viewHzvResourceTable(app);

}