document.addEventListener("DOMContentLoaded", (_) => {
  // const modal = document.querySelector(".mmodal")
  _util.fbInit()
  const side_panel = document.querySelector(".side-panel")
  const db = firebase.firestore()
  const currUEmail = document.querySelector("main").getAttribute("user-email")
  const updateSidePanel = () => {
    db.collection(`journal/${currUEmail}/journal`)
      .get()
      .then((snap) => {
        const p = side_panel.querySelector(".journal p")
        p.innerHTML = `<p id="no-journal">to add new journal, click on pen icon...</p>`
        p.id = "no-journal"
        snap.forEach((doc) => {
          const data = doc.data()
          const date = new Date(data.date.seconds * 1000)
          setTimeout(() => {
            if (
              doc.id ==
              document
                .querySelector(".side-panel .date")
                .innerHTML.replace(", ", "")
                .trim()
            ) {
              p.innerHTML = data.body
              p.id = ""
            }
          }, 200)
        })
      })
    setTimeout(() => {
      const sdate =
        document
          .querySelector(".side-panel .date")
          .innerHTML.replace(", ", "")
          .trim() || new Date().toDateString()
      console.log()
      db.collection(`todo/${currUEmail}/${sdate}`)
        .get()
        .then((snap) => {
          const todo = side_panel.querySelectorAll(".todo ul")
          // todo[0].innerHTML =
          todo[0].innerHTML = `<span style="color: #999">to add todo, click on plus icon...</span>`
          todo[1].innerHTML = `<span style="color: #999;">no todos completed...</span>`
          let todos = []
          snap.forEach((doc) =>
            todos.push({
              id: doc.id,
              data: doc.data(),
            })
          )
          console.log(todos)
          // todos = todos.filter((doc) => doc.id == s)
          const template = (doc) => `
            <li>
              <input type="checkbox" ${
                doc.data.completed ? "checked" : ""
              } id="${doc.id + doc.data.body}" data="${doc.data.body}" />
            <label for="${doc.id + doc.data.body}" data="${doc.data.body}">${
            doc.data.body
          }</label>
            <div style="float: right;">
              <i class="fa-solid fa-trash todo-delete-btn" data="${doc.id}"></i>
            </div>
            </li>
            `
          const undone = todos
            .filter((doc) => doc.data.completed == false)
            .map(template)
          const done = todos
            .filter((doc) => doc.data.completed == true)
            .map(template)
          if (undone.length > 0) todo[0].innerHTML = undone
          if (done.length > 0) todo[1].innerHTML = done
          document.querySelectorAll(".todo-delete-btn").forEach((el) => {
            el.addEventListener("click", (e) => {
              if (!confirm("Do you want to delete?")) {
                return
              }
              const id = e.target.getAttribute("data")
              db.collection(`todo/${currUEmail}/${sdate}`)
                .doc(id)
                .delete()
                .then(() => {
                  window.location.reload()
                })
            })
          })
          todos.forEach((doc) => {
            document
              .getElementById(doc.id + doc.data.body)
              .addEventListener("change", (e) => {
                const state = e.target.checked
                db.collection(`todo/${currUEmail}/${sdate}`)
                  .doc(doc.id)
                  .set({
                    completed: state,
                    last_modified_date: new Date(),
                    body: document
                      .getElementById(doc.id + doc.data.body)
                      .getAttribute("data"),
                  })
                  .then(() => {
                    window.location.reload()
                  })
              })
          })
        })
    }, 300)
  }
  setTimeout(() => {
    updateSidePanel()
  }, 300)
  !(function (side_panel) {
    const events = []
    db.collection(`remainder/${currUEmail}/remainders`)
      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          const data = doc.data()
          const start = new Date(data.start.seconds * 1000)
          let end = null
          if (data.end) end = new Date(data.end.seconds * 1000)
          const id = `${start.getTime()}<${data.title}>`
          events.push(
            end
              ? { id, title: data.title, start, end }
              : { id, title: data.title, start, end }
          )
          const cal = new FullCalendar.Calendar(
            document.getElementById("cal"),
            {
              initialView: "dayGridMonth",
              headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,list",
              },
              events: events,
            }
          )
          cal.render()
          const sorted_events = events
            .map((e) => {
              return { t: e.start.getTime(), data: e }
            })
            .filter((e) => e.t > Date.now())
            .sort((a, b) => {
              if (Date.now() > a.t && Date.now() > b.t) {
                return a.t < b.t
              }
              return false
            })
          const rem = document.querySelector(".remainders table")
          rem.innerHTML = ""
          rem.innerHTML = sorted_events
            .map((e) => {
              return `
                <tr>
                  <td>
                    ${e.data.start.toDateString().split(" ")[1]} <br />
                    ${
                      e.data.start.getDate() < 10
                        ? "0" + e.data.start.getDate()
                        : e.data.start.getDate()
                    }
                  </td>
                  <td>${e.data.title}</td>
                </tr>
              `
            })
            .slice(0, 4)
            .join("")
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
            updateSidePanel()
          })
        })
      })
    if (!document.getElementById("cal").innerHTML) {
      const cal = new FullCalendar.Calendar(document.getElementById("cal"), {
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,list",
        },
      })
      cal.render()
    }
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
          </div>
          <button class="save"><i class="fa-solid fa-floppy-disk"></i><span>Save</span></button>`
        modal.querySelector(".close-modal").addEventListener("click", (_) => {
          modal.classList.remove("show")
          setTimeout(() => {
            modal.classList.remove("as_journal")
            modal.innerHTML = ""
          }, 300)
        })
        const p = side_panel.querySelector(".journal p")
        let value = ""
        if (p.getAttribute("id") !== "no-journal") {
          value = p.innerHTML
        }
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
          ed.value(value)
          modal.querySelector(".save").addEventListener("click", (e) => {
            const body = ed.value().trim()
            const last_mod_date = new Date()
            const date = new Date(
              document.querySelector(".side-panel .date").innerHTML
            ).toDateString()
            db.collection(`journal/${currUEmail}/journal`)
              .doc(date)
              .set({
                body,
                last_modified_date: last_mod_date,
                date: date,
              })
              .then(() => {
                modal.classList.remove("show")
                window.location.reload()
              })
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
              <input type="text" id="txt-remainder" placeholder="Remainder..." required />
              <i class="fa-solid fa-square-plus" id="add-remainder-btn"></i>
            </div>
            <!-- <input type="text" id="txt-remainder" placeholder="Remainder..." /> -->
            <div class="datetime-input">
              <span>Start Date</span>
              <input type="date" id="start-date" required />
              <input type="time" id="start-time" required />
            </div>
            <div class="datetime-input">
              <span>End Date</span>
              <input type="date" id="end-date" required />
              <input type="time" id="end-time" required />
            </div>
          </div>
        `
          modal.classList.add("as_add_remainder")
          modal.classList.toggle("show")
          const txt = document.getElementById("txt-remainder")
          setTimeout(() => {
            txt.focus()
          }, 300)
          document
            .getElementById("add-remainder-btn")
            .addEventListener("click", (e) => {
              const title = document.getElementById("txt-remainder").value
              const start_date = document.getElementById("start-date").value
              const start_time = document.getElementById("start-time").value
              const end_date = document.getElementById("end-date").value
              const end_time = document.getElementById("end-time").value
              if (title == "" || start_date == "" || start_time == "") {
                alert("Please fill the details!")
                return
              }
              const start = new Date(`${start_date}:${start_time}`)
              let end = null
              if (end_date != "" || end_time != "")
                end = new Date(`${end_date} ${end_time}`)
              db.collection(`remainder/${currUEmail}/remainders`)
                .add(end ? { title, start, end } : { title, start })
                .then(() => {
                  modal.classList.remove("show")
                  setTimeout(() => {
                    modal.classList.remove("as_add_remainder")
                    modal.innerHTML = ""
                  }, 300)
                  window.location.reload()
                })
            })
        }
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
        const date = side_panel
          .querySelector(".date")
          .innerHTML.replace(", ", "")
          .trim()
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
          </div>
        `
        modal.classList.add("as_todo")
        modal.querySelector(".add-todo-btn").addEventListener("click", (e) => {
          const txt = document.getElementById("add-todo").value
          if (txt == "") {
            alert("Please fill details")
            return
          }
          db.collection(`todo/${currUEmail}/${date}`)
            .add({
              body: txt,
              completed: false,
              last_modified_date: new Date(),
            })
            .then(() => {
              modal.classList.remove("show")
              window.location.reload()
            })
        })
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
