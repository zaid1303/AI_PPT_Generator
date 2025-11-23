import {BrowserRouter,Routes, Route} from "react-router-dom";
import { Button } from './components/ui/button'
import { Dashboard } from "./pages/Dashboard";
import { WorkSpace } from "./pages/WorkSpace";
import { Outline } from "./pages/Outline";
import { Editor } from "./pages/Editor";
import { Pricing } from "./pages/Pricing";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path="/workspace" element={<WorkSpace/>}></Route>
          <Route path="/workspace/project/:id/outline" element={<Outline/>}></Route>
          <Route path="/workspace/project/:id/editor" element={<Editor/>}></Route>
          <Route path="/pricing" element={<Pricing/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
