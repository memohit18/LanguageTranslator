const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

const CREDENTAILS = JSON.parse(process.env.CREDENTAILS)

const translate = new Translate({
    credentials: CREDENTAILS,
    projectId: CREDENTAILS.project_id
})

const getTranslation = async (req, res) => {

    let { text , targetlanguage } = req.query;
    //default is French as task required English to French Only
    targetlanguage ? targetlanguage : targetlanguage = "fr";

    try {

        //Checking the input language type
        let checkLang = await translate.detect(text)

        //Checking if the request language is english then only we will procced
        if(checkLang?.[0]?.language == 'en'){

            if (!text) {
                return res.status(400).json({ message: 'Missing or incorrect query parameter: text' });
            }
    
            const translated = await translate.translate(text, { to: targetlanguage });
    
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
