import { Request, ResponseToolkit } from "@hapi/hapi";
import { productSchema } from "../../shared/validation/product.validation";
import {
  createProductOperation,
  getAllProductOperation,
  getProductByIdOperation,
  updateProductOperation,
} from "../../operations/product.operation";
import cloudinary from "../../utils/cloudinary";

/**
 * Helper: upload Hapi stream to Cloudinary safely
 */
const uploadToCloudinary = async (file: any): Promise<string> => {
  if (!file || typeof file !== "object") {
    throw new Error("Invalid image file");
  }

  const chunks: Buffer[] = [];
  for await (const chunk of file) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, res) => {
        if (error) reject(error);
        else resolve(res);
      }
    ).end(buffer);
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

    if (!payload || !payload.image) {
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
    return h.response({ error: err.message }).code(500);
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
      name: payload.name,
      price: payload.price,
      category: payload.category,
      description: payload.description,
    };

    // image is optional during update
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
    return h.response({ error: err.message }).code(500);
  }
};
