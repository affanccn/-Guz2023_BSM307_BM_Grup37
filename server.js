const express = require('express') 
const socket = require('socket.io') 
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express()   
app.use(session({
  secret: 'asfasfsasd',
  resave: false,
  saveUninitialized: true
}));
        
const server = app.listen(process.env.PORT || 3000)     
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))    
mongoose.connect('mongodb+srv://affan:affan123@nodechat.blobyxz.mongodb.net/node-chat?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB bağlantı hatası:'));
db.once('open', () => {
  console.log('MongoDB bağlantısı başarılı');
});

// Kullanıcı Şeması ve Modeli
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);
app.get('/anasayfa', (req, res) => {
  res.render('anasayfa');
});
app.get('/', (req, res) => {
  res.render('anasayfa');
});
app.get('/chat', (req, res) => {
  console.log(req.session)  
  if(req.session.username){
    res.render('chat',{username : req.session.username});

  }else{
    res.redirect('/anasayfa')
  }
  
  });
app.get('/kayitol', (req, res) => {
    res.render('kayitol');
  });
  
  app.post('/kayitol', (req, res) => {
    const { username, password } = req.body;
  
    const newUser = new User({
      username: username,
      password: password
    });
  
    newUser.save().then((data) => {
      if (data) {
        res.redirect('/giris');
      } else {
        console.error(data);
        res.send('Kayıt sırasında bir hata oluştu.');
        
      }
    });
  });
  
  app.get('/giris', (req, res) => {
    res.render('giris');
  });
  
  app.post('/giris', (req, res) => {
    const { username, password } = req.body;
  
    User.findOne({ username: username, password: password }).then(foundUser => {
       
        if (foundUser) {
          req.session.username = username;
          res.redirect('/chat')
        } else {
          res.send('Kullanıcı adı veya şifre hatalı!');
        }
      
  }).catch(err => {
    console.log(err)
    res.send('hata oldu')
  } );
  });
  


const io = socket(server)          

io.on('connection', (socket) => {   
    console.log(socket.id)          

    socket.on('chat' , data => {
        io.sockets.emit('chat',data)           
    })
    socket.on('typing', data => {
     socket.broadcast.emit('typing',data)     
         
    })
})