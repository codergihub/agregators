customElements.define('top-navigation', class extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {

    const { currentPage, auth } = window.pageStore.state


    this.render({ currentPage, auth })

 

    window.pageStore.subscribe(window.actionTypes.CONTENT_VIEW_CHANGED, state => {
      const { currentPage, auth } = state
      this.render({ currentPage, auth })
    })
  

    window.pageStore.subscribe(window.actionTypes.LOGOUT, state => {
      const { currentPage, auth } = state
      this.render({ currentPage, auth })
    })






  }

  render({  auth }) {
const pathname =window.location.pathname

    this.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Web Workflow</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link ${pathname === '/' && 'active'}" aria-current="page" href="/" id="home-page-link">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${pathname === '/workflow-list.html' && 'active'}" href="/workflow-list.html" id="project-list-link">Workflows</a>
              </li>
              <li class="nav-item">
              <a class="nav-link ${pathname === '/workflow-editor.html' && 'active'}" href="/workflow-editor.html" id="workflow-editor-link">Add Workflow</a>
            </li>
           
            <li class="nav-item">
            <a class="nav-link ${pathname === '/workflow-projects.html' && 'active'}" href="/workflow-projects.html" id="workflow-editor-link">Workflow Projects</a>
          </li>
          <li class="nav-item">
          <a class="nav-link ${pathname === '/workflow-project-editor.html' && 'active'}" href="/workflow-project-editor.html" id="workflow-editor-link">Add Workflow Project</a>
          
        </li>
        <li class="nav-item">
       
        <a class="nav-link ${pathname === '/workspace-name.html' && 'active'}" href="/workspace-name.html" id="workflow-editor-link">Create Workspace</a>
      </li>
      <li class="nav-item">
       
      <a class="nav-link ${pathname === '/workspaces-list.html' && 'active'}" href="/workspaces-list.html" id="workflow-editor-link">Workspaces</a>
    </li>
            </ul>
          
            <form class="d-flex">
            ${auth !== null ? ` <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            ${auth.email}
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
              <li><a class="dropdown-item" href="#">  ${auth.email}</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="/user-settings.html">Settings</a></li>
            </ul>
          </li>
            </ul>` : ''}    
              ${auth === null ? '<a class="btn btn-outline-success" href="/login.html?authed=false" id="login">Login</a>' : ''}
              ${auth !== null ? '<button class="btn btn-outline-success" id="logout-btn">Logout</button>' : ''}
            </form>
          </div>
        </div>
      </nav>`

    document.getElementById('login', (e) => {
      e.preventDefault()
      fetch('/login.html').then(response => {
        debugger;
        return response.json()
      }).then(data => {
        debugger;
      }).catch(error => {
        debugger;
      })
    })

    document.getElementById('home-page-link').addEventListener('click', (e) => {
      e.preventDefault()

      window.pageStore.dispatch({
        type: window.actionTypes.PAGE_NAVIGATED,
        payload: 'home'
      });
      window.location.replace("/");
    })
    // document.getElementById('project-list-link').addEventListener('click', (e) => {
    //   e.preventDefault()

    //   window.pageStore.dispatch({
    //     type: window.actionTypes.PAGE_NAVIGATED,
    //     payload: 'project-list'
    //   });
    //   window.location.replace("/project-list.html");
    // })

    // document.getElementById('add-project-template-link').addEventListener('click', (e) => {
    //   e.preventDefault()
    //   window.pageStore.dispatch({
    //     type: window.actionTypes.PAGE_NAVIGATED,
    //     payload: 'project-editor'
    //   });
    //   window.pageStore.dispatch({
    //     type: window.actionTypes.ADD_PROJECT_TEMPLATE,

    //   });
    //   window.location.replace("/project-editor.html");
    // })

    // document.getElementById('myprojects-btn').addEventListener('click', async (e) => {
    //   e.preventDefault()
 
    //       window.pageStore.dispatch({
    //         type: window.actionTypes.PAGE_NAVIGATED,
    //         payload: 'myprojects'
    //       });
    //       window.location.replace("/my-projects.html");
    // })
    document.getElementById('logout-btn') && document.getElementById('logout-btn').addEventListener('click', e => {
      e.preventDefault()

        window.pageStore.dispatch({
          type: window.actionTypes.LOGOUT,
          payload: null
        });
        window.location.replace("/");
    })
  }
})