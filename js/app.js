const categoryContainer = document.getElementById("category-container");
const categoryCount = document.getElementById("category-count");
const categoryName = document.getElementById("category-name");
const cardContainer = document.getElementById("card-container");
// let cards = null;
let cardView = '';
let categoryIdHolder = "01";
let categoryNameHolder = "Breaking News";

let changeCateID = false;


const loadCategory = async () => {
    const res = await fetch(`https://openapi.programming-hero.com/api/news/categories`);
    const {data} = await res.json();
    displayCategory(data.news_category)
}

const displayCategory = (categorys) => {
    categorys.forEach((category) => {
        // create btn and append it 
        const buttonEle = document.createElement("button");
        buttonEle.classList.add("btn", "btn-ghost", "btn-sm", "px-3", "rounded-md", "btn-ghost", "category-btns");
        buttonEle.innerText = category.category_name;
        buttonEle.classList.remove("bg-[#EEEFFF]", "text-[#5D5FEF]")
        categoryContainer.appendChild(buttonEle)

        // after click the catefory btn 
        buttonEle.addEventListener("click", () => {
            document.getElementById("cars").value = "Default";
            
            document.querySelectorAll(".category-btns").forEach(btnC => btnC.classList.remove("bg-[#EEEFFF]", "text-[#5D5FEF]"));

            buttonEle.classList.add("bg-[#EEEFFF]", "text-[#5D5FEF]")
            displayCategoryData(category.category_id, category.category_name)
        })
    })
}

const todayPicksBtn = () => {
    displayCategoryData(categoryIdHolder, categoryNameHolder, false, true)
}

const trendingBtn = () => {
    displayCategoryData(categoryIdHolder, categoryNameHolder, true, false)
}

// our new function 
function getType() {
    const option = document.getElementById("cars").value;
    console.log("clicked")
    displayCategoryData(categoryIdHolder, categoryNameHolder, false, false, option)
}
function getTypeCate() {
    const option = document.getElementById("carsCate").value;
    console.log("clicked")
    displayCategoryData(categoryIdHolder, categoryNameHolder, false, false, option)
}

const displayCategoryData = async (id, idName, isTrending, isTodaysPick, isSortValue) => {
    categoryIdHolder = id;
    categoryNameHolder = idName;

    const res = await fetch(`https://openapi.programming-hero.com/api/news/category/${id}`)
    const data  = await res.json()
    let cards = data.data;
    
    // adding interactive of today and trending btn 
    if (isTodaysPick) {
        cards = cards.filter(ele => ele.others_info.is_todays_pick === true);
    }
    if (isTrending) {
        cards = cards.filter(ele => ele.others_info.is_trending === true);  
    }
    
    categoryCount.innerText = cards.length;
    categoryName.innerText = idName;
    
    cardContainer.textContent = "";

    
    // sort by value
    if (isSortValue === "View") {
        cards.sort((a, b) => {
            const first = a.total_view;
            const second = b.total_view;
            return second - first;
        })
    }
    
    
   
   


    cards.forEach(card => {
        console.log(card.rating.number)
        let star = ""
        if (card.rating.number < 4.5) {
            star = `
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>
            `;
        }
        else if (card.rating.number >= 4.5 && card.rating.number < 5) {
            star = `
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star-half-stroke"></i>
            `;
        }
        else if (card.rating.number === 5) {
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
            <h4 class="text-lg font-bold text-[#515151]">${card?.total_view || "???"}M</h4>`;
        }
        else {
            cardView = '';
        }

        const cardDiv = document.createElement("div")
        cardDiv.className = `p-5 rounded-xl bg-white flex gap-8 shadow-lg`;
        cardDiv.innerHTML = `
            <figure>
                <img class="w-full h-[19rem] rounded-lg overflow-hidden" src="${card?.thumbnail_url}" alt="">
            </figure>
            <div class="flex-1">
                <h3 class="text-2xl text-black font-bold mb-3">${card?.title}</h3>
                <p class="font-normal text-base">${(card?.details).slice(0, 600)}...</p>
                <div class="flex justify-between items-center mt-3">
                    <div class="*:font-normal flex items-center gap-3">
                        <div>
                            <img class="w-10 aspect-square rounded-full" src="${card?.author?.img}" alt="">
                        </div>
                        <div>
                            <h5 class="text-black text-base">${card?.author?.name || "???"}</h5>
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
        `
        cardContainer.appendChild(cardDiv)
    })

    
}



loadCategory()
displayCategoryData(categoryIdHolder, categoryNameHolder, false, false)