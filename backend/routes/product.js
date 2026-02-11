import express from "express";
import { deleteProduct, getProduct, postProduct, updateProduct } from "../controllers/product.js";


const router = express.Router();


router.post('/', postProduct);
router.delete('/:id', deleteProduct );
router.get('/', getProduct );
router.put('/:id', updateProduct);


export default router;
