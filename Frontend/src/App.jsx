// import React from 'react'
// import Siginup from './Components/Auth/Signup'
// import SignIn from './Components/Auth/siginin'
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Dashborde from './Components/Auth/pages/Dashborde'
// import SendMoney from './Components/Auth/pages/SendMoney'

// export default function App() {
//   return (
//     <>
//       <BrowserRouter >
//         <Routes>
//           <Route path="/Siginup" element={<Siginup />} />
//           <Route path="/siginin" element={<SignIn />} />
//           <Route path="/dashbord" element={<Dashborde />} />
//           <Route path="/send" element={<SendMoney/>} />
//         </Routes>
//       </BrowserRouter>
//     </>

//   )
// }
import React from 'react'
import { useState } from 'react'

function App() {
  const [value, setValue] = useState('')
  const [inputvalue, setInputvalue] = useState('')
  const paragraf = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus dolore natus, suscipit quisquam possimus animi voluptas, optio nesciunt blanditiis'
  const handalClick = () => {
    const words = paragraf.split(' ');
    const newData = words.slice(0, inputvalue).join(' ');
    setValue(newData)
  }

  return (
    <>
      <div className="text-white  h-screen w-full p-20">
        <div className="flex h-10 w-1/3 items-center justify-center gap-10">
          <input onChange={(e) => setInputvalue(e.target.value)} className='text-black p-2 rounded-lg' type="number" />
          <button onClick={handalClick} className='bg-green-500 p-2 rounded-lg active:scale-90'>Generate</button>
        </div>
        <div className="mt-10">{value}</div>
      </div>
    </>
  )
}

export default App
  