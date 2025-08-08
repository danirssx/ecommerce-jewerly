import { supabase } from "@/lib/supabase";
import { Product } from "@/types/database";
import Link from "next/link";

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_types(name),
      brands(name),
      product_images(url, alt_text, sort_order),
      inventory_current(quantity)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Error fetching products: " + error.message);
  }

  return data || [];
}

export default async function InventarioPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventario de Productos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/inventario/${product.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              {/* Imagen del producto */}
              {product.product_images && product.product_images.length > 0 && (
                <div className="mb-4">
                  <img
                    src={product.product_images[0].url}
                    alt={product.product_images[0].alt_text || product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}

              {/* Información del producto */}
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-2">Código: {product.code}</p>

              {/* Marca y tipo */}
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                {product.brands && <span>Marca: {product.brands.name}</span>}
                {product.product_types && <span>Tipo: {product.product_types.name}</span>}
              </div>

              {/* Precio */}
              <div className="mb-2">
                {product.sale_price ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-600">${product.sale_price}</span>
                    <span className="text-sm line-through text-gray-500">${product.price}</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold">${product.price}</span>
                )}
              </div>

              {/* Inventario */}
              {product.inventory_current && (
                <div className="text-sm">
                  <span
                    className={`px-2 py-1 rounded ${
                      product.inventory_current.quantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    Stock: {product.inventory_current.quantity}
                  </span>
                </div>
              )}

              {/* Descripción */}
              {product.description && <p className="text-sm text-gray-600 mt-3 line-clamp-2">{product.description}</p>}
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay productos en el inventario.</p>
        </div>
      )}
    </div>
  );
}
