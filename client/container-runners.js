customElements.define('container-runners', class extends HTMLElement{
    constructor(){
        super()
    }

  async  connectedCallback(){
        const resources = await import('./resources.js')
        await resources.default()

        const { workspace: { workspaceSelected }, auth: { idToken, localId: uid } } = window.pageStore.state
        this.uid = uid
        window.FB_DATABASE = window.firebase().setIdToken(idToken).setProjectUri(window.projectUrl)
        this.render({ workspaceSelected })
     
    }

    render({workspaceSelected}){
        document.getElementById('ws-breadcrumb').innerText = `Workspace(${workspaceSelected})`

        this.innerHTML = `<div>
        <h5>Container Runners:</h5>
    
        <div id="containers" class="row"></div>
        </div>`
        document.getElementById('containers').innerHTML = `Loading...`
        window.FB_DATABASE.ref(`workspaces/${workspaceSelected}/containers`).on('value', (error, response) => {
            const containers = Object.keys(response.data)
            document.getElementById('containers').innerHTML = ``
            debugger;
            containers.forEach(c => {
                document.getElementById('containers').insertAdjacentHTML('beforeend', `<runner-card title="${c}">${c}</runner-card>`)
            })
            window.pageStore.dispatch({ type: window.actionTypes.CONTAINERS_FETCHED, payload: containers })

        })
    }
})


customElements.define('runner-card', class extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const title = this.getAttribute('title')
 
        this.classList.add('col-3')
        this.innerHTML = `<div class="card" style="width: 18rem;">
        <div class="card-header d-flex justify-content-between">
        <a href="/runner-logs.html" class="card-link" id="a-${title}">Logs</a>
        <gear-icon title="${title}"></gear-icon>
      </div>
        <div class="card-body">
          <h5 class="card-title">Runner:</h5>
          <h6 class="card-subtitle mb-2 text-muted">${title}</h6>
       
        <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold">State</div>
          Running...
        </div>
        <span class="badge">
        <div class="spinner-grow text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        </span>
      </li>
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold">Started</div>
      10 minutes ago
    </div>
   
  </li>
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold">Comletes</div>
      in 2 minutes
    </div>

  </li>

  <li class="list-group-item d-flex justify-content-between align-items-start">
  <div class="ms-2 me-auto">
  <a href="#" class="card-link" id="run-container-btn-${title}">Run</a>
  <a href="#" class="card-link">Cancel</a>
</li>
</ul>
        </div>
      </div>`

      document.getElementById(`run-container-btn-${title}`).addEventListener('click',async(e)=>{
        e.preventDefault()
        const { auth: { token, screenName: owner,idToken ,email,localId,refreshToken},workspace:{workspaceSelected}} = window.pageStore.state
        const projectUrl=window.projectUrl
        const selectedContainer=title
        const parameters=`${token}--xxx--${owner}--xxx--${idToken}--xxx--${email}--xxx--${localId}--xxx--${refreshToken}--xxx--${selectedContainer}--xxx--${projectUrl}--xxx--${workspaceSelected}`
        debugger;
        const body = JSON.stringify({ ref: 'main', inputs: { projectName: title, parameters } })
     
        debugger;
       await triggerAction({ gh_action_url: `https://api.github.com/repos/${owner}/workflow_runner/actions/workflows/aggregate.yml/dispatches`, ticket: token, body })
    
    
      })

      document.getElementById(`a-${title}`).addEventListener('click',(e)=>{
        debugger;
    window.pageStore.dispatch({ type: window.actionTypes.WF_CONTAINER_SELECTED, payload: title })
})
   
    }
})


customElements.define('gear-icon', class extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const title=this.getAttribute('title')
        this.innerHTML=`
        <a class="btn btn-outline-secondary" href="/runner-settings.html" id="btn-${title}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
     
        </svg>
     Settings
        </a>
      `

        document.getElementById(`btn-${title}`).addEventListener('click',(e)=>{
                debugger;
            window.pageStore.dispatch({ type: window.actionTypes.WF_CONTAINER_SELECTED, payload: title })

        })

    }
})





async function triggerAction({ ticket, body, gh_action_url }) {
  debugger;

  try {
    const response =await fetch(gh_action_url, {
      method: 'post',
      headers: {
          authorization: `token ${ticket}`,
          Accept: 'application/vnd.github.v3+json'
      },
      body
  })
  const data =await response.json()
  } catch (error) {
    debugger;
  }
 
}