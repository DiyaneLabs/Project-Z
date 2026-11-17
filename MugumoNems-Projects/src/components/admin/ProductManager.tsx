
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Package,
  LoaderCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  Star,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import "./ProductManager.css";

type ProductType =
  | "apparel"
  | "drinkware"
  | "stationery"
  | "promotional"
  | "packaging"
  | "simple";

interface Product {
  id: string;
  name: string;
  category: string;
  collection: string;
  product_type: ProductType;
  description: string;
  colours: string[];
  sizes: string[];
  image_labels: string[];
  extra_fields: string[];
  published: boolean;
  sort_order: number;
}

type ProductForm = Omit<Product, "id">;

interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  publicUrl: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const emptyForm: ProductForm = {
  name: "",
  category: "",
  collection: "",
  product_type: "simple",
  description: "",
  colours: [],
  sizes: [],
  image_labels: [],
  extra_fields: [],
  published: false,
  sort_order: 0,
};

const categories = [
  "T-Shirts",
  "Hoodies",
  "Golf Shirts",
  "Caps",
  "Cups",
  "Drinkware",
  "Diaries",
  "Business Cards",
  "Notebooks",
  "Pens",
  "Medals",
  "Keyholders",
  "Bags",
  "Banners",
  "Custom Packaging",
];

const collections = [
  "Apparel",
  "Drinkware",
  "Office & Stationery",
  "Promotional",
  "Packaging",
];

function splitValues(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageError, setImageError] = useState("");
  const [uploadStage, setUploadStage] = useState("");


