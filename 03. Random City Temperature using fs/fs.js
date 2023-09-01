const fs = require("fs");

// Reading a file
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("File contents:", data);
});

// Writing to a file
const content = "Written text";
fs.writeFile("file.txt", content, "utf8", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("File written!");
});

// Appending to a file
const additionalContent = "\nThis is additional text";
fs.appendFile("file.txt", additionalContent, "utf8", (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Content appended");
});

// Deleting a file
fs.unlink("file.txt", (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("File deleted!");
});
