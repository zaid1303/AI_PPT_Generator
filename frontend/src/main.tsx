import { StrictMode, useState } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.tsx'
  import { ClerkProvider } from '@clerk/clerk-react'
  import {UserDetailsContext, UserDetailsProvider} from '../context/UserDetailsContext.tsx'
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!PUBLISHABLE_KEY) {
    throw new Error('Add your Clerk Publishable Key to the .env file')
  }

  function Root(){
    const [userDetail,setUserDetail]=useState();
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <UserDetailsProvider>
          <App />
        </UserDetailsProvider>
      </ClerkProvider>
    )
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Root/>
    </StrictMode>,
  )