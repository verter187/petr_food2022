"use strict";

//tabs
window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".tabheader__items"),
    tabs = document.querySelectorAll(".tabcontent"),
    btns = [...document.querySelectorAll(".tabheader__item")],
    activeBtnClassName = "tabheader__item_active";

  const hideAllTabs = (tabs) =>
    tabs.forEach((tab) => {
      tab.classList.add("hide");
      tab.classList.remove("fade");
    });

  const makeAllButtonsInactive = (btns, activeBtnClassName) =>
    btns.forEach((btn) => btn.classList.remove(activeBtnClassName));

  const getActiveButton = (btns, activeBtnClassName) =>
    btns.filter((btn) => btn.classList.contains(activeBtnClassName))[0];

  const showCurrentTab = (btn, btns, tabs) => {
    let curBtnIdx = btns.indexOf(btn);
    tabs[curBtnIdx].classList.add("fade");
    tabs[curBtnIdx].classList.remove("hide");
  };

  const setButtonActive = (curBtn, activeBtnClassName) =>
    curBtn.classList.add(activeBtnClassName);

  const setEventToButtons = (wrapper, tabs, btns, activeBtnClassName) => {
    wrapper.addEventListener("click", (e) => {
      if (e.target && e.target.classList.contains("tabheader__item")) {
        showMenu(e.target, tabs, btns, activeBtnClassName);
      }
    });
  };

  function showMenu(curBtn, tabs, btns, activeBtnClassName) {
    hideAllTabs(tabs);
    showCurrentTab(curBtn, btns, tabs);

    makeAllButtonsInactive(btns, activeBtnClassName);
    setButtonActive(curBtn, activeBtnClassName);
  }

  setEventToButtons(wrapper, tabs, btns, activeBtnClassName);
  const curBtn = getActiveButton(btns, activeBtnClassName);
  showMenu(curBtn, tabs, btns, activeBtnClassName);

  //timer
  let deadLine = new Date(2023, 0, 1),
    second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

  const flr = (num) => Math.floor(num),
    prs = (num) => Date.parse(num),
    getDateDifference = (date1, date2) => prs(date1) - prs(date2),
    getDays = (numMs) => flr(numMs / day),
    getHours = (numMs) => flr((numMs / hour) % 24),
    getMinuts = (numMs) => flr((numMs / minute) % 60),
    getSecund = (numMs) => flr((numMs / second) % 60),
    getZero = (num) => (num < 10 ? "0" + num : num);

  const getTimeRemaining = (endTime) => {
    const numMs = getDateDifference(endTime, new Date());
    return {
      total: numMs,
      days: getDays(numMs),
      hours: getHours(numMs),
      minutes: getMinuts(numMs),
      seconds: getSecund(numMs),
    };
  };

  function setClock(selector, endTime) {
    const timer = document.querySelector(selector),
      timerObj = {
        days: timer.querySelector("#days"),
        hours: timer.querySelector("#hours"),
        minutes: timer.querySelector("#minutes"),
        seconds: timer.querySelector("#seconds"),
      };
    const timeInterval = setInterval(updateClock, 1000);
    updateClock();

    function updateClock() {
      const timeObj = getTimeRemaining(endTime);

      for (let key in timerObj) {
        timerObj[key].innerHTML = getZero(timeObj[key]);
      }

      if (timeObj.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(".timer", deadLine);

  //modal window

  const modalTrigger = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal"),
    modalCloseBtn = document.querySelectorAll("[data-close]");

  const toggleModal = (overflow = "") => {
    modal.classList.toggle("hide");
    document.body.style.overflow = overflow;
    clearInterval(modalTimerId);
  };

  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleModal("hide");
    });
  });
  modalCloseBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleModal();
    });
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      toggleModal();
    }
  });

  document.addEventListener(
    "keydown",
    function (e) {
      if (
        (e.key == "Escape" || e.key == "Esc" || e.keyCode == 27) &&
        !modal.classList.contains("hide")
      ) {
        toggleModal();
      }
    },
    true
  );

  const showModalByScroll = (e) => {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      toggleModal("hide");
      window.removeEventListener("scroll", showModalByScroll);
    }
  };
  window.addEventListener("scroll", showModalByScroll);

  const modalTimerId = setTimeout(() => toggleModal("hide"), 5000);
});
