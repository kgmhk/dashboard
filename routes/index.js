import express from 'express';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
  if (!req.session.user_id) {

    res.render('login');
  } else {
    res.render('products', {user_id: req.session.user_id})
  }
  // else {
  //     res.render('products', {
  //         title: 'Express'
  //     });
  // }

});

export default router;
