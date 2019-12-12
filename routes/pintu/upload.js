const express = require('express');
let gm = require('gm');
const router = express.Router();
const fs = require('fs');
const path = require('path');
//const joint = require('./joint');
//上传图片的模板
var multer = require('multer');
//生成的图片放入uploads文件夹下
var upload = multer({ dest: 'uploads/' })
//图片上传必须用post方法
let imgPath = path.join(__dirname, '../../static/')
router.post('/img', upload.single('test'), (req, res) => {
    fs.readFile(req.file.path, (err, data) => {
        if (err) { return res.send('上传失败') }
        let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
        let extname = req.file.mimetype.split('/')[1];
        //拼接成图片名
        let keepname = time + '.' + extname;
        let img = gm(data, keepname).resize(1366, 768, '!'),
            imgList = [req.file.path];
        imgList.push(imgPath + '/source/'+ keepname);
        img.resize(1366, 768, '!').write(imgList[1], function (err) {
            if (err) {
                console.log(err);
                res.send({
                    code: '500',
                    msg: err
                });
                return false;
            };
            let outUrl = path.join(__dirname, '../../public/images/', keepname);
            gm()
                .in('-page', '+0+0')
                .in(imgList[0])
                .in('-page', '+1920+0') // location of smallIcon.jpg is x,y -> 10, 20
                .in(imgList[1])
                .mosaic()
                .write(outUrl, function(err){
                if (err) {
                    res.send({
                        code: '500',
                        msg: err
                    });
                    return false;
                };
                res.send({
                    code: 200,
                    msg: 'ok',
                    url: '/images/' + keepname
                })
            })
        });
    });
})
module.exports = router;
