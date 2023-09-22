import React from 'react';
import Cookies from 'js-cookie';
import { TERipple } from 'tw-elements-react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  let navigate = useNavigate('')

  const removeCookies = () => {
    Cookies.remove('role');
    Cookies.remove('token');
    Cookies.remove('_id');
    navigate('/')
  };

  return (
    <div className="text-center mt-5">
      <TERipple rippleColor="light">
        <button
          type="button"
          onClick={removeCookies}
          className="relative rounded bg-primary px-1.5 py-1 text-sm font-medium text-white "
        >
          LOGOUT
        </button>
      </TERipple>
    </div>
  );
}
