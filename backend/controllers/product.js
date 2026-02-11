import Product from "../models/product.js";
import mongoose from "mongoose";

export const postProduct = async (req, res) => {
    const product = req.body;

    if (!product.name || !product.price || !product.image) {
        return res
            .status(400)
            .json({ success: false, message: "Provide all fields" });
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        res
            .status(201)
            .json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in creat product:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(404)
            .json({ success: false, message: "Invalid Product id" });
    }

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error("Error in deleting product", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getProduct = async (req, res) => {
    try {
        const products = await Product.find({});
        res
            .status(200)
            .json({
                success: true,
                data: products,
                message: "Product fetched succefully",
            });
    } catch (error) {
        console.error("Error in getting product", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(404)
            .json({ success: false, message: "Invalid Product id" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, {
            new: true,
        });
        res
            .status(200)
            .json({
                success: true,
                data: updatedProduct,
                message: "Product updated",
            });
    } catch (error) {
        console.error("Error in updating product", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
