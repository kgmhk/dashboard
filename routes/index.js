import express from 'express';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
  if (!req.session.user_id) {

    res.render('login');
  } else {
    res.render('products')
  }
  // else {
  //     res.render('products', {
  //         title: 'Express'
  //     });
  // }

});

export default router;
