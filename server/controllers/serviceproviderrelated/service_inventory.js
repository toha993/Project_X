const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Universal_Products = require('../models/Universal_Product_List');
const universal_products = Universal_Products(sequelize, Sequelize);
const Service_Inventory = require('../models//Service_Inventory');
const service_inventory = Service_Inventory(sequelize, Sequelize);

exports.getUniversalProducts = (req, res, next) => {
    universal_products.findAll().then(products => {
        res.status(200).json({
            products: products,
            message: "Success"
        });
    }).catch(err => {
        res.status(504).json({
            message: "Failed"
        });
    });
};

exports.getOwnProducts = (req, res, next) => {
    const service_id = req.body.service_id;

    service_inventory.findAll({
        attributes: ['inventory_id', 'service_id', 'product_id', 'delivery_limit', 'price'],
        where: {
            service_id: service_id
        }
    }).then(products => {
        res.status(200).json({
            products: products,
            message: "Success"
        });
    }).catch(err => {
        res.status(504).json({
            message: "Failed"
        });
    });
};

exports.getProductDetails = (req, res, next) => {
    const product_id = req.body.product_id;

    universal_products.findAll({
        where: {
            product_id: product_id
        }
    }).then(products => {
        res.status(200).json({
            products: products,
            message: "Success"
        });
    }).catch(err => {
        res.status(504).json({
            message: "Failed"
        });
    });
};

exports.addProduct = (req, res, next) => {
    const service_id = req.body.service_id;
    const product_id = req.body.product_id;
    const delivery_limit = req.body.delivery_limit;
    const price = req.body.price;

    service_inventory.findAll({
        where: {
            service_id: service_id,
            product_id: product_id 
        }
    }).then(result => {
        if(JSON.stringify(result) != JSON.stringify([])) {
            res.json({
                message: "Product already enlisted!"
            });
        }
        else {
            return service_inventory.create({
                service_id: service_id,
                product_id: product_id,
                delivery_limit: delivery_limit,
                price: price
            });
        }
    }).then(result => {
        res.status(200).json({
            message: "Success"
        });
    }).catch(err => {
        res.status(504).json({
            message: "Failed"
        });
    });
};

exports.updateProduct = (req, res, next) => {
    const inventory_id = req.body.inventory_id;
    const delivery_limit = req.body.delivery_limit;;
    const price = req.body.price;

    service_inventory.findByPk(inventory_id).then(result => {
        result.delivery_limit = delivery_limit;
        result.price = price;

        return result.save();
    }).then(ret => {
        res.status(200).json({
            message: "Success"
        });
    }).catch(err => {
        res.status(504).json({
            message: "Failed"
        });
    });
};

exports.deleteProduct = (req, res, next) => {
    const inventory_id = req.body.inventory_id;

    service_inventory.findByPk(inventory_id).then(result => {
        return result.destroy();
    }).then(ret => {
        res.status(200).json({
            message: "Success"
        });
    }).catch(err => {
        res.status(504).json({
            message: "Failed"
        });
    });
};