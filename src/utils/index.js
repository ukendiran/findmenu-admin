// utils/index.js

import apiService from "../services/apiService";

export function genarateIndexKey(str, key) {
    if (typeof str !== "string") return str;
    const text = str.replace(/\s+/g, "_");
    return `${text}_${key}`
}

export function checkImageNull(image) {
    if (image == null) return `${apiService.apiUrl}/images/no-image.png`;
    return `${apiService.apiUrl}/${image}`;
}

