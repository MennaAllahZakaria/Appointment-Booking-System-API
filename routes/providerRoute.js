const express = require("express");

const{
    createProvider,
    updateUserToProvider,
    getProvider,
    getAllProviders,
    getProviderAvailability,
    getProvidersBySpecialization,
    updateProviderInfo,
    deleteProvider
}=require("../services/providerService");

const {
    idValidator,
    updateUserToProviderValidator,
    updateProviderInfoValidator
}=require("../utils/validators/providerValidator");

const { protect, allowedTo ,signup} = require("../services/authService");

const router = express.Router();

router.route('/')
                .post(createProvider,signup)
                .put(protect,updateUserToProviderValidator,updateUserToProvider)
                .get(protect,getAllProviders);

router.route('/:id')
                .get(protect,  getProvider)
                .delete(protect,allowedTo('admin'),idValidator,deleteProvider)


router.get('/availability/:id',protect,idValidator,getProviderAvailability);

router.get('/specialization/:specialization',protect,getProvidersBySpecialization);

router.put('/info',protect,updateProviderInfoValidator,updateProviderInfo);

module.exports = router;