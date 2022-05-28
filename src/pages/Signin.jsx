import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../components/generic/UserContext";

function Signin() {

  const { setShowAlert, setAlertType, registerUser } = useContext(UserContext);
  const redirect = useNavigate();

  function submitForm(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    if(registerUser(data)) {
      redirect("/login");    
    }
    else{
      setAlertType("signin");
      setShowAlert(true);
    }
    return; 

  }

  return (
    <div className="flex items-center mx-auto w-full min-h-screen p-6 bg-gray-50 dark:bg-zinc-900">
      <main className="flex w-96 mx-auto p-6 bg-white rounded-lg shadow-xl dark:bg-zinc-800 overflow-hidden">
        <div className="w-full">
          <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">Sign in</h1>
          <form className="mt-8 space-y-6" onSubmit={submitForm}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input id="username" name="username" type="username" placeholder="Username" required
                    className="relative block w-full px-3 py-2 border  border-gray-300 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-zinc-800 rounded-md focus:outline-none dark:focus:ring-gray-400 dark:focus:border-gray-400 focus:z-10 sm:text-sm"
                />
              </div>
            </div>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input id="email" name="email" type="email" placeholder="Email" required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                />
              </div>
            </div>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">Username</label>
                <input id="password" name="password" type="password" placeholder="Password" required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className={`mx-auto group relative w-48 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-orange-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                Create Account
              </button>
            </div>
            <hr className="my-8" />
            <p className="mt-4 text-center">
              <Link
                className="text-sm font-medium text-blue-600 dark:text-orange-400 hover:underline"
                to="/login"
              >
                Already have an account? Login
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Signin;