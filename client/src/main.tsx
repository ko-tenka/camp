import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { UserAppContext } from './context/userContext.tsx'
import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux';
import { store } from './redux/store.ts';


ReactDOM.createRoot(document.getElementById('root')!).render(
   <Provider store={store}>  
    <BrowserRouter>
      <UserAppContext>
        <App />
      </UserAppContext>
  </BrowserRouter>
  </Provider>

)
