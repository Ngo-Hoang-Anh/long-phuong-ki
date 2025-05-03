import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";
import store from './store'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import './i18n';
import { ThemeProvider } from './components/common/ThemeProvider';


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
        />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
)
