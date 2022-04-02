import React from "react";
import "./index.css";
import { useAuth0 } from "@auth0/auth0-react";
const Admin = () => {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
    return <div>
        <div>
            {isAuthenticated && (<button className="login-out-btn" onClick={() => logout()}>logout</button>)}
            {!isAuthenticated && (<button className="login-out-btn" onClick={() => loginWithRedirect()}>Login</button>)}
        </div>
        <br></br>
        {isAuthenticated && (<div>
            Admin Form
        </div>
        )}
    </div>
}

export default Admin;