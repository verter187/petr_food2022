"use strict";

window.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".tabheader__items"),
    tabs = document.querySelectorAll(".tabcontent"),
    btns = [...document.querySelectorAll(".tabheader__item")],
    activeBtnClassName = "tabheader__item_active";

  const hideAllTabs = (tabs) =>
    tabs.forEach((tab) => {
      tab.classList.add("hidden");
      tab.classList.remove("fade");
    });

  const makeAllButtonsInactive = (btns, activeBtnClassName) =>
    btns.forEach((btn) => btn.classList.remove(activeBtnClassName));

  const getActiveButton = (btns, activeBtnClassName) =>
    btns.filter((btn) => btn.classList.contains(activeBtnClassName))[0];

  const showCurrentTab = (btn, btns, tabs) => {
    let curBtnIdx = btns.indexOf(btn);
    tabs[curBtnIdx].classList.add("fade");
    tabs[curBtnIdx].classList.remove("hidden");
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
});

