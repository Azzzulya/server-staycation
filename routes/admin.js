const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload } = require('../middlewares/multer')

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


router.get('/item', adminController.viewItem);
router.get('/booking', adminController.viewBooking);

module.exports = router;