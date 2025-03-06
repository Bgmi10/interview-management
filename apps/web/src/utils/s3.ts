"use client";

import axios from "axios";

export const uploadToS3 = async (file: any) => {
    try {
        const response: any = await axios.post("/api/upload", {fileName: file.name, fileType: file.type}, { withCredentials: true });
        const uploadURL = response.data.uploadUrl;
        const uploadRes = await fetch(uploadURL, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });

        if (uploadRes.ok) {
            return uploadURL.split("?")[0];
        }
    } catch (e) {
        console.log(e);
    }
}

