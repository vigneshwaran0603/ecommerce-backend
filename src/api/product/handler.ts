import { Request, ResponseToolkit } from "@hapi/hapi";
import { productSchema } from "../../shared/validation/product.validation";
import {
  createProductOperation,
  getAllProductOperation,
  getProductByIdOperation,
  updateProductOperation,
} from "../../operations/product.operation";
import cloudinary from "../../utils/cloudinary";

// -------------------- CREATE PRODUCT --------------------
export const createProduct = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload: any = req.payload;
    let imageUrl = "";

    // Upload image to Cloudinary
    if (payload.image?.hapi) {
      const file = payload.image;

      const chunks: Buffer[] = [];
      for await (const chunk of file) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "products",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

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
    return h.response({ error: err.message }).code(400);
  }
};

// -------------------- GET ALL PRODUCTS --------------------
export const getAllProducts = async (req: Request, h: ResponseToolkit) => {
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
  } catch (error: any) {
    return h.response({ error: error.message }).code(400);
  }
};

// -------------------- UPDATE PRODUCT --------------------
export const updateProduct = async (req: Request, h: ResponseToolkit) => {
  try {
    const id = req.params.id;
    const payload: any = req.payload;

    let updateData: any = {
      name: payload.name,
      price: payload.price,
      category: payload.category,
      description: payload.description,
    };

    if (payload.image?.hapi) {
      const file = payload.image;

      const chunks: Buffer[] = [];
      for await (const chunk of file) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);

      const uploadResult: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "products",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      updateData.image = uploadResult.secure_url;
    }

    const updated = await updateProductOperation(id, updateData);

    return h.response({
      message: "Product updated successfully",
      updated,
    });
  } catch (err: any) {
    return h.response({ error: err.message }).code(400);
  }
};
