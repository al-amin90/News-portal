const categoryContainer = document.getElementById("category-container");
const categoryCount = document.getElementById("category-count");
const categoryName = document.getElementById("category-name");
const cardContainer = document.getElementById("card-container");

let cardView = "";
let categoryIdHolder = "08";
let categoryNameHolder = "All News";
let isTrendingHolder = true;
let isTodaysPickHolder = true;

const trendingBtn = () => {
  displayCategoryData(categoryIdHolder, categoryNameHolder, true, false);
};

const todayPicksBtn = () => {
  displayCategoryData(categoryIdHolder, categoryNameHolder, false, true);
};

const viewFilter = () => {
  const filterValue = document.getElementById("filter").value;
  console.log(`Selected filter: ${filterValue}`);
  displayCategoryData(
    categoryIdHolder,
    categoryNameHolder,
    isTrendingHolder,
    isTodaysPickHolder,
    filterValue
  );
};

const loadCategory = async () => {
  const category = await fetch(
    "https://openapi.programming-hero.com/api/news/categories"
  );
  const { data } = await category.json();
  displayCategory(data.news_category);
};

const displayCategory = (categorys) => {
  categorys.forEach((category) => {
    console.log(category);
    const buttonEle = document.createElement("button");
    buttonEle.classList.add(
      "btn",
      "btn-ghost",
      "btn-sm",
      "px-3",
      "rounded-md",
      "btn-ghost",
      "category-btns"
    );
    buttonEle.innerText = category.category_name;
    buttonEle.classList.remove("bg-[#EEEFFF]", "text-[#5D5FEF]");
    categoryContainer.appendChild(buttonEle);

    buttonEle.addEventListener("click", () => {
      console.log(`Clicked category: ${category.category_name}`);
      document.getElementById("cars").value = "Default";

      document
        .querySelectorAll(".category-btns")
        .forEach((btnC) =>
          btnC.classList.remove("bg-[#EEEFFF]", "text-[#5D5FEF]")
        );
      buttonEle.classList.add("bg-[#EEEFFF]", "text-[#5D5FEF]");
      displayCategoryData(category.category_id, category.category_name);
    });
  });
};

const displayCategoryData = async (
  id,
  idName,
  isTrending,
  isTodaysPick,
  filterValue
) => {
  categoryIdHolder = id;
  categoryNameHolder = idName;
  isTrendingHolder = isTrending;
  isTodaysPickHolder = isTodaysPick;

  const res = await fetch(
    `https://openapi.programming-hero.com/api/news/category/${id}`
  );
  const { data } = await res.json();
  let cards = data;

  if (isTrending) {
    cards = cards.filter((ele) => ele.others_info.is_trending === true);
  }

  if (isTodaysPick) {
    cards = cards.filter((ele) => ele.others_info.is_todays_pick === true);
  }

  if (filterValue === "View") {
    cards = cards.sort((a, b) => b.total_view - a.total_view);
  }

  categoryCount.innerText = cards.length;
  categoryName.innerText = idName;

  cardContainer.textContent = "";

  cards.forEach((card) => {
    const rating = card.rating.number;
    console.log(card);
    let star = "";
    if (rating < 4.5) {
      star = `
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>
            `;
    } else if (rating >= 4.5 && rating < 5) {
      star = `
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
            `;
    } else if (rating === 5) {
      star = `
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
            `;
    }

    // card total view condition
    if (card?.total_view) {
      cardView = `
            <figure><img src="./images/carbon_view.png" alt=""></figure>
            <h4 class="text-lg font-bold text-[#515151]">${
              card?.total_view || "???"
            }M</h4>`;
    } else {
      cardView = "";
    }

    const cardDiv = document.createElement("div");
    cardDiv.className = "p-5 rounded-xl bg-white flex gap-8 shadow-lg";
    cardDiv.innerHTML = `
        <figure>
            <img class="w-full h-[19rem] rounded-lg overflow-hidden" src="${
              card?.thumbnail_url
            }" alt="">
        </figure>
        <div class="flex-1">
            <h3 class="text-2xl text-black font-bold mb-3">${card?.title}</h3>
            <p class="font-normal text-base">${(card?.details).slice(
              0,
              600
            )}...</p>
            <div class="flex justify-between items-center mt-3">
                <div class="*:font-normal flex items-center gap-3">
                    <div>
                        <img class="w-10 aspect-square rounded-full" src="${
                          card?.author?.img
                        }" alt="">
                    </div>
                    <div>
                        <h5 class="text-black text-base">${
                          card?.author?.name || "???"
                        }</h5>
                        <h5 class="text-sm">${card?.author?.published_date}</h5>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    ${cardView}
                </div>
                <div class="rating *:text-2xl flex items-center gap-3 ">
                    ${star}
                </div>
                <div>
                    <figure><img class="cursor-pointer" src="./images/arrow.png" alt=""></figure>
                </div>
            </div>
        </div>
    `;

    cardContainer.appendChild(cardDiv);
  });
};

loadCategory();
displayCategoryData(categoryIdHolder, categoryNameHolder, false, false);
