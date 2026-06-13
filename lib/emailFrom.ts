export const RETAIL_FROM_EMAIL =
  process.env.RETAIL_FROM_EMAIL ||
  "Herbal Communities Retail <retail@herbalcommunities.com>";

export const WHOLESALE_FROM_EMAIL =
  process.env.WHOLESALE_FROM_EMAIL ||
  "Herbal Communities Wholesale <wholesale@herbalcommunities.com>";

export const RETREATS_FROM_EMAIL =
  process.env.RETREATS_FROM_EMAIL ||
  "Herbal Communities Retreats <retreats@herbalcommunities.com>";

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || RETAIL_FROM_EMAIL;

export function getFromEmailByOrderType(orderType?: string | null) {
  if (orderType === "WHOLESALE") return WHOLESALE_FROM_EMAIL;
  if (orderType === "RETREAT") return RETREATS_FROM_EMAIL;
  return RETAIL_FROM_EMAIL;
}
