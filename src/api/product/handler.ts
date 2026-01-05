

import { Request, ResponseToolkit } from "@hapi/hapi";
import { productSchema } from "../../shared/validation/product.validation";
import {
  createProductOperation,
  getAllProductOperation,
  getProductByIdOperation,
  updateProductOperation,
} from "../../operations/product.operation";
import cloudinary from "../../utils/cloudinary";

// -------------------- STREAM → BUFFER (HAPI SAFE) --------------------
const streamToBuffer = (stream: any): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });

// -------------------- CLOUDINARY UPLOAD --------------------
const uploadToCloudinary = async (file: any): Promise<string> => {
  if (!file || typeof file.on !== "function") {
    throw new Error("Invalid image stream");
  }

  const buffer = await streamToBuffer(file);

  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "products" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });

  if (!result?.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return result.secure_url;
};

// -------------------- CREATE PRODUCT --------------------
export const createProduct = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload: any = req.payload;

    if (!payload) {
      return h.response({ error: "Payload missing" }).code(400);
    }

    if (!payload.image) {
      return h.response({ error: "Product image is required" }).code(400);
    }

    const imageUrl = await uploadToCloudinary(payload.image);

    const data = {
      name: payload.name,
      description: payload.description,
      price: Number(payload.price),
      category: payload.category,
      image: imageUrl,
    };

    const validated = productSchema.parse(data);
    const product = await createProductOperation(validated);

    return h.response({ message: "Product created", product }).code(201);
  } catch (err: any) {
    console.error("CREATE PRODUCT ERROR:", err);
    return h.response({ error: err.message || "Internal Server Error" }).code(500);
  }
};

// -------------------- GET ALL PRODUCTS --------------------
export const getAllProducts = async (_req: Request, h: ResponseToolkit) => {
  try {
    const products = await getAllProductOperation();
    return h.response(products).code(200);
  } catch (err: any) {
    return h.response({ error: err.message }).code(400);
  }
};

// -------------------- GET PRODUCT BY ID --------------------
export const getProductById = async (req: Request, h: ResponseToolkit) => {
  try {
    const id = req.query.id;
    if (!id) {
      return h.response({ error: "Product ID is required" }).code(400);
    }

    const product = await getProductByIdOperation(id);
    return h.response(product).code(200);
  } catch (err: any) {
    return h.response({ error: err.message }).code(400);
  }
};

// -------------------- UPDATE PRODUCT --------------------
export const updateProduct = async (req: Request, h: ResponseToolkit) => {
  try {
    const id = req.params.id;
    const payload: any = req.payload;

    const updateData: any = {
      name: payload?.name,
      price: payload?.price,
      category: payload?.category,
      description: payload?.description,
    };

    if (payload?.image) {
      updateData.image = await uploadToCloudinary(payload.image);
    }

    const updated = await updateProductOperation(id, updateData);

    return h.response({
      message: "Product updated successfully",
      updated,
    });
  } catch (err: any) {
    console.error("UPDATE PRODUCT ERROR:", err);
    return h.response({ error: err.message || "Internal Server Error" }).code(500);
  }
};
