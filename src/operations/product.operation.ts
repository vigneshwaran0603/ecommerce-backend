// product.operation.ts
import Product from "../models/Product";
import { ProductInput } from "../shared/validation/product.validation";
import fs from "fs";
import path from "path";
// import { ProductInput } from "../shared/validation/product.validation";


// BUSINESS LOGIC for create product
export const createProductOperation = async (data: ProductInput) => {


  // Rule 1: Check duplicates
  const existing = await Product.findOne({ name: data.name });
  if (existing) {
    throw new Error("Product with this name already exists");
  }

  // Rule 2: Minimum price validation
  if (data.price < 1) {
    throw new Error("Price must be at least 1");
  }

  // Rule 3: save product (no stock)
  const product = await Product.create(data);

  return product;
};

//  FILE UPLOAD OPERATION (using Buffer)
export const saveUploadedFile = async (file: any): Promise<string> => {
  if (!file || !file._data || !file.hapi?.filename) {
    throw new Error("Invalid file");
  }

  // Convert uploaded file to Buffer
  const buffer = file._data;

  // Upload directory path
  const uploadDir = path.join(__dirname, "../../uploads");

  // Create folder if not exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Sanitize filename
  const safeName = file.hapi.filename
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\.-]/g, "");

  const finalName = `${Date.now()}_${safeName}`;

  const filePath = path.join(uploadDir, finalName);

  // Save file
  await fs.promises.writeFile(filePath, buffer);

  // Return public path (used by frontend)
  return `/uploads/${finalName}`;
};

// get products
export const getAllProductOperation = async()=>{
  const products = await Product.find();
  return products;

};

// get product by productid
export const getProductByIdOperation = async(id:String)=>{
  const products = await Product.findById(id);
  if(!products){
    throw new Error ("Product is not find in this Id")
  }
  return products;
};



//  UPDATE PRODUCT
export const updateProductOperation = async (id: string, data: any) => {
  if (data.name) {
    const exists = await Product.findOne({
      name: data.name,
      _id: { $ne: id },
    });

    if (exists) {
      throw new Error("Another product with this name already exists");
    }
  }

  const updated = await Product.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!updated) throw new Error("Product not found");

  return updated;
};



