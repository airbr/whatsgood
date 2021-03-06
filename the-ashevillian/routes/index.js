const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const statsController = require('../controllers/statsController');
const aboutController = require('../controllers/aboutController');
const reviewController = require('../controllers/reviewController');
const navigator = require('navigator');


const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));

router.get('/add', authController.isLoggedIn, storeController.addStore);

router.post('/add',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);

router.post('/add/:id',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);


router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/stats', catchErrors(statsController.showStats));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);

router.post('/login', authController.login);


router.get('/register', userController.registerForm);

router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));

router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update)
);
router.post('/deletereviews/:id', authController.isLoggedIn, catchErrors(reviewController.deleteReview));

router.get('/map', storeController.mapPage);
router.get('/hearts', authController.isLoggedIn, catchErrors(storeController.getHearts));
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));
// router.get('/top', catchErrors(storeController.getTopStores));
router.get('/about', catchErrors(aboutController.showAbout));


/* API */

router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '.' })
      .then(function(reg) {
        console.log('Registered service worker ', reg);
      });
  
    navigator.serviceWorker.addEventListener('controllerchange', function(event) {
      console.log('[controllerchange] A "controllerchange" event has happened ' +
                  'within navigator.serviceWorker: ', event
                 );
  
      navigator.serviceWorker.controller.addEventListener('statechange', function() {
        console.log('[controllerchange][statechange] ' , this.state);
  
        if (this.state === 'activated') {
          console.log('ready to go offline!');
        }
      });
    });
  }


module.exports = router;
