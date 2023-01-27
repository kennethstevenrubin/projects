(async ()=>{

    try {

        const File = require('./modules/File');

        const COVID19 = require('./modules/COVID19');
        const covid19 = new COVID19();
        
        const express = require('express');
        const app = express();
        const port = process.env.PORT || 80;

        app.use(express.json());

        // Covid
        app.get('/data', async (req, res) => {

            const result = await covid19.load();
            res.json(result);
        });

        // Homepage
        app.post("/hierarchy", (req, res) => {

            const hierarchyFile = new File("./input/hierarchy.json");
            const hierarchyData = hierarchyFile.read();
            const hierarchy = JSON.parse(hierarchyData);
            res.json(hierarchy);
        });
        app.post("/save", (req, res) => {

            const hierarchyFile = new File("./input/hierarchy.json");
            hierarchyFile.write(JSON.stringify(req.body, null, 2));
            res.json({ result: "success" });
        });

        app.use(express.static(require('path').join(__dirname,
            'public')));
        app.listen(port, () => {

            console.log(`Listening on: ${port}!`);
        });
    } catch (x) {

        console.log(`?Error: ${x.message}!`);
    }
})();
