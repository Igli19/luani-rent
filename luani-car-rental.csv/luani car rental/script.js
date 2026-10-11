
const cars = [
  {
    id: "car1",
    name: "Passat CC",
    price: 3000,
    images: [
      "images/passatcc1.jpeg",
      "images/passatcc2.jpeg",
      "images/passatcc3.jpeg",
      "images/passatcc4.jpeg",
      "images/passatcc5.jpeg",
      "images/passatcc6.jpeg",
      "images/passatcc.jpeg"
    ],
    details: "2.0 nafte / Kambio Automatike / Viti-2011"
  },
  {
    id: "car2",
    name: "Ford Fiesta",
    price: 2500,
    images: [
      "images/car1 (2).jpeg",
      "images/car1 (1).jpeg",
      "images/car1 (3).jpeg",
      "images/car1 (4).jpeg",
      "images/car1 (5).jpeg",
      "images/car1 (7).jpeg",
      "images/car1 (6).jpeg",
    ],
    details: "1.3 Benzin/Gaz / Kambio Manuale / Viti-2011"
  },
  {
    id: "car3",
    name: "Mercedes Benz C-Class",
    price: 3000,
    images: [
     "images/car2 (2).jpeg",
      "images/car2 (1).jpeg",
      "images/car2 (3).jpeg",
      "images/car2 (4).jpeg",
      "images/car2 (5).jpeg",
      "images/car2 (7).jpeg",
      "images/car2 (6).jpeg",
    ],
    details: "2.0 nafte / Kambio Automatike / Viti-2009"   
  },
  {
    id: "car4",
    name: "Golf 6",
    price: 3000,
    images: [
     "images/car3 (2).jpeg",
      "images/car3 (1).jpeg",
      "images/car3 (3).jpeg",
      "images/car3 (4).jpeg",
      "images/car3 (5).jpeg",
      "images/car3 (7).jpeg",
      "images/car3 (6).jpeg",
    ],
    details: "2.0 nafte / Kambio Automatike / Viti-2013"
    
  }
];

const carGrid = document.getElementById("carGrid");
const selectedCar = document.getElementById("selectedCar");
const bookingForm = document.getElementById("bookingForm");
const message = document.getElementById("formMessage");
const pickupDate = document.getElementById("pickupDate");
const returnDate = document.getElementById("returnDate");

// Krijojmë kartat e makinave
cars.forEach((car) => {
  const card = document.createElement("article");
  card.className = "car-card";

  // Galeria e fotove
  const gallery = document.createElement("div");
  gallery.className = "car-gallery";
  gallery.style.position = "relative";

  let currentImageIndex = 0;

  const image = document.createElement("img");
  image.src = car.images[currentImageIndex];
  image.alt = car.name;
  image.loading = "lazy";

  image.onerror = () => {
    image.alt = "Fotografia e makinës nuk u gjet";
  };

  const previousButton = document.createElement("button");
  previousButton.type = "button";
  previousButton.className = "gallery-prev";
  previousButton.textContent = "❮";
  previousButton.setAttribute("aria-label", "Fotoja e mëparshme");

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "gallery-next";
  nextButton.textContent = "❯";
  nextButton.setAttribute("aria-label", "Fotoja tjetër");

  const imageCounter = document.createElement("span");
  imageCounter.className = "gallery-counter";

  function updateImage() {
    image.src = car.images[currentImageIndex];
    imageCounter.textContent =
      `${currentImageIndex + 1} / ${car.images.length}`;
  }

  previousButton.addEventListener("click", () => {
    currentImageIndex =
      (currentImageIndex - 1 + car.images.length) % car.images.length;
    updateImage();
  });

  nextButton.addEventListener("click", () => {
    currentImageIndex =
      (currentImageIndex + 1) % car.images.length;
    updateImage();
  });

  updateImage();

  gallery.append(image, previousButton, nextButton, imageCounter);

  const info = document.createElement("div");
  info.className = "car-info";

  const title = document.createElement("h3");
  title.textContent = car.name;

  const details = document.createElement("p");
  details.textContent = car.details;

  const price = document.createElement("p");
  price.className = "car-price";
  price.textContent =
    car.price > 0
      ? `${car.price} ALL / ditë`
      : "Çmimi sipas ofertës";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn";
  button.textContent = "ZGJIDH KËTË MAKINË";

  button.addEventListener("click", () => {
    selectedCar.value = car.id;
    document.getElementById("booking").scrollIntoView({
      behavior: "smooth"
    });
  });

  info.append(title, details, price, button);
  card.append(gallery, info);
  carGrid.appendChild(card);

  const option = document.createElement("option");
  option.value = car.id;
  option.textContent = car.name;
  selectedCar.appendChild(option);
});

