import PropTypes from "prop-types";
import { useState } from "react";
import { Upload, Button, Image, notification } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadOutlined } from "@ant-design/icons";

// Resize the cropped image to 530x300
const resizeImage = (file, width, height) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new window.Image();
            img.src = e.target.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    const resizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now(),
                    });
                    resolve({
                        file: resizedFile,
                        url: URL.createObjectURL(blob),
                    });
                }, file.type);
            };
        };
    });
};

const SubCategoryImageUpload = ({ setImageFile }) => {
    const [previewUrl, setPreviewUrl] = useState("");

    const handleChange = async ({ file }) => {
        const rawFile = file.originFileObj;
        if (!rawFile) return;

        const isImage = rawFile.type.startsWith("image/");
        const isLt2M = rawFile.size / 1024 / 1024 < 2;

        if (!isImage) {
            notification.error({ message: "Only image files are allowed." });
            return;
        }
        if (!isLt2M) {
            notification.error({ message: "Image must be smaller than 2MB!" });
            return;
        }

        const resized = await resizeImage(rawFile, 530, 300);
        setPreviewUrl(resized.url);
        setImageFile(resized.file);
    };

    return (
        <div>
            {previewUrl && (
                <Image
                    width={250}
                    src={previewUrl}
                    alt="Preview"
                    style={{ marginBottom: 12, borderRadius: 8 }}
                />
            )}

            <ImgCrop
                aspect={530 / 300}
                showGrid
                rotationSlider
                modalTitle="Crop Image"
                quality={1}
            >
                <Upload
                    accept="image/*"
                    showUploadList={false}
                    customRequest={({ onSuccess }) =>
                        setTimeout(() => onSuccess("ok"), 0)
                    }
                    onChange={handleChange}
                >
                    <Button icon={<UploadOutlined />}>Upload & Crop Image</Button>
                </Upload>
            </ImgCrop>
        </div>
    );
};

SubCategoryImageUpload.propTypes = {
    setImageFile: PropTypes.func.isRequired,
};

export default SubCategoryImageUpload;
