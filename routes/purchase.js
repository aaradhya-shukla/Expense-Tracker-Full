const express = require('express');

const Premium = require('../controllers/Premium');

const router = express.Router();

router.get('/purchase-premium',Premium.authenticate,Premium.createPurchaseOrder)

router.post('/updatePurchaseStatus',Premium.authenticate,Premium.postUpdatePaymentStatus);

module.exports = router;
