import 'bootstrap/dist/css/bootstrap.min.css';

jQuery($ => {
    import('./lib/app').then(App => {
        App.init();
    });
});
