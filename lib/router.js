//console.log("RUNNING");
Router.configure({
layoutTemplate: 'layout'
});
Router.route('/', {name: 'home'});
Router.route('/signup', {name: 'signup'})
Router.route('/borrow', {name: 'borrow'});
Router.route('/register', {name: 'register'});
Router.route('/login', {name: 'login'});
Router.route('/lend', {name: 'lend'});
