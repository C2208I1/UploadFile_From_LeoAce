const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const appRootPath = require('app-root-path');

const port = 3001;
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const storage = multer.diskStorage({
	destination: (req, file, cb)=> {
		cb(null, appRootPath + '/public/images/');
	},
	filename: (req, file, cb)=> {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

const imageFilter = (req, file, cb)=> {
	if(!file.originalname.match(/\.(jpg|JPG|png|PNG)$/)) {
		return cb(new Error('Loi roi'));
	}
	cb(null, true);
}

const upload = multer({storage: storage, fileFilter: imageFilter});

const listSrc = [];

app.get('/', (req, res)=> {
	res.render('app', {listSrc});
});

// upload multiple => upload.array('fieldname', maxCount)

app.post('/single-file', upload.single('file-pic'), (req, res)=> {
	// upload multiple
  // const newSrcs = req.files.map(item=> '/images/' + item.filename);
	// listSrc.push(newSrcs);
	// upload single
	const newSrc = '/images/' + req.file.filename;
	listSrc.push(newSrc);
	res.redirect('/');
});

app.listen(port, ()=> {
	console.log('http://localhost:' + port);
});