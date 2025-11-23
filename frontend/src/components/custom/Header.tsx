import { SignInButton, useAuth, UserButton, useUser } from '@clerk/clerk-react'
import logo from '../../assets/logo.png'
import { Button } from '../ui/button'
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserDetailsContext } from '../../../context/UserDetailsContext';
import { Diamond, Gem } from 'lucide-react';


export const Header=()=>{
    const MenuOptions=[
        {
            name:'Workspace',
            path:'/workspace'
        },
        {
            name:'Pricing',
            path:'/pricing'
        }
    ]
    const {user}=useUser();
    const location = useLocation();
    const { userDetail, setUserDetail } = useContext(UserDetailsContext) ?? {};
    // console.log(location.pathname);
    // console.log(userDetail?.credits)
    const {has}=useAuth();
    const hasUnlimitedAccess = has&&has({plan:'unlimited'})
    return (
        <div className='flex items-center justify-between px-10 shadow'>
            <Link to={'/'}>
                <img src={logo} alt='logo' width={80} height={80}></img>
            </Link>
            <ul className='flex gap-10'>
                {MenuOptions.map((menu,index)=>(
                    <Link to={menu.path} key={index}>
                        <Button>{menu.name}</Button>
                    </Link>
                ))}
            </ul>
            {!user?
                <SignInButton mode='modal'>
                    <Button>Get Started</Button>
                </SignInButton>
                :<div className='flex gap-5 items-center'>
                    <UserButton/>
                    {(location.pathname.includes('workspace') || location.pathname.includes('pricing')) &&
                        !hasUnlimitedAccess && <div className='flex gap-3 items-center p-2 px-3 bg-orange-100 rounded-full'>
                            <Gem/>{userDetail?.credits??0}
                        </div>
                    }
                </div>
            }
        </div>
    )
}