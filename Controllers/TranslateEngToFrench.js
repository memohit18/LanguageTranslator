const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

const CREDENTAILS = JSON.parse(process.env.CREDENTAILS)

const translate = new Translate({
    credentials: CREDENTAILS,
    projectId: CREDENTAILS.project_id
})

const getTranslation = async (req, res) => {
    const { text } = req.query;
    const targetLanguage = "fr";

    try {

        let checkLang = await translate.detect(text)

        if(checkLang?.[0]?.language == 'en'){
            if (!text) {
                return res.status(400).json({ message: 'Missing or incorrect query parameter: text' });
            }
    
            const translated = await translate.translate(text, { to: targetLanguage });
    
            if(translated?.[0]){
                res.send({
                    "translation": translated[0]
                })
            }else {
                res.status(404).send({ message: 'No translation exists' });
            } 
        }else{
            // For Invalid Requests
            res.status(400).send({message: "Input Value is not English"})
        }

    } catch (error) {
        console.error('Translation error:', error.message);
        res.status(500).send({ message: 'Internal server error', error: error.message });
    }
};

module.exports = { getTranslation };
