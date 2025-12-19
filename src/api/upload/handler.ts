import { Request, ResponseToolkit } from "@hapi/hapi";
import { saveUploadedFile } from "../../operations/product.operation";

export const uploadFile = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload: any = req.payload;

    if (!payload || !payload.file) {
      return h.response({ error: "File missing" }).code(400);
    }

    const savedPath = await saveUploadedFile(payload.file);

    return h.response({
      message: "File uploaded successfully",
      path: savedPath,
    }).code(200);

  } catch (error: any) {
    return h.response({ error: error.message }).code(400);
  }
};