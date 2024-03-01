const categoryContainer = document.getElementById("category-container");
const categoryCount = document.getElementById("category-count");
const categoryName = document.getElementById("category-name");
const cardContainer = document.getElementById("card-container");
// let cards = null;
let cardView = '';
let categoryIdHolder = "01";
let categoryNameHolder = "Breaking News";


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

const displayCategoryData = async (id, idName, isTrending, isTodaysPick) => {
    categoryIdHolder = id;
    categoryNameHolder = idName;
    const res = await fetch(`https://openapi.programming-hero.com/api/news/category/${id}`)
    const data  = await res.json()
    let cards = data.data;
    
    if (isTodaysPick) {
        cards = cards.filter(ele => ele.others_info.is_todays_pick === true);
    }
    if (isTrending) {
        cards = cards.filter(ele => ele.others_info.is_trending === true);  
    }
    
    categoryCount.innerText = cards.length;
    categoryName.innerText = idName;

    cardContainer.textContent = "";


    cards.forEach(card => {
        console.log(card.others_info.is_todays_pick)

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
                    <div class="rating flex items-center gap-3 ">
                        <input type="radio" name="rating-1" class="mask mask-star-2" />
                        <input type="radio" name="rating-1" class="mask rating-half mask-star-2" checked />
                        <input type="radio" name="rating-1" class="mask rating-half mask-star-2" />
                        <input type="radio" name="rating-1" class="mask rating-half mask-star-2" />
                        <input type="radio" name="rating-1" class="mask rating-half mask-star-2" />
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