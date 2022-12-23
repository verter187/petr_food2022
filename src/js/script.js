window.addEventListener("DOMContentLoaded", function () {
  // Tabs

  const ROUTER_PATH = "http://localhost:5000/api/router/";
  let tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  function hideTabContent() {
    tabsContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", function (event) {
    const target = event.target;
    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Timer

  const deadline = "2023-01-01";

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      seconds = Math.floor((t / 1000) % 60),
      minutes = Math.floor((t / 1000 / 60) % 60),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(".timer", deadline);

  // Modal

  const modalTrigger = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal");

  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  function openModal() {
    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 300000);
  // Изменил значение, чтобы не отвлекало

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }
  window.addEventListener("scroll", showModalByScroll);

  // Используем классы для создание карточек меню

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement("div");

      if (this.classes.length === 0) {
        this.classes = "menu__item";
        element.classList.add(this.classes);
      } else {
        this.classes.forEach((className) => element.classList.add(className));
      }

      element.innerHTML = `
              <img src=${this.src} alt=${this.alt}>
              <h3 class="menu__item-subtitle">${this.title}</h3>
              <div class="menu__item-descr">${this.descr}</div>
              <div class="menu__item-divider"></div>
              <div class="menu__item-price">
                  <div class="menu__item-cost">Цена:</div>
                  <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
              </div>
          `;
      this.parent.append(element);
    }
  }

  // Forms

  const forms = document.querySelectorAll("form");
  const message = {
    loading: "img/form/spinner.svg",
    success: "Спасибо! Скоро мы с вами свяжемся",
    failure: "Что-то пошло не так...",
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  const getResource = async (url) => {
    let res = await fetch(url);

    if (res.status == 200) {
      return await res.json();
    }
    throw new HttpError(res);
  };

  class HttpError extends Error {
    constructor(response) {
      super(`${response.status} for ${response.url}`);
      this.name = "HttpError";
      this.response = response;
    }
  }

  function createMenus() {
    return getResource(`${ROUTER_PATH}/menus`)
      .then((data) => {
        data.map(({ img, alt, title, descr, price }) =>
          new MenuCard(
            img,
            alt,
            title,
            descr,
            price,
            ".menu .container"
          ).render()
        );
      })
      .catch((err) => {
        if (err instanceof HttpError && err.response.status == 404) {
          alert("Результат отсутствует на сервере.");
        } else {
          throw err;
        }
      });
  }
  createMenus();

  const postData = async (url, data) => {
    let res = await fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: data,
    });

    if (res.status == 200) {
      return await res.json();
    }
    throw new HttpError(res);
  };

  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
              display: block;
              margin: 0 auto;
          `;
      form.insertAdjacentElement("afterend", statusMessage);

      const formData = new FormData(form);
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData(`${ROUTER_PATH}/client`, json)
        .then((data) => {
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector(".modal__dialog");

    prevModalDialog.classList.add("hide");
    openModal();

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
          <div class="modal__content">
              <div class="modal__close" data-close>×</div>
              <div class="modal__title">${message}</div>
          </div>
      `;
    document.querySelector(".modal").append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add("show");
      prevModalDialog.classList.remove("hide");
      closeModal();
    }, 4000);
  }

  // Sliders

  const qs = document.querySelector.bind(document),
    prev = qs(".offer__slider-prev"),
    next = qs(".offer__slider-next"),
    parent = qs(".offer__slider-wrapper"),
    total = qs("#total"),
    current = qs("#current"),
    setZero = (num) => (num < 10 ? `0${num}` : num),
    setCurrent = (idx, value) => (value.textContent = setZero(idx + 1));

  let slideIndex = 0;
  setCurrent(slideIndex, current);

  const changeSlide = (slideIndex, slides, clss = "hide") => {
    slides.forEach((item, i) => {
      i === slideIndex ? item.classList.remove(clss) : item.classList.add(clss);
    });
  };

  setSlide = (next) => {
    if (next) {
      slideIndex = slideIndex < parent.children.length - 1 ? slideIndex + 1 : 0;
    } else {
      slideIndex = slideIndex > 0 ? slideIndex - 1 : parent.children.length - 1;
    }
    setCurrent(slideIndex, current);
    changeSlide(slideIndex, [...parent.children]);
  };

  prev.addEventListener("click", () => setSlide());
  next.addEventListener("click", () => setSlide(true));

  const createSlideElement = (img, altimg, parent, clss = "offer__slide") => {
    const element = document.createElement("div");
    element.classList.add(clss);
    element.innerHTML = `<img src="${img}" alt="${altimg}" />`;
    parent.append(element);
  };

  getResource(`${ROUTER_PATH}/slides`)
    .then((data) => {
      data.map(({ img, altimg }) => {
        createSlideElement(img, altimg, parent);
      });
      slidesElem = [...parent.children];
      total.textContent = setZero(slidesElem.length);
      changeSlide(slideIndex, slidesElem);
    })
    .catch((err) => {
      if (err instanceof HttpError && err.response.status == 404) {
        alert("Результат отсутствует на сервере.");
      } else {
        throw err;
      }
    });
});
