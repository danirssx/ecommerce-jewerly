import { supabase } from "@/lib/supabase";
import { Product } from "@/types/database";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_types(name),
      brands(name, description),
      product_images(url, alt_text, sort_order),
      color_products(
        color_hex_code,
        colors(name)
      ),
      inventory_current(quantity, updated_at)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Ordenar imágenes por sort_order
  const sortedImages = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/inventario" className="text-blue-600 hover:text-blue-800">
          ← Volver al inventario
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Galería de imágenes */}
        <div>
          {sortedImages.length > 0 ? (
            <div className="space-y-4">
              <div className="aspect-square">
                <img
                  src={sortedImages[0].url}
                  alt={sortedImages[0].alt_text || product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {sortedImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {sortedImages.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={image.alt_text || product.name}
                      className="w-full aspect-square object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Sin imagen</span>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600">Código: {product.code}</p>
          </div>

          {/* Precio */}
          <div>
            {product.sale_price ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">${product.sale_price}</span>
                <span className="text-xl line-through text-gray-500">${product.price}</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">En oferta</span>
              </div>
            ) : (
              <span className="text-3xl font-bold">${product.price}</span>
            )}

            {product.original_price && product.original_price !== product.price && (
              <p className="text-sm text-gray-500 mt-1">Precio original: ${product.original_price}</p>
            )}
          </div>

          {/* Información adicional */}
          <div className="space-y-3">
            {product.brands && (
              <div>
                <h3 className="font-semibold">Marca</h3>
                <p>{product.brands.name}</p>
                {product.brands.description && <p className="text-sm text-gray-600">{product.brands.description}</p>}
              </div>
            )}

            {product.product_types && (
              <div>
                <h3 className="font-semibold">Tipo de producto</h3>
                <p>{product.product_types.name}</p>
              </div>
            )}

            {/* Colores disponibles */}
            {product.color_products && product.color_products.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Colores disponibles</h3>
                <div className="flex gap-2">
                  {product.color_products.map((colorProduct) => (
                    <div key={colorProduct.color_hex_code} className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: colorProduct.color_hex_code }}
                        title={colorProduct.colors?.name || colorProduct.color_hex_code}
                      />
                      <span className="text-sm">{colorProduct.colors?.name || colorProduct.color_hex_code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inventario */}
            {product.inventory_current && (
              <div>
                <h3 className="font-semibold">Disponibilidad</h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded ${
                      product.inventory_current.quantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inventory_current.quantity > 0
                      ? `${product.inventory_current.quantity} en stock`
                      : "Sin stock"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Última actualización: {new Date(product.inventory_current.updated_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Descripción */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* URL original */}
          {product.original_url && (
            <div>
              <h3 className="font-semibold mb-2">URL original</h3>
              <a
                href={product.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm break-all"
              >
                {product.original_url}
              </a>
            </div>
          )}

          {/* Fechas */}
          <div className="text-sm text-gray-500 border-t pt-4">
            <p>Creado: {new Date(product.created_at).toLocaleDateString()}</p>
            <p>Actualizado: {new Date(product.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
