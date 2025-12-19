import { Request, ResponseToolkit } from "@hapi/hapi";
import { productSchema } from "../../shared/validation/product.validation";
import { createProductOperation, getAllProductOperation, getProductByIdOperation, updateProductOperation } from "../../operations/product.operation";
import fs from "fs";
import path from "path";

// POST product

export const createProduct = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload: any = req.payload;
    let imagePath = "";

    // Image upload using Buffer
    if (payload.image?.hapi) {
      const file = payload.image;
      const fileName = Date.now() + "_" + file.hapi.filename;
      const uploadDir = path.join(process.cwd(), "uploads");

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      const filePath = path.join(uploadDir, fileName);

      // Convert stream → buffer
      const chunks: Buffer[] = [];
      for await (const chunk of file) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      fs.writeFileSync(filePath, buffer);

      imagePath = `/uploads/${fileName}`;
    }

    // Prepare product data
    const data = {
      name: payload.name,
      description: payload.description,
      price: Number(payload.price),
      category: payload.category,
      image: imagePath,
    };

    // Validate
    const validated = productSchema.parse(data);

    // Save to DB
    const product = await createProductOperation(validated);

    return h.response({ message: "Product created", product }).code(201);

  } catch (err: any) {
    return h.response({ error: err.message }).code(400);
  }
};


// get product
export const getAllProducts = async(req:Request,h:ResponseToolkit)=>{
  try{
    const products = await getAllProductOperation();
    return h.response(products).code(200);


  }catch(err:any){
    return h.response({error:err.message}).code(400);
  }
}

// get one product by product id
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

// update product using put method

// UPDATE product

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

    if (payload.image && payload.image.hapi) {
      const file = payload.image;

      // FIXED PATH
      const filename = Date.now() + "-" + file.hapi.filename;
      const uploadPath = path.join(process.cwd(), "uploads", filename);

      // create directory if not exists
      fs.mkdirSync(path.join(process.cwd(), "uploads"), { recursive: true });

      const fileStream = fs.createWriteStream(uploadPath);
      file.pipe(fileStream);

      updateData.image = "/uploads/" + filename;
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