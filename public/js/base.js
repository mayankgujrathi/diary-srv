const _util = {
  mov: (url) => {
    let path = ""
    if (window.location.pathname.endsWith(".html")) {
      const newpath = window.location.pathname.split("/")
      newpath.pop()
      path = newpath
    }
    window.location.assign(window.origin + path + url)
  },
  fbInit: () => {
    const firebaseConfig = {
      apiKey: "AIzaSyDUwcgIhB_kI2auyAtkBJDDKp4mVjHoiuQ",
      authDomain: "test-fc62d.firebaseapp.com",
      projectId: "test-fc62d",
      storageBucket: "test-fc62d.appspot.com",
      messagingSenderId: "184922411779",
      appId: "1:184922411779:web:c13e0d91bdf81761744f36",
    }
    firebase.initializeApp(firebaseConfig)
  },
}