// Vendosim datën minimale: sot
const today = new Date();
const localToday = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

pickupDate.min = localToday;
returnDate.min = localToday;

pickupDate.addEventListener("change", () => {
  returnDate.min = pickupDate.value || localToday;

  if (
    returnDate.value &&
    returnDate.value < pickupDate.value
  ) {
    returnDate.value = "";
  }
});

// GOOGLE SPREADSHEET - E PANDRYSHUAR
const API_URL =
  "https://script.google.com/macros/s/AKfycbwtKcXok0e2rK2Q4QAtY5h74cFQ0IjT4F3zQF-rLBykP5Nh2ispX3izQH8Lvv42Nv-Bug/exec";

bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedCar.value) {
    message.textContent = "Zgjidh një makinë.";
    return;
  }

  if (!pickupDate.value || !returnDate.value) {
    message.textContent = "Zgjidh datën e marrjes dhe të kthimit.";
    return;
  }

  if (returnDate.value <= pickupDate.value) {
    message.textContent =
      "Data e kthimit duhet të jetë pas datës së marrjes.";
    return;
  }

  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");

  const reservation = {
    car: selectedCar.value,
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    pickup: pickupDate.value,
    returnDate: returnDate.value
  };

  message.textContent = "Duke dërguar rezervimin...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(reservation)
    });

    const data = await response.json();

    if (data.success) {
      message.textContent =
        `Rezervimi u regjistrua me sukses! ID: ${data.id}`;

      bookingForm.reset();

      pickupDate.min = localToday;
      returnDate.min = localToday;
    } else {
      message.textContent =
        data.message || "Rezervimi nuk mund të kryhej.";
    }

  } catch (error) {
    console.error(error);

    message.textContent =
      "Ndodhi një problem gjatë dërgimit të rezervimit.";
  }
});

document.getElementById("year").textContent =
  new Date().getFullYear();

// Instagram
document.getElementById("instagramLink").href =
  "https://www.instagram.com/luani.rent/";

// KONTROLLI I REZERVIMEVE - I PANDRYSHUAR
const checkBookingForm = document.getElementById("checkBookingForm");
const bookingResult = document.getElementById("bookingResult");

const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwtKcXok0e2rK2Q4QAtY5h74cFQ0IjT4F3zQF-rLBykP5Nh2ispX3izQH8Lvv42Nv-Bug/exec";

if (checkBookingForm) {
  checkBookingForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document
      .getElementById("bookingId")
      .value
      .trim();

    const phone = document
      .getElementById("bookingPhone")
      .value
      .trim();

    bookingResult.innerHTML = "<p>Duke kontrolluar...</p>";

    try {
      const url =
        WEB_APP_URL +
        "?lookup=reservation" +
        "&id=" + encodeURIComponent(id) +
        "&phone=" + encodeURIComponent(phone);

      const response = await fetch(url);
      const data = await response.json();

      if (!data.success) {
        bookingResult.innerHTML = `
          <div class="booking-error">
            ❌ ${data.message}
          </div>
        `;
        return;
      }

      const reservation = data.reservation;

      let statusText = reservation.status;

      if (reservation.status === "CONFIRMED") {
        statusText = "✅ CONFIRMED";
      } else if (reservation.status === "PENDING") {
        statusText = "🟡 PENDING";
      } else if (reservation.status === "CANCELLED") {
        statusText = "❌ CANCELLED";
      }

      bookingResult.innerHTML = `
        <div class="reservation-card">

          <h3>Rezervimi juaj</h3>

          <p>
            <strong>ID:</strong>
            ${reservation.id}
          </p>

          <p>
            <strong>Makina:</strong>
            ${reservation.car}
          </p>

          <p>
            <strong>Data e marrjes:</strong>
            ${reservation.pickup}
          </p>

          <p>
            <strong>Data e kthimit:</strong>
            ${reservation.returnDate}
          </p>

          <p>
            <strong>Statusi:</strong>
            ${statusText}
          </p>

        </div>
      `;

    } catch (error) {
      bookingResult.innerHTML = `
        <div class="booking-error">
          ❌ Ndodhi një gabim gjatë kontrollit të rezervimit.
        </div>
      `;
    }
  });
}
