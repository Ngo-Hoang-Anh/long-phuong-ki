import React from 'react'
import { Link } from "react-router-dom"
function Page404() {
    return (
        <div className="error-container">
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for might be under construction or doesn't exist.</p>
            <Link href="/">Go back to the homepage</Link>
        </div>
    )
}

export default Page404