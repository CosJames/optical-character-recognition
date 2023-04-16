const fs = require("fs");
const Tesseract = require("node-tesseract-ocr");
const Jimp = require("jimp");
const imagePath = fs.readFileSync(__dirname + "/assets/example.png");

// Load the image using Jimp
Jimp.read(imagePath)
  .then((image) => {
    image
      .resize(900, Jimp.AUTO) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write("jimpified.jpg"); // save

    // Save the pre-processed image to a temporary file
    const tempImagePath = "jimpified.jpg";
    return image.writeAsync(tempImagePath);
  })
  .then(async (r) => {
    const imagePath = fs.readFileSync(__dirname + "/jimpified.jpg");

    const config = {
      lang: "eng",
      tessedit_char_whitelist: '0123456789PRN', // Specify the characters to whitelist for recognition
      //tessedit_ocr_engine_mode: 'OEM_TESSERACT_ONLY', // Set the OCR engine mode (if applicable)
      image: {
        buffer: imagePath,
      },
    };

    const result = await Tesseract.recognize(
      imagePath,
      config
    )

    console.log(result)
      // .then((text) => {
      //   console.log('OCR Result:', text);
      //   // Clean up recognized text by removing non-numeric characters
      //   const cleanedText = text.replace(/\D+/g, ''); // Clean up recognized text
      //   const pattern = /^PRN\s\d{9}$/; // Define expected pattern
      //   if (pattern.test(cleanedText)) {
      //     console.log('Image contains a postal ID');
      //   } else {
      //     console.log('Image does not contain a postal ID');
      //   }
      // })
      // .catch((error) => {
      //   console.log("ERROR");

      //   console.log(error.message);
      // });
  })
  .catch((error) => {
    console.error("Image Processing Error:", error);
  });

