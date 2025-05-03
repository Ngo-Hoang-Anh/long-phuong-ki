import { useRef } from 'react'

function TabLogin() {
    let loginRef = useRef()
    let createAccountRef = useRef()
    const changeTab = (ref) => {
        if (ref.getAttribute("data-tab") == "login") {
            document.getElementById("form-body").classList.remove('active');
            ref.parentNode.classList.remove('signup');
        } else {
            document.getElementById("form-body").classList.add('active');
            ref.parentNode.classList.add('signup');
        }
    }
    return (
        <div className="head">
            <div ref={loginRef} className="login-tab" onClick={() => changeTab(loginRef.current)}>
                Login
            </div>
            <div ref={createAccountRef} className="signup-tab" onClick={() => changeTab(createAccountRef.current)}>
                Create account
            </div>
        </div>
    )
}

export default TabLogin