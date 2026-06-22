const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");
const { extractTextFromPDF } = require("../services/pdfService");
const { saveHistory } = require("../services/historyService");


router.post("/analyze", authenticate, upload.single("file"), async (req, res, next) => {
  try {
    let caseText;
    let inputType = "text";

    if (req.file) {
      caseText = await extractTextFromPDF(req.file.buffer);
      inputType = "pdf";
    } else if (req.body && req.body.text) {
      caseText = req.body.text;
    } else {
      return res.status(400).json({
        error: "Please provide either a PDF file or case text.",
      });
    }


    if (caseText.length < 50) {
      return res.status(400).json({ error: "Case description is too short (min 50 chars)." });
    }
    const analysis = {
      summary: "This is a mock AI response.",
      legalReasoning: "We successfully extracted your text! Now we need to build the Python RAG service to process it.",
      extractedTextPreview: caseText.substring(0, 150) + "..."
    };

    try {
      await saveHistory({
        userId: req.user.id,
        caseText,
        inputType,
        analysis,
      });
    } catch (historyError) {
      console.warn("Failed to save history:", historyError.message);
    }

    res.json(analysis);

  } catch (err) {
    next(err); 
  }
});

module.exports = router;