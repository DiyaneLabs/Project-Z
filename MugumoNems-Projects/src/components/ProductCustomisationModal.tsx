
import { useEffect, useMemo, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Image as ImageIcon,
  MessageCircle,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import type { Product } from "../data/products";
import { supabase } from "../lib/supabase";



interface Props {
  product: Product;
  onClose: () => void;
}

const WHATSAPP_NUMBER = "27818659844";

export default function ProductCustomisationModal({
  product,
  onClose,
}: Props) {
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
const [artwork, setArtwork] = useState<File | null>(null);

const [artworkPreviewUrl, setArtworkPreviewUrl] = useState<string | null>(null);

const [notes, setNotes] = useState("");
  const [extraDetails, setExtraDetails] = useState<Record<string, string>>({});
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => {
  if (!artwork || !artwork.type.startsWith("image/")) {
    setArtworkPreviewUrl(null);
    return;
  }

  const previewUrl = URL.createObjectURL(artwork);
  setArtworkPreviewUrl(previewUrl);

  return () => {
    URL.revokeObjectURL(previewUrl);
  };
}, [artwork]);
  const [isSendingEnquiry, setIsSendingEnquiry] = useState(false);

  const hasSizes = Boolean(product.sizes?.length);
  const galleryImages = product.images ?? [];
  const galleryCount =
  galleryImages.length || product.imageLabels.length;
  const totalQuantity = hasSizes
    ? selectedSizes.reduce((total, size) => total + (sizeQuantities[size] || 0), 0)
    : quantity;

  const toggleColour = (colour: string) => {
    setSelectedColours((current) =>
      current.includes(colour)
        ? current.filter((item) => item !== colour)
        : [...current, colour]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((current) => {
      if (current.includes(size)) {
        setSizeQuantities((quantities) => {
          const updated = { ...quantities };
          delete updated[size];
          return updated;
        });
        return current.filter((item) => item !== size);
      }

      setSizeQuantities((quantities) => ({
        ...quantities,
        [size]: 1,
      }));

      return [...current, size];
    });
  };

  const changeSizeQuantity = (size: string, amount: number) => {
    setSizeQuantities((current) => ({
      ...current,
      [size]: Math.max(1, amount),
    }));
  };

  const whatsappMessage = useMemo(() => {
    const sizeDetails = selectedSizes
      .map((size) => `${size}: ${sizeQuantities[size] || 0}`)
      .join(", ");

    const detailLines = Object.entries(extraDetails)
      .filter(([, value]) => value.trim())
      .map(([field, value]) => `${field}: ${value}`);

    return [
      "Hello MugumoNems Projects!",
      "",
      "I would like to enquire about the following product:",
      `Product: ${product.name}`,
      `Category: ${product.category}`,
      `Colours: ${selectedColours.join(", ") || "Not specified"}`,
      hasSizes ? `Sizes and quantities: ${sizeDetails || "Not selected"}` : `Quantity: ${quantity}`,
      `Total quantity: ${totalQuantity}`,
      ...detailLines,
      `Artwork: ${artwork?.name || "Not uploaded"}`,
      `Additional notes: ${notes || "None"}`,
      "",
      "Please assist me with a quotation.",
    ].join("\n");
  }, [
    product,
    selectedColours,
    selectedSizes,
    sizeQuantities,
    hasSizes,
    quantity,
    totalQuantity,
    extraDetails,
    artwork,
    notes,
  ]);

  const changeImage = (direction: number) => {
  if (galleryCount === 0) return;

  setActiveImage((current) =>
    (current + direction + galleryCount) % galleryCount
  );
};

  const sendEnquiry = async () => {
  if (totalQuantity < 1) {
    alert("Please enter a quantity before sending your enquiry.");
    return;
  }

  if (hasSizes && selectedSizes.length === 0) {
    alert("Please select at least one size.");
    return;
  }

  const whatsappWindow = window.open("about:blank", "_blank");

  if (!whatsappWindow) {
    alert("Please allow pop-ups for this website.");
    return;
  }

  setIsSendingEnquiry(true);

  try {
    let artworkUrl = "";

    if (artwork) {
      const safeFileName = artwork.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `enquiries/${crypto.randomUUID()}-${safeFileName}`;

      const { error } = await supabase.storage
        .from("customer-artwork")
        .upload(filePath, artwork, {
          cacheControl: "3600",
          upsert: false,
          contentType: artwork.type,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("customer-artwork")
        .getPublicUrl(filePath);

      artworkUrl = data.publicUrl;
    }

    const finalMessage = [
      whatsappMessage,
      ...(artworkUrl ? ["", `Artwork link: ${artworkUrl}`] : []),
    ].join("\n");

    const whatsappLink =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(finalMessage)}`;

    whatsappWindow.location.href = whatsappLink;
  } catch (error) {
    console.error("Artwork upload failed:", error);
    whatsappWindow.close();

    alert("Artwork upload failed. Please try again.");
  } finally {
    setIsSendingEnquiry(false);
  }
};

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="product-modal-header">
          <div>
            <span>CUSTOMISE YOUR PRODUCT</span>
            <h2 id="product-modal-title">{product.name}</h2>
            <p>{product.description}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X />
          </button>
        </header>

        <div className="product-modal-body">
          {/* LEFT COLUMN: CUSTOMISATION */}
          <div className="product-customisation">
            {product.colours.length > 0 && (
              <section className="customisation-field">
                <h3>1. Choose Colour(s)</h3>
                <p>Select the colours you would like.</p>

                <div className="colour-options">
                  {product.colours.map((colour) => (
                    <button
                      type="button"
                      key={colour}
                      className={`colour-option ${
                        selectedColours.includes(colour) ? "selected" : ""
                      }`}
                      onClick={() => toggleColour(colour)}
                    >
                      <span className={`colour-swatch swatch-${colour.toLowerCase().replace(/\s+/g, "-")}`} />
                      <span>{colour}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {hasSizes && (
              <section className="customisation-field">
                <h3>2. Select Size(s) & Quantity</h3>
                <p>Choose your sizes, then enter the quantity for each.</p>

                <div className="size-options">
                  {product.sizes?.map((size) => (
                    <button
                      type="button"
                      key={size}
                      className={`size-option ${
                        selectedSizes.includes(size) ? "selected" : ""
                      }`}
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <div className="size-quantity-list">
                  {selectedSizes.map((size) => (
                    <div className="size-quantity-row" key={size}>
                      <strong>Size {size}</strong>
                      <div className="quantity-controls">
                        <button
                          type="button"
                          aria-label={`Decrease ${size}`}
                          disabled={sizeQuantities[size] <= 1}
                          onClick={() =>
                            changeSizeQuantity(size, sizeQuantities[size] - 1)
                          }
                        >
                          <Minus size={15} />
                        </button>
                        <span>{sizeQuantities[size]}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${size}`}
                          onClick={() =>
                            changeSizeQuantity(size, sizeQuantities[size] + 1)
                          }
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="remove-size"
                        onClick={() => toggleSize(size)}
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!hasSizes && (
              <section className="customisation-field">
                <h3>{product.colours.length ? "2." : "1."} Quantity</h3>
                <div className="quantity-controls main-quantity">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(Math.max(1, Number(event.target.value) || 1))
                    }
                  />
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((value) => value + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </section>
            )}

            {hasSizes && (
              <div className="total-quantity">
                <strong>Total quantity</strong>
                <strong>{totalQuantity}</strong>
              </div>
            )}

            {product.extraFields?.map((field) => (
              <section className="customisation-field" key={field}>
                <label htmlFor={`extra-${field}`}>{field}</label>
                <input
                  id={`extra-${field}`}
                  type="text"
                  placeholder={`Enter ${field.toLowerCase()}`}
                  value={extraDetails[field] || ""}
                  onChange={(event) =>
                    setExtraDetails((current) => ({
                      ...current,
                      [field]: event.target.value,
                    }))
                  }
                />
              </section>
            ))}

            <section className="customisation-field">
              <h3>Upload Your Branding</h3>
              <p>Add your logo, design or artwork.</p>
              <label className="artwork-upload">
                <UploadCloud size={28} />
                <strong>{artwork ? artwork.name : "Upload artwork"}</strong>
                <span>PNG, JPG, PDF, SVG or AI</span>
                <input
  type="file"
  accept=".png,.jpg,.jpeg,.webp,.pdf"
  onChange={(event) => {
    const file = event.target.files?.[0] || null;

    if (file && file.size > 10 * 1024 * 1024) {
      alert("Please select a file smaller than 10MB.");
      event.target.value = "";
      return;
    }

    setArtwork(file);
    event.target.value = "";
  }}
/>
              </label>
              {artwork && (
  <div className="artwork-preview">
    {artworkPreviewUrl ? (
      <img
        src={artworkPreviewUrl}
        alt="Uploaded artwork preview"
      />
    ) : (
      <div className="artwork-document-preview">
        <ImageIcon size={35} />
        <strong>PDF artwork</strong>
      </div>
    )}

    <div className="artwork-preview-info">
      <strong>{artwork.name}</strong>
      <span>
        {(artwork.size / 1024 / 1024).toFixed(2)} MB
      </span>
    </div>
  </div>
)}
              {artwork && (
                <button
                  type="button"
                  className="remove-artwork"
                  onClick={() => setArtwork(null)}
                >
                  <Trash2 size={14} /> Remove uploaded file
                </button>
              )}
            </section>

            <section className="customisation-field">
              <label htmlFor="product-notes">Additional Notes (Optional)</label>
              <textarea
                id="product-notes"
                rows={3}
                placeholder="Tell us about your preferred finish, printing position or other requirements..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </section>

            <button
  className="whatsapp-enquiry-button"
  onClick={sendEnquiry}
  disabled={isSendingEnquiry}
>
  <MessageCircle size={20} />
  {isSendingEnquiry ? "Uploading artwork..." : "Enquire on WhatsApp"}
</button>
          </div>

          
{/* RIGHT COLUMN: PRODUCT CAROUSEL */}
<div className="product-gallery">
  <div className="product-gallery-main">

    {galleryImages.length > 0 ? (
      <img
        className="product-gallery-image"
        src={galleryImages[activeImage]?.url}
        alt={galleryImages[activeImage]?.altText || product.name}
      />
    ) : (
      <div className="gallery-placeholder">
        <ImageIcon size={65} />
        <strong>{product.name}</strong>
        <span>{product.imageLabels[activeImage] || "Product view"}</span>
        <small>Product image coming soon</small>
      </div>
    )}

    {galleryCount > 1 && (
      <>
        <button
          type="button"
          className="gallery-arrow gallery-previous"
          onClick={() => changeImage(-1)}
          aria-label="Previous image"
        >
          <ChevronLeft />
        </button>

        <button
          type="button"
          className="gallery-arrow gallery-next"
          onClick={() => changeImage(1)}
          aria-label="Next image"
        >
          <ChevronRight />
        </button>
      </>
    )}

    {galleryCount > 0 && (
      <span className="gallery-counter">
        {activeImage + 1} / {galleryCount}
      </span>
    )}
  </div>

  <div className="gallery-thumbnails">
    {galleryImages.length > 0
      ? galleryImages.map((image, index) => (
          <button
            type="button"
            key={image.id}
            className={activeImage === index ? "active" : ""}
            onClick={() => setActiveImage(index)}
          >
            <img src={image.url} alt={image.altText || product.name} />
          </button>
        ))
      : product.imageLabels.map((label, index) => (
          <button
            type="button"
            key={label}
            className={activeImage === index ? "active" : ""}
            onClick={() => setActiveImage(index)}
          >
            <ImageIcon size={25} />
            <span>{label}</span>
          </button>
        ))}
  </div>

  <div className="product-gallery-details">
    <h3>Product Details</h3>
    <p>{product.description}</p>
    <span>{product.category}</span>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}
