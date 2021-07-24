const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../middlewares/multer');
const auth = require('../middlewares/auth');


// login
router.get('/signin', adminController.viewSignin);
router.post('/signin', adminController.actionSignin);
router.use(auth)

// /dashboard
router.get('/dashboard', adminController.viewDashboard);
// -------------------CATEGORY-------------------
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);
// -------------------CATEGORY-------------------

// -------------------BANK-------------------
router.get('/bank', adminController.viewBank);
router.post('/bank', upload, adminController.addBank);
router.put('/bank', upload, adminController.editBank);
router.delete('/bank/:id', upload, adminController.deleteBank);
// -------------------BANK-------------------

// -------------------ITEM-------------------
router.get('/item', adminController.viewItem);
router.post('/item',uploadMultiple,  adminController.addItem);
router.get('/item/show-image/:id', adminController.showImageItem);
router.get('/item/:id', adminController.showEditItem);
router.put('/item/:id',uploadMultiple, adminController.editItem);
router.delete('/item/:id', adminController.deleteItem);

// -------------------ITEM-------------------

// -------------------FEATURE-------------------
router.get('/item/show-detail-item/:itemId', adminController.viewDetailItem);
router.post('/item/add/feature',upload, adminController.addFeature);
router.put('/item/update/feature',upload, adminController.editFeature);
router.delete('/item/:itemId/feature/:id', adminController.deleteFeature);
// -------------------FEATURE-------------------

// -------------------ACTIVITY-------------------
router.post('/item/add/activity', upload, adminController.addActivity);
// router.post('/item/add/feature',upload, adminController.addFeature);
router.put('/item/update/activity',upload, adminController.editActivity);
router.delete('/item/:itemId/activity/:id', adminController.deleteActivity);
// -------------------ACTIVITY-------------------


router.get('/booking', adminController.viewBooking);

module.exports = router;