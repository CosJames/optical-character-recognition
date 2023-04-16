const fs = require("fs");
const path = require("path");
const Tesseract = require("node-tesseract-ocr");
const Jimp = require("jimp");
const imagePath = fs.readFileSync(__dirname + "/assets/example.png");

// Load the image using Jimp
Jimp.read(imagePath)
  .then((image) => {
    image
      .resize(950, Jimp.AUTO) // resize
      .quality(100) // set JPEG quality
      .greyscale() // set greyscale
      .write("jimpified.jpg"); // save

    // Save the pre-processed image to a temporary file
    const tempImagePath = "jimpified.jpg";
    return image.writeAsync(tempImagePath);
  })
  .then((r) => {
    const imagePath = fs.readFileSync(__dirname + "/jimpified.jpg");

    const config = {
      lang: "eng",
      oem: 3,
      psm: 3,
    };

    Tesseract.recognize(
      imagePath,
      config
    )
      .then((text) => {
        console.log(text);
        // console.log("Result:", text);
        // console.log('Extracted Text:', text);

        // Extract the PNR using pattern matching
        const regex = /PRN\s+(\d+)/; // Assumes PRN is followed by whitespace and then a sequence of digits
        const prnMatch = text.match(regex);
        const prn = prnMatch ? prnMatch[0] : null;
        console.log("Extracted PRN:", prn);
      })
      .catch((error) => {
        console.log("ERROR");

        console.log(error.message);
      });
  })
  .catch((error) => {
    console.error("Image Processing Error:", error);
  });

