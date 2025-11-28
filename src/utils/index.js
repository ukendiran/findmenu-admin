// utils/index.js

import apiService from "../services/apiService";

export function genarateIndexKey(str, key) {
    if (typeof str !== "string") return str;
    const text = str.replace(/\s+/g, "_");
    return `${text}_${key}`
}

export function checkImageNull(image) {
    // Check for null, undefined, empty string, or strings containing 'null' or 'undefined'
    if (!image || 
        image === null || 
        image === undefined || 
        image === '' || 
        image === 'null' || 
        image === 'undefined' ||
        String(image).trim() === '') {
        return `${apiService.apiUrl}/images/no-image.png`;
    }
    // If image already contains full URL, return as is
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
        return image;
    }
    return `${apiService.apiUrl}/${image}`;
}

