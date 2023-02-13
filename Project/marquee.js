// Milestone 5

// Converting previous functionality to Javascript class
// The class accepts an element, creates a child div, adds the animation required for the marquee and appends the stock price data from the fetch function

class Marquee {

    constructor(element) {
        this.element = element;
    }

    async load() {

        this.element.style.overflow = "hidden";
        this.element.style.whiteSpace = "nowrap";
        this.element.style.width = "100%";

        let marq = document.createElement("div");

        marq.classList.add('marq')
        marq.style.animationName = "marquee";
        marq.style.animationDuration = "60s";
        marq.style.whiteSpace = "nowrap";
        marq.style.animationTimingFunction = "linear";
        marq.style.animationIterationCount = "infinite";
        marq.innerHTML = await this.showLiveSharePrice()

        this.element.appendChild(marq);


    }

    async showLiveSharePrice() {

        // Pull the data for live price quotes

        const response = await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quotes/nyse`)
        const data = await response.json()

        // Create an array with template strings and the returned data
        let stockTickerArray = []

        // array length of 100 to not slow down the browser during my working
        for (let i = 0; i < 100; i++) {
            stockTickerArray[i] = `<span>${data[i].symbol}</span>` + " " + `<span>$${data[i].price}</span>`
        }

        //Combine the text from each item in the array and then append it to the div marquee

        let combinedText = "";
        stockTickerArray.forEach(function (item) {
            combinedText += item + " ";
        });

        // Run the function from the javascript class
        return combinedText
    }
}


