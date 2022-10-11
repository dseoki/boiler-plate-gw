const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require('./middleware/auth');
const {User} = require('./models/User');


// 클라인언트로부터 받은 정보를 파싱하기위한 처리
app.use(bodyParser.urlencoded({extended: true})); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json
app.use(cookieParser());

const mongoose = require('mongoose');

// mongoose.connect(config.mongoURI, {
//     useNewUrlParser: true, useUnifiedTopology: true
//     useCreateIndex: true, useFindAndModify: false
// })
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB connected.....'))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello Wolrd!~ 안녕하세요~~'));

app.get('/api/hello', (req, res) => res.send('안녕하세요~!!'));

app.post('/api/users/register', (req, res) => {
    // 회원 가입할때 필요한 정보들을 client에서 가져오면 그것을 DB에 넣어준다.
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        })
    });
});

app.post('/api/users/login', (req, res) => {
    // 요청된 email을 DB에 있는지 확인한다.
    User.findOne({email: req.body.email}, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }

        // 요청된 email이 DB에 있다면 비밀번호가 일치한지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."});

            // 비밀번호가 일치하면 TOKEN을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                // token을 저장한다.어디에?? (쿠키, 로컬스토리지)
                res.cookie('x_auth', user.token)
                .status(200)
                .json({
                    loginSuccess: true,
                    userId: user._id
                });
            });
        });
    });
    
});

app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 미들웨어를 통과했다는 이야기는 Authentication이 true라는 것.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token: ''}, (err, user) => {
        if(err) return res.json({success: false, err});
        return res.status(200).send({
            success: true
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}}!`));