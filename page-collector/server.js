

require('dotenv').config()
const { crawler } = require('./crawler')


if (process.env.SERVER === 'LOCAL_SERVER') {
  const { renewIdToken } = require('../utils/firebase/firebase-rest')
  const { crawlerWorker } = require('./crawlerWorker')
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    let data = [];

    switch (req.method) {
      case "OPTIONS":
        res.statusCode = 200
        res.end();
        break;
      case "POST":

        req.on("data", (chunk) => {
          data.push(chunk);
        });
        req.on("end", async () => {
          if (data.length > 0) {
            const body = JSON.parse(data);
            const { inputs: { projectName, parameters } } = body
            const splitterParams = parameters.split('--splitter--')

            const fb_refresh_token = splitterParams[1]
            const api_key = splitterParams[3]
            const renewedData = await renewIdToken({ api_key, refresh_token: fb_refresh_token })
debugger;
            crawlerWorker({ fb_run_id: splitterParams[0], fb_uid: splitterParams[2], fb_id_token: renewedData.id_token, projectName, email: splitterParams[4], fb_database_url: splitterParams[5] })
          }
        });
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/plain');
        res.end('local workflow triggered')
        break;
      default:
        res.setHeader('Content-Type', 'text/plain');
        res.end('Unhandled method')
    }


  })
  server.listen(3001, () => {
    console.log(`LOCAL workflow server running on port ${3001}`);
  });

} else if (process.env.SERVER === 'LOCAL') {

  (async () => {
    require('dotenv').config()
    const { renewIdToken } = require('../utils/firebase/firebase-rest')
    const renewedData = await renewIdToken({ api_key: process.env.api_key, refresh_token: process.env.fb_refresh_token })
    debugger;
    global.fb_database_url = process.env.fb_database_url
    global.fb_run_id = Date.now()
    global.fb_uid = process.env.uid
    global.fb_id_token = renewedData.id_token
    process.env.projectName = 'books'
    process.env.email = "tkm.house.new@gmail.com"
    crawler()
  })()


} else {
  (async () => {
    const { renewIdToken, fbRest } = require('../utils/firebase/firebase-rest')
    const { crawlerWorker } = require('./crawlerWorker')
    const parameters = process.env.parameters


    const splitterParams = parameters.split('--splitter--')

    const fb_refresh_token = splitterParams[1]
    const api_key = splitterParams[3]
    const fb_uid= splitterParams[2]

    const projectName = process.env.projectName
    const renewedData = await renewIdToken({ api_key, refresh_token: fb_refresh_token })

    const fbDatabase = fbRest().setIdToken(renewedData.id_token).setProjectUri(splitterParams[5])

    const myProjectRef = `myprojects/${fb_uid}/${process.env.projectName}/LIVE`
    fbDatabase.ref(myProjectRef).set(true, (error) => {
      if (error) {
        console.log('error', error)
      } else {
        console.log('crawlerWorker 1')
        console.log('splitterParams....',splitterParams)
        console.log('projectName',projectName)
      //  crawlerWorker({ fb_run_id: splitterParams[0], fb_uid: splitterParams[2], fb_id_token: renewedData.id_token, projectName, email: splitterParams[4], fb_database_url: splitterParams[5] })
        setInterval(() => {
          console.log('...')
        }, 5000);

        const rootFirebaseRef = `runs/${global.fb_uid}/${process.env.projectName}`

        fbDatabase.ref(rootFirebaseRef).on('value', async (error, e) => {
          const { data, path } = JSON.parse(e.data)
          console.log('second...try',data, path)
          if (path !== '/') {
            debugger;
            console.log('value triggered')
            const fb_run_id = data['RUN_STARTED']
            const RUN_COMPLETE = data['RUN_COMPLETE']
            if (fb_run_id && !RUN_COMPLETE) {
              console.log('crawlerWorker 2')
              console.log('splitterParams....',splitterParams)
              console.log('projectName',projectName)
              console.log('fb_run_id...', fb_run_id);
              console.log('run_complete...', RUN_COMPLETE);
              let renewData = await renewIdToken({ api_key, refresh_token: fb_refresh_token })
             // crawlerWorker({ fb_run_id, fb_uid: splitterParams[2], fb_id_token: renewData.id_token, projectName, email: splitterParams[4], fb_database_url: splitterParams[5] })
            }
    
          }
    
        })

      }
    })



  })()

}


module.exports = { crawler }