const express =require('express');
const path=require('path');
const bodyParser =require('body-parser');
const exphbs =require('express-handlebars');
const db=require('./config/database').connect();
const connectFlash=require('connect-flash');
const expressSession=require('express-session');
const passport=require('passport');
const helpers=require('handlebars-helpers');

const app=express();

require('./config/passport')(passport);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers:{
        compare:helpers.comparison()
    }
}));
app.set('view engine', 'handlebars');

app.use(expressSession({
    secret: 'd7xtdz8t8ft76d767g',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(connectFlash());

app.use((req,res,next)=>{
    res.locals.success_register_msg=req.flash('success_register_msg');
    res.locals.success_logout_msg=req.flash('success_logout_msg');
    res.locals.fail_register_msg=req.flash('fail_register_msg');
    res.locals.share_msg=req.flash('share_msg');
    res.locals.unshare_msg=req.flash('unshare_msg');
    res.locals.change_msg=req.flash('change_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    // res.locals.validate_msg=req.flash('validate_msg');
    next();
});

//front-end libs
app.use('/jquery',express.static(path.join(__dirname,'node_modules/jquery/dist')));
app.use('/jqueryui',express.static(path.join(__dirname,'node_modules/jqueryui')));
app.use('/fontawesome',express.static(path.join(__dirname,'node_modules/font-awesome')));
app.use('/materialize',express.static(path.join(__dirname,'node_modules/materialize-css')));

//routings
app.use('/',require('./controllers/index'));
app.use('/auth',require('./controllers/auth'));
app.use('/folder',require('./controllers/folder'));
app.use('/file',require('./controllers/file'));
app.use('/shared',require('./controllers/share'));
app.use('/account',require('./controllers/account'));

app.use((req,res)=>{
   let error=new Error();
   error.status=404;
   res.render('error/error',{
       header:'404',
       message:'Żądany zasób nie został znaleziony'
   })
});

module.exports=app;