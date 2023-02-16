


class CompanyInfo {
    constructor(element, symbol) {
      this.symbol = symbol
      this.element = element
    }
  
    // Async function to fetch the company data
    async load() {
      const response = await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${this.symbol}`)
      const data = await response.json()

      // Destruction to create variables
      const { image, companyName, price, changesPercentage, description } = await data.profile
   
  
      this.displayIconAndName(image, companyName)
      this.displayPriceAndChange(price, changesPercentage)
      this.displayDescription(description)
    }
  
    // Convert the result into a percentage
    convertToPercentages(number) {
      return Number(number).toFixed(2) + "%"
    }

  
    // Rendering the icon and name
    displayIconAndName(imageUrl, companyName) {
      let image = document.createElement("img")
      let imageContainer = document.createElement("div")
      this.element.append(imageContainer)
      imageContainer.id = `${this.symbol}imageAndName`
      imageContainer.classList.add("d-flex", "align-items-center", "justify-content-center", "p-4")
      document.getElementById(`${this.symbol}imageAndName`).append(image)
      image.src = imageUrl
      let div = document.createElement("div");
      document.getElementById(`${this.symbol}imageAndName`).append(div)
      div.innerHTML = companyName
    }
  
    // Rendering the price and change
    displayPriceAndChange(price, change) {
      let div = document.createElement("div")
      let priceContainer = document.createElement("div")
      this.element.append(priceContainer)
      priceContainer.id = `${this.symbol}priceAndChange`
      priceContainer.classList.add("d-flex", "justify-content-center", "pb-4")
      document.getElementById(`${this.symbol}priceAndChange`).append(div)
      div.innerHTML = `Stock Price: $${price}`
      let div2 = document.createElement("div");
      document.getElementById(`${this.symbol}priceAndChange`).append(div2)
      div2.innerHTML = `<span id="${this.symbol}color" class="yo">(${this.convertToPercentages(change)})</span>`
      let percentageCheck = document.getElementById(`${this.symbol}color`)
      if (percentageCheck.innerHTML.length === 7) {
        percentageCheck.classList.add('green')
      } else {
        percentageCheck.classList.add('red')
      }
    }
  
    // Rendering the description
    displayDescription(description) {
      let div = document.createElement("div");
      let descriptionContainer = document.createElement("div")
      this.element.append(descriptionContainer)
      descriptionContainer.id = `${this.symbol}description`
      document.getElementById(`${this.symbol}description`).append(div)
      div.innerHTML = description
    }
  
    // To reset the screen at the beginning of each new search
    resetScreen() {
      document.getElementById(`${this.symbol}imageAndName`).textContent = ""
      document.getElementById(`${this.symbol}priceAndChange`).textContent = ""
      document.getElementById(`${this.symbol}description`).textContent = ""
    }
  
    // To add in the chart from historical data
    async addChart() {
      const responseHistory = await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${this.symbol}?serietype=line`)
      const dataHistory = await responseHistory.json()
      const resultsNew = dataHistory.historical.reverse()
      
      let chartContainer = document.createElement("div")
      chartContainer.innerHTML = `<canvas id="${this.symbol}acquisitions"></canvas>`
      this.element.append(chartContainer)


      new Chart(
        document.getElementById(`${this.symbol}acquisitions`),
        {
          type: 'bar',
          data: {
            labels: resultsNew.map(row => row.date),
            datasets:
            [
                {
                    label: 'Stock Price History',
                    data: resultsNew.map(row => row.close)
                }
            ]
        }
    }
);
}}


