
import { useEffect, useMemo, useState } from "react";
import { Search, Image as ImageIcon, ArrowRight } from "lucide-react";
import ProductCustomisationModal from "../components/ProductCustomisationModal";
import { collections, categories } from "../data/products";
import type { Product } from "../data/products";
import { supabase } from "../lib/supabase";
import apparelImg from "../assets/images/collections/apparel.jpg";
import drinkwareImg from "../assets/images/collections/drinkware.jpg";
import stationeryImg from "../assets/images/collections/stationery.jpg";
import promotionalImg from "../assets/images/collections/promotional.jpg";
import packagingImg from "../assets/images/collections/packaging.jpg";

interface DatabaseProduct {
  id: string;
  name: string;
  category: string;
  collection: string | null;
  product_type: Product["type"];
  description: string | null;
  colours: string[] | null;
  sizes: string[] | null;
  image_labels: string[] | null;
  extra_fields: string[] | null;
  sort_order: number;
  product_images?: {
    id: string;
    storage_path: string;
    alt_text: string | null;
    sort_order: number;
  }[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images (
            id,
            storage_path,
            alt_text,
            sort_order
          )
        `)
        .eq("published", true)
        .order("sort_order")
        .order("name");

      if (!active) return;

      if (error) {
        console.error("Could not load products:", error);
        setLoadError("We couldn't load our products. Please try again.");
        setProducts([]);
        setLoading(false);
        return;
      }

      const mappedProducts: Product[] = (
        (data || []) as DatabaseProduct[]
      ).map((product) => {
        const images = [...(product.product_images || [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((image) => {
            const { data: publicData } = supabase.storage
              .from("product-images")
              .getPublicUrl(image.storage_path);

            return {
              id: image.id,
              url: publicData.publicUrl,
              altText: image.alt_text || product.name,
              sortOrder: image.sort_order,
            };
          });

        return {
          id: product.id,
          name: product.name,
          category: product.category,
          collection: product.collection || "",
          type: product.product_type,
          description: product.description || "",
          colours: product.colours || [],
          sizes: product.sizes || [],
          imageLabels: product.image_labels || [],
          extraFields: product.extra_fields || [],
          images,
        };
      });

      setProducts(mappedProducts);
      setLoading(false);
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category === selectedCategory;

      const matchesCollection =
        !selectedCollection ||
        product.collection === selectedCollection;

      const term = searchTerm.toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      return matchesCategory && matchesCollection && matchesSearch;
    });
  }, [products, selectedCategory, selectedCollection, searchTerm]);

  const chooseCollection = (collectionName: string) => {
    setSelectedCollection(collectionName);
    setSelectedCategory("All Categories");
    setSearchTerm("");
  };

  const showAllProducts = () => {
    setSelectedCollection("");
    setSelectedCategory("All Categories");
    setSearchTerm("");
  };

  return (
    <main className="products-page">
      <section className="products-hero">
        <div className="products-hero-content">
          <span className="products-eyebrow">
            OUR PRODUCTS <span />
          </span>

          <h1>
            Product <span>Collections.</span>
          </h1>

          <p>
            Branded products, merchandise and printing solutions
            for your business, events and campaigns.
          </p>
        </div>

        <div className="products-hero-decoration">
          <span>MN</span>
          <small>MUGUMONEMS PROJECTS</small>
        </div>
      </section>

      <section className="products-content">
        <div className="products-section-heading">
          <div>
            <h2>Browse by Collection</h2>
            <p>Explore our products by collection.</p>
          </div>

          <div className="products-search">
            <Search size={19} />
            <input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setSelectedCollection("");
                setSelectedCategory("All Categories");
              }}
            />
          </div>
        </div>

        <div className="collection-grid">
          {collections.map((collection) => (
            <button
              type="button"
              className={`collection-card ${
                selectedCollection === collection.name ? "active" : ""
              }`}
              key={collection.name}
              onClick={() => chooseCollection(collection.name)}
            >
              <div className="collection-image">
                {(() => {
                  const collectionName = collection.name.toLowerCase();

                  const collectionImage =
                    collectionName.includes("apparel") ||
                    collectionName.includes("t-shirt") ||
                    collectionName.includes("clothing")
                      ? apparelImg
                      : collectionName.includes("drink")
                        ? drinkwareImg
                        : collectionName.includes("office") ||
                            collectionName.includes("stationery")
                          ? stationeryImg
                          : collectionName.includes("promotion")
                            ? promotionalImg
                            : collectionName.includes("packag")
                              ? packagingImg
                              : null;

                  return collectionImage ? (
                    <img
                      src={collectionImage}
                      alt={`${collection.name} collection`}
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <ImageIcon size={42} strokeWidth={1.3} />
                      <span>COLLECTION IMAGE</span>
                    </>
                  );
                })()}
              </div>

              <div className="collection-card-content">
                <div className="collection-title">
                  <h3>{collection.name}</h3>
                  <span className="collection-arrow">
                    <ArrowRight size={18} />
                  </span>
                </div>
                <p>{collection.description}</p>
              </div>
            </button>
          ))}
        </div>

        <section className="featured-products">
          <div className="featured-heading">
            <div>
              <h2>Explore Products <span /></h2>
              <p>
                {selectedCollection ||
                selectedCategory !== "All Categories"
                  ? "Showing your selected products."
                  : "Discover products available for customisation."}
              </p>
            </div>

            <div className="category-filter">
              <label htmlFor="product-category">Category</label>
              <select
                id="product-category"
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                  setSelectedCollection("");
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(selectedCollection ||
            selectedCategory !== "All Categories") && (
            <button
              type="button"
              className="clear-product-filters"
              onClick={showAllProducts}
            >
              Clear filters <span>×</span>
            </button>
          )}

          {loading && (
            <div className="no-products">
              <p>Loading products...</p>
            </div>
          )}

          {!loading && loadError && (
            <div className="no-products">
              <h3>Products unavailable</h3>
              <p>{loadError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !loadError && (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <button
                    type="button"
                    className="product-card-open"
                    onClick={() => setSelectedProduct(product)}
                    aria-label={`Customise ${product.name}`}
                  >
                    <div className="product-image-placeholder">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].altText}
                          loading="lazy"
                        />
                      ) : (
                        <>
                          <ImageIcon size={52} strokeWidth={1.3} />
                          <strong>PRODUCT IMAGE</strong>
                          <span>IMAGE COMING SOON</span>
                        </>
                      )}
                    </div>

                    <div className="product-card-content">
                      <span>{product.category}</span>
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <span className="product-card-action">
                        Customise Product <ArrowRight size={17} />
                      </span>
                    </div>
                  </button>
                </article>
              ))}

              {filteredProducts.length === 0 && (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try another search or category.</p>
                  <button type="button" onClick={showAllProducts}>
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </section>

      {selectedProduct && (
        <ProductCustomisationModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}
