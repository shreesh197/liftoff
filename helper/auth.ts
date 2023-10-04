export const handleEmailAtAuth = (data: string) => {
  let modifiedString;
  modifiedString = data.split(" ");
  return `${modifiedString[0]}+${modifiedString[1]}`;
};

export const handleLogout = () => {
  if (typeof window !== "undefined") {
    window.localStorage.clear();
    window.location.href = `/login`;
  }
};
