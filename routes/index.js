import express from 'express';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
  console.log('get / ')
  if (!req.session.user_id) {

    res.render('login');
  } else {
    res.render('add_product', {user_id: req.session.user_id})
  }
});

export default router;
