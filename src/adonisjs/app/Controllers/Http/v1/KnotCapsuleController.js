'use strict'

const fs = require('fs');

const DIR_AUTHOR = "../../../harena-space/author/"
const FILE_CAPSULE = "knot-capsule.html"
const DIR_CASES = "../../cases/";
const KNOT_DIR = "html/knots";


class KnotCapsuleController {
    async index({ response }) {
        try {
            console.log('fffffffffffff')

            // let models = fs.readdirSync(DIR_MODELS);
            // capsuleFile = open(NotebookDM.DIR_AUTHOR + NotebookDM.FILE_CAPSULE,
            //     "r", encoding="utf-8")
            let capsuleHTML = fs.readFileSync(DIR_AUTHOR + FILE_CAPSULE)

            // return capsuleHTML
            return response.json({ capsule: capsuleHTML })
        } catch (e) {
            console.log(e)
        }
    }

    async store({ request, auth, response }) {
        try {
            let caseName = request.input('caseName')
            let htmlName = request.input('htmlName')
            let knotHTML = request.input('knotHTML')

            let knot = DIR_CASES + caseName + KNOT_DIR
            fs.access(knot, fs.constants.F_OK, (err) => {
                if (err) fs.mkdirSync(knot, { recursive: true })

                let htmlFile = caseDir + htmlName;

                fs.writeFileSync(htmlFile, knotHTML)
            });

            return response.json({ status: 'ok' })
        } catch (e) {
            return response.status(e.status).json({ message: e.message })
        }
    }
}

module.exports = KnotCapsuleController
