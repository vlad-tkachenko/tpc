import 'bootstrap/dist/css/bootstrap.min.css';

import ThemeProvider from "react-bootstrap/ThemeProvider";
import { Layout } from "./layout";
import { NavProvider } from './nav';
import { Content } from './content';
import { ToastsProvider } from './components/Toasts';

export default function App() {
  return (
    <ThemeProvider>
      <ToastsProvider>
        <NavProvider>
          <Layout>
            <Content />
          </Layout>
        </NavProvider>
      </ToastsProvider>
    </ThemeProvider>
  )
}