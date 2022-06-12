document.addEventListener("DOMContentLoaded", (_) => {
  // const modal = document.querySelector(".mmodal")
  _util.fbInit()
  const side_panel = document.querySelector(".side-panel")
  const db = firebase.firestore()
  const currUEmail = document.querySelector("main").getAttribute("user-email")
  !(function (side_panel) {
    const events = []
    db.collection("remainder")
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          if (doc.id !== currUEmail) return
          const data = doc.data()
          const start = new Date(data.start.seconds * 1000)
          const end = new Date(data.end.seconds * 1000)
          events.push({
            id: `${start.getTime()}<${data.title}>`,
            title: data.title,
            start: start,
            end: end,
          })
        })

        const cal = new FullCalendar.Calendar(document.getElementById("cal"), {
          initialView: "dayGridMonth",
          headerToolbar: {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,list",
          },
          events: events,
        })
        cal.render()
        console.log(events)
        const now = new Date().toDateString()
        side_panel.querySelector(".date").innerHTML =
          now.substring(0, 3) + ", " + now.slice(3)
        document
          .querySelector("button[title='This month']")
          .addEventListener("click", (_) => {
            side_panel.querySelector(".date").innerHTML =
              now.substring(0, 3) + ", " + now.slice(3)
          })
        cal.on("dateClick", (info) => {
          const dateStr = info.date.toDateString()
          side_panel.querySelector(".date").innerHTML =
            dateStr.substring(0, 3) + ", " + dateStr.slice(3)
        })
      })
  })(side_panel)
  !(function (modal, side_panel) {
    const journal_e = document.querySelector(".journal .icon")
    journal_e.addEventListener("click", (e) => {
      modal.classList.toggle("show")
      modal.classList.toggle("as_journal")
      if (modal.querySelector("#journal_ed") === null) {
        modal.innerHTML += `
          <span class="close-modal" title="close">
            <i class="fa-solid fa-chevron-left"></i>
          </span>
          <span class="heading">${
            side_panel.querySelector(".date").innerHTML
          }'s Journal</span>
          <div class="journal_ed_wrap">
            <textarea id="journal_ed"></textarea>
          </div>`
        modal.querySelector(".close-modal").addEventListener("click", (_) => {
          modal.classList.remove("show")
          setTimeout(() => {
            modal.classList.remove("as_journal")
            modal.innerHTML = ""
          }, 300)
        })
        setTimeout(() => {
          const ed = new SimpleMDE({
            element: document.getElementById("journal_ed"),
            autofocus: true,
            forceSync: true,
            // toolbar: [
            //   {
            //     name: "save",
            //     action: () => {
            //       console.log("saving the text")
            //     },
            //     className: "fa-floppy-disk",
            //     title: "Save",
            //   },
            // ],
          })
        }, 300)
      }
    })
  })(document.querySelector(".journal-modal"), side_panel)
  !(function (modal, side_panel) {
    side_panel
      .querySelector(".remainders .icon")
      .addEventListener("click", (e) => {
        const date = side_panel.querySelector(".date").innerHTML
        if (!modal.classList.contains("as_add_remainder")) {
          modal.innerHTML += `
          <span class="close-modal" title="close">
            <i class="fa-solid fa-chevron-left"></i>
          </span>
          <span class="heading">Add Remainder</span>
          <p class="sub-heading">on ${date}</p>
          <div class="ins">
            <div class="ipt">
              <input type="text" id="txt-remainder" placeholder="Remainder..." />
              <i class="fa-solid fa-square-plus add-remainder-btn"></i>
            </div>
            <!-- <input type="text" id="txt-remainder" placeholder="Remainder..." /> -->
            <div class="datetime-input">
              <span>Start Date</span>
              <input type="date" id="start-date" />
              <input type="time" id="start-time" />
            </div>
            <div class="datetime-input">
              <span>End Date</span>
              <input type="date" id="end-date" />
              <input type="time" id="end-time" />
            </div>
          </div>
        `
          modal.classList.add("as_add_remainder")
          const txt = document.getElementById("txt-remainder")
          setTimeout(() => {
            txt.focus()
          }, 300)
        }
        modal.classList.toggle("show")
        if (!modal.classList.contains("show")) {
          setTimeout(() => {
            modal.classList.remove("as_add_remainder")
            modal.innerHTML = ""
          }, 300)
        }
        modal.querySelector(".close-modal").addEventListener("click", (_) => {
          modal.classList.remove("show")
          setTimeout(() => {
            modal.classList.remove("as_add_remainder")
            modal.innerHTML = ""
          }, 300)
        })
      })
  })(document.querySelector(".add_remainders-modal"), side_panel)
  !(function (modal, side_panel) {
    side_panel.querySelector(".todo .icon").addEventListener("click", (_) => {
      modal.classList.toggle("show")
      if (!modal.classList.contains("as_todo")) {
        const date = side_panel.querySelector(".date").innerHTML
        modal.innerHTML += `
          <span class="close-modal" title="close">
            <i class="fa-solid fa-chevron-left"></i>
          </span>
          <span class="heading">Add Todos</span>
          <p class="sub-heading">on ${date}</p>
          <div class="ins">
            <div class="ipt">
              <input type="text" id="add-todo" placeholder="add todo..." />
              <i class="fa-solid fa-square-plus add-todo-btn"></i>
            </div>
            <ul>
              <li>
                <span>Make Reviews</span>
                <span>
                  <i class="fa-solid fa-trash"></i>
                  <i class="fa-solid fa-square-pen"></i>
                </span>
              </li>
              <li>
                <span>record Meet Notes</span>
                <span>
                  <i class="fa-solid fa-trash"></i>
                  <i class="fa-solid fa-square-pen"></i>
                </span>
              </li>
            </ul>
          </div>
        `
        modal.classList.add("as_todo")
        setTimeout(() => {
          modal.querySelector("#add-todo").focus()
        }, 300)
      }
      if (!modal.classList.contains("show")) {
        setTimeout(() => {
          modal.classList.remove("as_todo")
          modal.innerHTML = ""
        }, 300)
      }
      modal.querySelector(".close-modal").addEventListener("click", (_) => {
        modal.classList.remove("show")
        setTimeout(() => {
          modal.classList.remove("as_todo")
          modal.innerHTML = ""
        }, 300)
      })
    })
  })(document.querySelector(".todo-modal"), side_panel)
})
