import '../styles/globals.css'

//INTRNAL IMPORT
import { ToDoListProvider } from '../context/ToDoListApp'

const MyApp = ({ Component, pageProps }) => {
  return (
    <ToDoListProvider>
      <div>
        <Component {...pageProps} />
      </div>
    </ToDoListProvider>
  )
}

export default MyApp
