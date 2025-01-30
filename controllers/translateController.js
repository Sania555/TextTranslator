const Translation = require("../models/Translation");

const dictionary = {
  "hello": "bonjour",
  "world": "monde",
  "good": "bon",
  "morning": "matin",
  "thank you": "merci",
  "goodbye": "au revoir",
  "please": "s'il vous plaît",
  "yes": "oui",
  "no": "non",
  "how": "comment",
  "are": "ça",
  "you": " va",
  "my name is sania": "mon nom est Sania"
};

exports.translateText = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const { text } = req.body;
    const userId = req.user.userId;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    console.log("Received text:", text);

    const lowerText = text.toLowerCase().trim();

    let translatedText = dictionary[lowerText];

    if (!translatedText) {
      const words = lowerText.split(" ");
      const translatedWords = words.map(word => dictionary[word] || word);
      translatedText = translatedWords.join(" ");
    }

    console.log("Translated text:", translatedText);

    const newTranslation = new Translation({ userId, originalText: text, translatedText });
    await newTranslation.save();

    res.json({ translatedText });
  } catch (error) {
    console.error("Translation Error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const userId = req.user.userId;
    const history = await Translation.find({ userId }).sort({ createdAt: -1 }).limit(10);

    res.json(history);
  } catch (error) {
    console.error("History Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};
