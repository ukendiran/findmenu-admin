// imageHelper.jsx
import { Image } from "antd";

export const renderSafeImage = (src, alt = "") => {
  return (
    <Image
      src={src}
      alt={alt}
      preview={false}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",     // prevents stretching
        objectPosition: "center",
        backgroundColor: "white", // optional padding background
      }}
      fallback=""
    />
  );
};

