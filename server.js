const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;
const {readFile, writeFile} = require("fs/promises");
const getNotes = () => {
    return readFile("db/db.json", "utf8").then(notes => [].concat(JSON.parse(notes)))
}
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})
app.get("/api/notes", (req, res) => {
    console.log("hit api route");
    getNotes().then(notes => res.json(notes)).catch(err => res.json(err))
}) 
app.post("/api/notes", (req, res) => {
    getNotes().then(oldNotes => {
        let newNote = {
            text: req.body.text, title: req.body.title, id: Math.floor(Math.random()*10000).toString()
        }
        let newArray = [...oldNotes, newNote]
        writeFile("db/db.json", JSON.stringify(newArray)).then(() => res.json({
            msg: "okay"
        }))
    }).catch(err => res.json(err))
})
app.delete("/api/notes/:id", (req, res) => {
    getNotes().then(unfilteredNotes => {
        let filteredNotes = unfilteredNotes.filter(notes => notes.id !== req.params.id)
        writeFile("db/db.json", JSON.stringify(filteredNotes)).then(() => res.json({
            msg: "okay"
        }))
    })
})
app.listen(PORT, () => console.log(`http://localhost:${PORT}`) );
