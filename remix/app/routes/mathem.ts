import { LoaderArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

const BASE_URL =
  "https://api.mathem.io/product-search/noauth/search/query?size=8&index=0&storeId=10&searchType=searchDropdown&q=";

export const loader = async ({ request }: LoaderArgs) => {
  const search = new URL(request.url).searchParams;

  const q = search.get("q");

  invariant(q != null, "Must pass 'q' parameter");

  const resp = await fetch(BASE_URL + q).then((r) => r.json());

  return resp.products.map((p: any) => ({ value: p.name, label: p.name }));
};
