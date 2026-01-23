import { apiServerGet } from "@/lib/api/server";

type ProductResponse = {
  ok: boolean;
  products: Array<{
    _id: string;
    title: string;
    price: number;
    visibility: string;
    stats: { assetCount: number };
  }>;
};

export const CreatorProductListPage = async () => {
  const data = await apiServerGet<ProductResponse>("/api/creator/products");
  const products = data.products ?? [];

  return (
    <div className="text-5xl flex items-center justify-center">
      <h1>CreatorProductListPage</h1>
    </div>
  );
};
