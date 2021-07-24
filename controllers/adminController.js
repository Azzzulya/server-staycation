
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Users = require('../models/Users');
const Image = require('../models/Image');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
  viewSignin : async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus}
      res.render('index', { 
        alert ,
        title: "Staycation | Login",
      });
    } catch (error) {
      res.redirect('/admin/signin');
    }  
  },

  actionSignin : async (req, res) => {
    try {
      const { username, password} = req.body;
      const user = await Users.findOne({ username: username});
      if(!user){
        req.flash('alertMessage', 'User yang anda masuka tidak terdaftar');
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if(!isPasswordMatch){
        req.flash('alertMessage', 'Password anda tidak cocok');
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
      }
      res.redirect('/admin/dashboard');
    } catch (error) {
      res.redirect('/admin/signin');
      
    }
  },

  viewDashboard : (req, res) => {
    res.render('admin/dashboard/view_dashboard',{
      title: "Staycation | Dashboard",
    });
  },


  // START CATEGORY
  viewCategory : async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus}
      res.render('admin/category/view_category', { 
        category,
        alert ,
        title: "Staycation | Category",
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.render('admin/category/view_category');
    }  
  },

  addCategory : async (req, res) => {
    try {
      const {name} = req.body;
      await Category.create({ name });
      req.flash('alertMessage', 'Succes Add Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  editCategory : async (req, res) => {
    try {
      const {id, name} = req.body;
      const category = await Category.findOne({ _id:id });
      category.name = name;
      await category.save();
      req.flash('alertMessage', 'Succes Update Category');
      req.flash('alertStatus', 'info');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  deleteCategory : async (req, res) => {
    try {
      const {id} = req.params;
      const category = await Category.findOne({ _id:id });
      await category.remove();
      req.flash('alertMessage', 'Success Delete Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category')
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
   
  },
  // END CATEGORY

  // START BANK
  viewBank : async (req, res) => {
    try {
        const bank = await Bank.find();
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = { message: alertMessage, status: alertStatus}
        res.render('admin/bank/view_bank', {
          bank,
          alert,
          title: "Staycation | Bank",
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.render('admin/bank/view_bank');
    }
  },

  addBank : async (req, res) => {
    try {
      const {name, nameBank, nomorRekening} = req.body;
      console.log(req.file)
      await Bank.create({ 
        name,
        nameBank, 
        nomorRekening,
        imageUrl : `images/${req.file.filename}` 
      });
      req.flash('alertMessage', 'Succes Add Bank');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomorRekening } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file == undefined) {
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        await bank.save();
        req.flash('alertMessage', 'Success Update Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.imageUrl = `images/${req.file.filename}`
        await bank.save();
        req.flash('alertMessage', 'Success Update Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  deleteBank : async (req, res) => {
    try {
      const {id} = req.params;
      const bank = await Bank .findOne({ _id:id });
      await bank.remove();
      req.flash('alertMessage', 'Success Delete Bank ');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank')
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },
  // ----------------------------END BANK---------------------------

  // ---------------------------- ITEM---------------------------
  viewItem : async (req, res) => {
    try {
      const category = await Category.find()
      
      const item = await Item.find()
        .populate({path: 'imageId', select:'id imageUrl'})
        .populate({ path: 'categoryId', select:'id name'});
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus}
      res.render('admin/item/view_item', {
        title: "Staycation | Item",
        category,
        alert,
        item,
        action : 'view'
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, city, about } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId,
          title,
          description: about,
          price,
          city
        }
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash('alertMessage', 'Success Add Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'imageId', select: 'id imageUrl' });
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/item/view_item', {
        title: "Staycation | Show Image Item",
        alert,
        item,
        action: 'show image',
       
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const category  = await Category.find();
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/item/view_item', {
        title: "Staycation | Edit Image Item",
        alert,
        item,
        category,
        action: 'edit',
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const {categoryId, title, price, city, about} = req.body;
      // const category  = await Category.find();
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });

        if(req.files.length > 0 ){
          for(let i = 0; i < item.imageId.length; i++){
            const imageUpdate = await Image.findOne({ _id:item.imageId[i]._id});
            await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
            imageUpdate.imageUrl = `images/${req.files[i].filename}`;
            await imageUpdate.save();
          }
          item.title = title;
          item.price = price;
          item.city = city;
          item.description = about;
          item.categoryId = categoryId;
          await item.save();
          req.flash('alertMessage', 'Succes Edit Item');
          req.flash('alertStatus', 'success');
          res.redirect('/admin/item');
        }else{
          item.title = title;
          item.price = price;
          item.city = city;
          item.description = about;
          item.categoryId = categoryId;
          await item.save();
          req.flash('alertMessage', 'Succes Edit Item');
          req.flash('alertStatus', 'success');
          res.redirect('/admin/item');
        }
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };
      res.render('admin/item/view_item', {
        title: "Staycation | Edit Image Item",
        alert,
        item,
        category,
        action: 'edit',
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  deleteItem : async (req, res) => {
    try {
      const {id} = req.params;
      const item = await Item.findOne({ _id: id }).populate('imageId');
      for(let i=0; i< item.imageId.length; i++){
        Image.findOne({_id: item.imageId[i]._id}).then((image)  => {
          fs.unlink(path.join(`public/${image.imageUrl}`));
          image.remove();
        }).catch((error) => {
          req.flash('alertMessage', `${error.message}`);
          req.flash('alertStatus', 'danger');
          res.redirect('/admin/item');
        })
      }
      await item.remove();
      req.flash('alertMessage', 'Success Delete Item ');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/item')
     
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },
// ----------------------------END ITEM---------------------------

// ---------------------------- FEATURE ---------------------------
  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    console.log(itemId)
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = { message: alertMessage, status: alertStatus };

      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });

      res.render('admin/item/detail_item/view_detail_item', {
        title: 'Staycation | Detail Item',
        alert,
        itemId,
        feature,
        activity,
      })

    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;

    try {
      if (!req.file) {
        req.flash('alertMessage', 'Image not found');
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save()
      req.flash('alertMessage', 'Success Add Feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
 
  editFeature: async (req, res) => {
    const { id, name,  qty, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();
        req.flash('alertMessage', 'Success Update Feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`
        await feature.save();
        req.flash('alertMessage', 'Success Update Feature');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteFeature : async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });

      const item = await Item.findOne({ _id: itemId }).populate('featureId');
      for (let i = 0; i < item.featureId.length; i++) {
        if (item.featureId[i]._id.toString() === feature._id.toString()) {
          item.featureId.pull({ _id: feature._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();
      req.flash('alertMessage', 'Success Delete Feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  // ---------------------------- END FEATURE---------------------------

  // ---------------------------- ACTIVITY---------------------------
  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;

    try {
      if (!req.file) {
        req.flash('alertMessage', 'Image not found');
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: activity._id });
      await item.save()
      req.flash('alertMessage', 'Success Add Activity');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editActivity: async (req, res) => {
    const { id, name,  type, itemId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: id });
      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();
        req.flash('alertMessage', 'Success Update activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`
        await activity.save();
        req.flash('alertMessage', 'Success Update activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteActivity : async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const activity = await Activity.findOne({ _id: id });

      const item = await Item.findOne({ _id: itemId }).populate('activityId');
      for (let i = 0; i < item.activityId.length; i++) {
        if (item.activityId[i]._id.toString() === activity._id.toString()) {
          item.activityId.pull({ _id: activity._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();
      req.flash('alertMessage', 'Success Delete Activity');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },
  // ---------------------------- END ACTIVITY---------------------------

 

  viewBooking : (req, res) => {
    res.render('admin/booking/view_booking', {
      title: "Staycation | Booking",
    });
  }
}