async function compressImage(file: File): Promise<File> {
  // Skip compression for already-small images.
  if (file.size < 500 * 1024) {
    return file;
  }

  const imageBitmap = await createImageBitmap(file);

  const maxDimension = 1800;
  const scale = Math.min(
    1,
    maxDimension / Math.max(imageBitmap.width, imageBitmap.height)
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(imageBitmap.width * scale);
  canvas.height = Math.round(imageBitmap.height * scale);

  const context = canvas.getContext("2d");

  if (!context) {
    imageBitmap.close();
    throw new Error("Could not prepare the image for compression.");
  }

  context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
  imageBitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Image compression failed."));
      },
      "image/webp",
      0.82
    );
  });

  // Use the compressed image only if it is actually smaller.
  if (blob.size >= file.size) {
    return file;
  }

  const originalName = file.name.replace(/\.[^.]+$/, "");

  return new File([blob], `${originalName}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}


  async function loadProducts() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setProducts((data ?? []) as Product[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProductImages(productId: string) {
    setImagesLoading(true);
    setImageError("");

    const { data, error } = await supabase
      .from("product_images")
      .select("id, product_id, storage_path, alt_text, sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });

    if (error) {
      setImageError(error.message);
      setImages([]);
    } else {
      const imageRows = (data ?? []).map((image) => ({
        ...image,
        publicUrl: supabase.storage
          .from("product-images")
          .getPublicUrl(image.storage_path).data.publicUrl,
      })) as ProductImage[];
      setImages(imageRows);
    }

    setImagesLoading(false);
  }

  useEffect(() => {
    if (modalOpen && editingId) {
      void loadProductImages(editingId);
    } else {
      setImages([]);
      setImageError("");
    }
  }, [modalOpen, editingId]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        (filter === "Published" && product.published) ||
        (filter === "Drafts" && !product.published);

      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  function openNewProduct() {
    setEditingId(null);
    setImages([]);
    setImageError("");
    setForm({
      ...emptyForm,
      sort_order: products.length + 1,
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditProduct(product: Product) {
    setEditingId(product.id);
    setImages([]);
    setImageError("");
    setForm({
      name: product.name,
      category: product.category,
      collection: product.collection ?? "",
      product_type: product.product_type,
      description: product.description ?? "",
      colours: product.colours ?? [],
      sizes: product.sizes ?? [],
      image_labels: product.image_labels ?? [],
      extra_fields: product.extra_fields ?? [],
      published: product.published,
      sort_order: product.sort_order ?? 0,
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setImages([]);
    setImageError("");
  }

  function updateForm<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const cleanName = form.name.trim();
    const cleanCategory = form.category.trim();

    if (!cleanName || !cleanCategory) {
      setError("Product name and category are required.");
      setSaving(false);
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update({
          ...form,
          name: cleanName,
          category: cleanCategory,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }

      setSuccess("Product updated successfully.");
    } else {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setError("Your admin session could not be verified. Please sign in again.");
        setSaving(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .insert({
          ...form,
          name: cleanName,
          category: cleanCategory,
          created_by: userData.user.id,
        })
        .select("id")
        .single();

      if (error || !data) {
        setError(error?.message ?? "The product could not be created.");
        setSaving(false);
        return;
      }

      // Keep the editor open so images can be added immediately.
      setEditingId(data.id as string);
      setSuccess("Product created. You can now add its images below.");
    }

    await loadProducts();
    setSaving(false);
  }

 
async function uploadProductImages(selectedFiles: File[]) {
  if (!editingId || selectedFiles.length === 0) return;

  setUploadingImages(true);
  setImageError("");
  setError("");
  setSuccess("");

  let uploadedCount = 0;

  try {
    setUploadStage("Checking your admin session...");

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error("Your admin session could not be verified. Please sign in again.");
    }

    const invalidFile = selectedFiles.find(
      (file) =>
        !ALLOWED_IMAGE_TYPES.includes(file.type) ||
        file.size > MAX_IMAGE_SIZE
    );

    if (invalidFile) {
      throw new Error(
        `${invalidFile.name}: choose a JPG, PNG or WebP image no larger than 5MB.`
      );
    }

    for (const [index, originalFile] of selectedFiles.entries()) {
      setUploadStage(
        `Preparing image ${index + 1} of ${selectedFiles.length}...`
      );

      const file = await compressImage(originalFile);

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");

      const storagePath =
        `${userData.user.id}/${editingId}/${crypto.randomUUID()}-${safeName}`;

      setUploadStage(
        `Uploading image ${index + 1} of ${selectedFiles.length}...`
      );

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      setUploadStage(
        `Saving image ${index + 1} of ${selectedFiles.length}...`
      );

      const { error: rowError } = await supabase
        .from("product_images")
        .insert({
          product_id: editingId,
          storage_path: storagePath,
          alt_text: form.name.trim(),
          sort_order: images.length + uploadedCount,
        });

      if (rowError) {
        await supabase.storage
          .from("product-images")
          .remove([storagePath]);

        throw new Error(rowError.message);
      }

      uploadedCount++;
    }

    await loadProductImages(editingId);

    if (uploadedCount > 0) {
      setSuccess(
        `${uploadedCount} image${uploadedCount === 1 ? "" : "s"} uploaded successfully.`
      );
    }
  } catch (uploadError) {
    const message =
      uploadError instanceof Error
        ? uploadError.message
        : "An unexpected error occurred during upload.";

    setImageError(message);
  } finally {
    setUploadingImages(false);
    setUploadStage("");
  }
}


  async function saveImageOrder(nextImages: ProductImage[]) {
    setImages(nextImages);
    const updates = await Promise.all(
      nextImages.map((image, index) =>
        supabase
          .from("product_images")
          .update({ sort_order: index })
          .eq("id", image.id)
      )
    );
    const failedUpdate = updates.find((result) => result.error);
    if (failedUpdate?.error) {
      setImageError(failedUpdate.error.message);
      if (editingId) await loadProductImages(editingId);
    }
  }

  async function moveImage(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];
    await saveImageOrder(reordered);
  }

  async function deleteProductImage(image: ProductImage) {
    const confirmed = window.confirm("Delete this product image? This cannot be undone.");
    if (!confirmed) return;

    setImageError("");
    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove([image.storage_path]);

    if (storageError) {
      setImageError(storageError.message);
      return;
    }

    const { error: rowError } = await supabase
      .from("product_images")
      .delete()
      .eq("id", image.id);

    if (rowError) {
      setImageError(rowError.message);
      return;
    }

    const remaining = images.filter((item) => item.id !== image.id);
    await saveImageOrder(remaining);
    setSuccess("Image deleted.");
  }

  async function togglePublished(product: Product) {
    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("products")
      .update({
        published: !product.published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(
      product.published
        ? "Product moved to drafts."
        : "Product published successfully."
    );

    await loadProducts();
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      setError(error.message);
      return;
    }

    setProducts((current) =>
      current.filter((item) => item.id !== product.id)
    );
    setSuccess(`${product.name} was deleted.`);
  }

  return (
    <section className="pm-section">
      <div className="pm-heading">
        <div>
          <p className="admin-eyebrow">CATALOGUE MANAGEMENT</p>
          <h1>Products</h1>
          <p>Manage your product catalogue and publication status.</p>
        </div>

        <button className="admin-primary-button" onClick={openNewProduct}>
          <Plus size={18} />
          Add product
        </button>
      </div>

      <div className="pm-summary">
        <div>
          <span>Total products</span>
          <strong>{products.length}</strong>
        </div>
        <div>
          <span>Published</span>
          <strong>{products.filter((p) => p.published).length}</strong>
        </div>
        <div>
          <span>Drafts</span>
          <strong>{products.filter((p) => !p.published).length}</strong>
        </div>
      </div>

      {error && <div className="pm-message pm-error">{error}</div>}
      {success && <div className="pm-message pm-success">{success}</div>}

      <div className="admin-panel pm-panel">
        <div className="pm-toolbar">
          <div className="pm-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter products"
          >
            <option value="All">All products</option>
            <option value="Published">Published</option>
            <option value="Drafts">Drafts</option>
          </select>
        </div>

        {loading ? (
          <div className="pm-empty">
            <LoaderCircle className="pm-spinner" size={28} />
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="pm-empty">
            <Package size={34} />
            <strong>No products found</strong>
            <p>Try another search or add a new product.</p>
          </div>
        ) : (
          <div className="pm-table-wrap">
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Collection</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                      <small>{product.product_type}</small>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.collection || "—"}</td>
                    <td>
                      <span
                        className={`pm-status ${
                          product.published ? "is-published" : "is-draft"
                        }`}
                      >
                        {product.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      <div className="pm-actions">
                        <button
                          type="button"
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => openEditProduct(product)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          title={product.published ? "Unpublish" : "Publish"}
                          aria-label={
                            product.published
                              ? `Unpublish ${product.name}`
                              : `Publish ${product.name}`
                          }
                          onClick={() => void togglePublished(product)}
                        >
                          {product.published ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                        <button
                          type="button"
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => void deleteProduct(product)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pm-table-footer">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {modalOpen && (
        <div className="pm-modal-backdrop">
          <section
            className="pm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pm-modal-title"
          >
            <div className="pm-modal-heading">
              <div>
                <p className="admin-eyebrow">PRODUCT DETAILS</p>
                <h2 id="pm-modal-title">
                  {editingId ? "Edit product" : "Add product"}
                </h2>
              </div>
              <button
                type="button"
                className="pm-close"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveProduct}>
              <div className="pm-form-grid">
                <label>
                  Product name *
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="e.g. Branded T-Shirt"
                  />
                </label>

                <label>
                  Category *
                  <select
                    required
                    value={form.category}
                    onChange={(e) => updateForm("category", e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Collection
                  <select
                    value={form.collection}
                    onChange={(e) => updateForm("collection", e.target.value)}
                  >
                    <option value="">Select collection</option>
                    {collections.map((collection) => (
                      <option key={collection} value={collection}>
                        {collection}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Product type
                  <select
                    value={form.product_type}
                    onChange={(e) =>
                      updateForm("product_type", e.target.value as ProductType)
                    }
                  >
                    <option value="simple">Simple</option>
                    <option value="apparel">Apparel</option>
                    <option value="drinkware">Drinkware</option>
                    <option value="stationery">Stationery</option>
                    <option value="promotional">Promotional</option>
                    <option value="packaging">Packaging</option>
                  </select>
                </label>

                <label className="pm-full">
                  Description
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      updateForm("description", e.target.value)
                    }
                    placeholder="Describe this product..."
                  />
                </label>

                <label className="pm-full">
                  Available colours
                  <input
                    value={form.colours.join(", ")}
                    onChange={(e) =>
                      updateForm("colours", splitValues(e.target.value))
                    }
                    placeholder="Black, White, Navy"
                  />
                  <small>Separate each colour with a comma.</small>
                </label>

                <label className="pm-full">
                  Available sizes
                  <input
                    value={form.sizes.join(", ")}
                    onChange={(e) =>
                      updateForm("sizes", splitValues(e.target.value))
                    }
                    placeholder="S, M, L, XL, XXL"
                  />
                  <small>Leave blank if this product has no sizes.</small>
                </label>

                <label className="pm-full">
                  Image labels
                  <input
                    value={form.image_labels.join(", ")}
                    onChange={(e) =>
                      updateForm("image_labels", splitValues(e.target.value))
                    }
                    placeholder="Front view, Back view, Detail"
                  />
                </label>

                <label className="pm-full">
                  Customisation fields
                  <input
                    value={form.extra_fields.join(", ")}
                    onChange={(e) =>
                      updateForm("extra_fields", splitValues(e.target.value))
                    }
                    placeholder="Material, Finish, Dimensions"
                  />
                  <small>These become additional customer enquiry fields.</small>
                </label>

                <label>
                  Display order
                  <input
                    type="number"
                    min="0"
                    value={form.sort_order}
                    onChange={(e) =>
                      updateForm("sort_order", Number(e.target.value))
                    }
                  />
                </label>

                <label className="pm-publish-toggle">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      updateForm("published", e.target.checked)
                    }
                  />
                  Publish this product
                </label>
              </div>

              <section className="pm-image-manager">
                <div className="pm-image-manager-heading">
                  <div>
                    <h3>Product image gallery</h3>
                    <p>Upload multiple product views. The first image is the primary image.</p>
                  </div>
                  {editingId && (
                    <span className="pm-image-count">{images.length} image{images.length === 1 ? "" : "s"}</span>
                  )}
                </div>

                {!editingId ? (
                  <p className="pm-image-hint">Save the product first. The image gallery will become available here.</p>
                ) : (
                  <>
                    <label className={`pm-image-upload ${uploadingImages ? "is-uploading" : ""}`}>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        disabled={uploadingImages}
                        onChange={(event) => {
                            const selectedFiles = Array.from(
                        event.currentTarget.files ?? []
  );

  event.currentTarget.value = "";

  void uploadProductImages(selectedFiles);
}}
                      />
                      {uploadingImages ? (
                        <LoaderCircle className="pm-spinner" size={20} />
                      ) : (
                        <Upload size={20} />
                      )}
                      <span>
  {uploadingImages
    ? uploadStage || "Preparing upload..."
    : "Choose images to upload"}
</span>
                      <small>JPG, PNG or WebP · Maximum 5MB per image · Select multiple files</small>
                    </label>

                    {imageError && <div className="pm-message pm-error">{imageError}</div>}

                    {imagesLoading ? (
                      <div className="pm-image-empty"><LoaderCircle className="pm-spinner" size={22} /> Loading images...</div>
                    ) : images.length === 0 ? (
                      <div className="pm-image-empty">No images uploaded yet. Add your first product image above.</div>
                    ) : (
                      <div className="pm-image-grid">
                        {images.map((image, index) => (
                          <article className="pm-image-card" key={image.id}>
                            <div className="pm-image-preview">
                              <img src={image.publicUrl} alt={image.alt_text || form.name} />
                              {index === 0 && <span className="pm-primary-image"><Star size={13} fill="currentColor" /> Primary</span>}
                            </div>
                            <div className="pm-image-card-footer">
                              <span>Image {index + 1}</span>
                              <div className="pm-image-actions">
                                <button type="button" title="Move image earlier" aria-label="Move image earlier" disabled={index === 0} onClick={() => void moveImage(index, -1)}><ArrowUp size={15} /></button>
                                <button type="button" title="Move image later" aria-label="Move image later" disabled={index === images.length - 1} onClick={() => void moveImage(index, 1)}><ArrowDown size={15} /></button>
                                <button type="button" title="Delete image" aria-label="Delete image" onClick={() => void deleteProductImage(image)}><Trash2 size={15} /></button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </section>

              {error && <div className="pm-message pm-error">{error}</div>}

              <div className="pm-modal-actions">
                <button
                  type="button"
                  className="pm-cancel"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {saving && <LoaderCircle className="pm-spinner" size={17} />}
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Create product"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
