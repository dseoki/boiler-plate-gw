const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

const config = require('./config/key');

const {User} = require('./models/User');


// 클라인언트로부터 받은 정보를 파싱하기위한 처리
app.use(bodyParser.urlencoded({extended: true})); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected.....'))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello Wolrd!~ 안녕하세요~~'));


app.post('/register', (req, res) => {
    // 회원 가입할때 필요한 정보들을 client에서 가져오면 그것을 DB에 넣어준다.
    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err});
        return res.status(200).json({
            success: true
        })
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}}!`));