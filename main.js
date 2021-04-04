const http = require("http");
const express = require("express");
const fs = require("fs");
const qs = require("querystring");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const formidable = require("formidable");
let app = express();
app.use(express.static("public")); //url로 파일 접근 가능

let list = {
  file: function (filelist) {
    let list = "<ul>";
    let i = 0;
    while (i < filelist.length) {
      list =
        list +
        `<li><a href="/data/images/${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list += "</ul>";
    return list;
  },
  img: function (filelist) {
    let list = "<ul>";
    let i = 0;
    while (i < filelist.length) {
      list =
        list +
        `<li><a href="/update?id=${filelist[i]}"><img src="/data/images/${filelist[i]}" style="width:100px;"></a></li>`;
      i = i + 1;
    }
    list += "</ul>";
    return list;
  },
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      //이미지 파일 경로
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, "public/data/images/");
    } else {
      //다른 파일 경로
      cb(null, "public/data/description/");
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// app.get("/", (req, res) => res.send("Hello World!"));
app.get("/", function (request, response) {
  let baseURL = "http://" + request.headers.host + "/";
  let myURL = new URL(request.url, baseURL);
  let pathname = myURL.pathname;
  let title = myURL.searchParams.get("id");

  if (!title) {
    fs.readdir(`public/data/images`, "utf8", function (error, filelist) {
      fs.readFile(
        `./data/images/${title}`,
        "utf8",
        function (err, description) {
          let html = `
            <!doctype html>
            <html>
            <head>
             <meta charset="utf-8">
            </head>
              <body>
                <a href="/create">create</a>
                ${list.file(filelist)}
                ${list.img(filelist)}
                
              </body>
            </html>
            `;
          response.send(html);
        }
      );
    });
  }
});

app.get("/create", function (request, response) {
  let html = `
  <!doctype html>
          <html>
          <head>
           <meta charset="utf-8">
          </head>
            <body>
            <form action="create_process" method="post" enctype="multipart/form-data">
            <p><input type="file" name="filetoupload"></p>
            <p><textarea id="description" name="description"></textarea>
            <input type="submit" value="submit">
          </form>
            </body>
          </html>
  `;

  response.send(html);
});

app.get("/post");

app.post(
  "/create_process",
  upload.single("filetoupload"),
  function (request, response, next) {
    let filename = request.file.filename;
    let _filename = `public/data/description/${filename.substring(
      0,
      filename.length - 4
    )}.txt`;
    console.log("filename : " + _filename);
    let description = request.body.description;
    fs.writeFile(_filename, description, function (error) {
      //제목, 내용,
      response.redirect("/");
    });
  }
);

app.get("/update", function (request, response) {
  let baseURL = "http://" + request.headers.host + "/";
  let myURL = new URL(request.url, baseURL);
  let pathname = myURL.pathname;
  let title = myURL.searchParams.get("id");

  fs.readFile(
    `public/data/description/${title.substring(0, title.length - 4)}.txt`,
    "utf8",
    function (err, description) {
      let html = `
         <!doctype html>
          <html>
          <head>
           <meta charset="utf-8">
          </head>
            <body>
              <a><img src="/data/images/${title}" style="width:100px;"></a>
              <a>delete</a>
              <form action="update_process" type="post">
                <p>
                  <textarea name="description" placeholder=${description}></textarea>
                </p>
                <input type=submit value="update">
              </form>
            </body>
          </html>
  `;
      response.send(html);
    }
  );
});

app.get('u')

app.listen(3000, () => console.log("HI port 3000"));
