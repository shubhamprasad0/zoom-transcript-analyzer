import { useState, useEffect } from "react";
import { CookieValueTypes, getCookie } from "cookies-next";

const useCookie = (name: string) => {
  const [cookie, setCookie] = useState<CookieValueTypes>("");

  useEffect(() => {
    const cookieValue = getCookie(name);
    if (cookieValue) {
      setCookie(cookieValue);
    }
  }, [name]);

  return cookie;
};

export default useCookie;
