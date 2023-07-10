const { Product } = require("../models");
const { v4: uuid } = require("uuid");
const cloudinary = require("./cloudinary");

module.exports = {
    async createProduct(req, res) {
        const isAdmin = req.user.role;
        const { name, description, category, price } = req.body;

        if (isAdmin !== "admin") {
            res.status(401).json({
                message: "Unauthorized access is prohibited",
            });
        }

        if (req.file == null) {
            res.status(400).json({
                status: "failed",
                message: "you must input image",
            });
        } else {
            const fileBase64 = req.file.buffer.toString("base64");
            const file = `data:${req.file.mimetype};base64,${fileBase64}`;

            cloudinary.uploader.upload(
                file,
                { folder: "product-ngaos" },
                async function (err, result) {
                    if (!!err) {
                        res.status(400).json({
                            status: "upload fail",
                            errors: err.message,
                        });
                        return;
                    }

                    const dataProduct = await Product.create({
                        id: uuid(),
                        name,
                        description,
                        image: result.url,
                        category,
                        price,
                    });

                    res.status(201).json({
                        status: "success",
                        message: "create product success",
                        data: dataProduct,
                    });
                }
            );
        }
    },

    async getAllProductData(req, res) {
        const findAll = () => {
            return Product.findAll();
        };
        try {
            const dataProduct = await findAll();
            if (dataProduct.length === 0) {
                res.status(200).json({
                    status: "failed",
                    message: "Data is empty",
                    data: [],
                });
                return;
            }
            res.status(200).json({
                status: "success",
                message: "Get All Data Product Success",
                data: dataProduct,
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },

    async getProductById(req, res) {
        const { productId } = req.params;
        const getProduct = () => {
            return Product.findOne({
                where: {
                    id: productId,
                },
            });
        };

        const dataProduct = await getProduct();
        if (dataProduct.length === 0) {
            res.status(200).json({
                status: "failed",
                message: "Data is empty",
                data: [],
            });
            return;
        }
        res.status(200).json({
            status: "success",
            message: "get data product successfully",
            data: dataProduct,
        });
    },

    async updateProduct(req, res) {
        const isAdmin = req.user.role;
        const { productId } = req.params;
        const { name, description, category, price } = req.body;

        if (isAdmin !== "admin") {
            res.status(401).json({
                message: "Unauthorized access is prohibited",
            });
            return;
        }
        if (req.file == null) {
            await Product.update(
                {
                    name,
                    description,
                    category,
                    price,
                },
                {
                    where: {
                        id: productId,
                    },
                }
            );

            const updatedProduct = await Product.findOne({
                where: {
                    id: productId,
                },
            });

            res.status(200).json({
                status: "success",
                message: "update product success",
                data: updatedProduct,
            });
        } else {
            const fileBase64 = req.file.buffer.toString("base64");
            const file = `data:${req.file.mimetype};base64,${fileBase64}`;

            //menghapus foto sebelumnya dari Cloudinary
            const product = await Product.findOne({
                where: {
                    id: productId,
                },
            });
            if (product && product.image) {
                const publidId = product.image.split("/").pop().split(".")[0];
                cloudinary.uploader.destroy(publidId);
            }

            // Mengunggah foto batu ke cloudinary
            cloudinary.uploader.upload(
                file,
                {
                    folder: "product-ngaos",
                },
                async function (err, result) {
                    if (err) {
                        res.status(400).json({
                            status: "upload fail",
                            errors: err.message,
                        });
                        return;
                    }

                    await Product.update(
                        {
                            name,
                            description,
                            image: result.url,
                            category,
                            price,
                        },
                        {
                            where: {
                                id: productId,
                            },
                        }
                    );

                    const updatedProduct = await Product.findOne({
                        where: {
                            id: productId,
                        },
                    });

                    res.status(200).json({
                        status: "success",
                        message: "update product success",
                        data: updatedProduct,
                    });
                }
            );
        }
    },

    async deleteProduct(req, res) {
        const isAdmin = req.user.role;
        const { productId } = req.params;

        if (isAdmin !== "admin") {
            res.status(401).json({
                message: "Unauthorized access is prohibited",
            });
            return;
        }

        try {
            Product.destroy({
                where: {
                    id: productId,
                },
            })
                .then(() => {
                    res.status(200).json({
                        status: "success",
                        message: "User Data deleted successfully",
                    });
                })
                .catch((err) => {
                    res.status(422).json(err);
                });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: error.message,
            });
        }
    },
};
