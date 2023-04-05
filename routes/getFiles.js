const stream = require("stream");
const express = require("express");
const multer = require("multer");
const path = require("path");
const store = require("store");
const Courses = require("../model/Courses");
var links = [];
var vdoLinks;
var fileList = [];
var downloads = [];
const {
    google
} = require("googleapis");

// MiddleWares 
const uploadRouter = express.Router();
const upload = multer();

const KEYFILEPATH = path.join(__dirname, '..', 'config', "credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.readonly"];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

// First, create a new instance of the Drive API client
const drive = google.drive({
    version: 'v3'
});

// Define the ID of the folder you want to retrieve files from
var folderId = '';


// Upload Function 
const uploadFile = async(fileObject) => {
    console.log("Into Upload")
    try {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileObject.buffer);
        const {
            data
        } = await google.drive({
            version: "v3",
            auth
        }).files.create({
            media: {
                mimeType: fileObject.mimeType,
                body: bufferStream,
            },
            requestBody: {
                name: fileObject.originalname,
                parents: ["1fYvQdpYxFdUaakSvkSwSqu0zFmBTfDFY"],
            },
            fields: "id,name",
        });
        console.log(`Uploaded file ${data.name} ${data.id}`);
    } catch (e) {
        console.warn(e)
    }
};



// Routing 

uploadRouter.get('/', async(req, res) => {
    // var course_names = [];
    // Courses.find({}, (err, data) => {
    //     if (err) return console.log(err);
    //     console.log("ARRAY ", data);
    //     // res.json(data);
    //     res.send("HELLO");
    //     // data.forEach((course => {
    //     //     course_names.push(course.course_name);
    //     // }));
    //     // res.status(202).send(`Course Names ${course_names}`);
    //     // res.render(path.join(__dirname, '..', 'views', 'rootViews', 'course.pug'), {
    //     //     courses: course_names
    //     // });
    // });
});
uploadRouter.get(`/:id`, async(req, res) => {
    folderId = '1fYvQdpYxFdUaakSvkSwSqu0zFmBTfDFY';
    console.error(req.url);

    // console.log("ARRAY ", a)
    if (store.get('links')) {
        console.log("Into If")
        links = store.get('link').link;
        files = store.get('link').fileList;
    } else {
        // Flush Before Links
        console.log("Info Else")
        links = [];
        fileList = [];
        downloads = [];
        var client = await auth.getClient();
        drive.files.list({
            q: `'${folderId}' in parents`,
            fields: 'files(name, webContentLink)',
            auth: client
        }, (err, myData) => {
            if (err) return console.error('The API returned an error:', err.message);

            const files = myData.data.files;
            // console.log(files);

            if (files.length) {
                console.log('Files:');
                files.forEach((file, index, arr) => {
                    // downloads.push(file.webContentLink);
                    fileList.push(file.name);
                    links.push(file.webContentLink.split('&')[0]);
                });
                // Using LocalStorage
                store.set('vdoLinks', {
                    links: links,
                    files: fileList
                })
                try {
                    res.render(path.join(__dirname, '..', 'views', 'subViews', 'search.pug'), {
                        links: links,
                        files: fileList
                    });
                    // res.redirect(`/courses/course/c${req.params.course_id}`);
                } catch (err) {
                    console.log(err)
                }
            } else {
                console.log('No files found.');
            }
        });
    }
});

// uploadRouter.get('/course/c:course_id', async(req, res) => {
//     console.log(req.url);
//     res.render(path.join(__dirname, '..', 'views', 'subViews', 'search.pug'), {
//         links: links,
//         files: fileList
//     });
// })



// Upload Section
uploadRouter.post("/upload", upload.any(), async(req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);
        const {
            body,
            files
        } = req;
        for (let f = 0; f < files.length; f += 1) {
            await uploadFile(files[f]);
        }

        console.log(body);
        res.status(200).send("Form Submitted");
    } catch (f) {
        res.send(f.message);
    }
});

module.exports = {
    uploadRouter,
    links
};