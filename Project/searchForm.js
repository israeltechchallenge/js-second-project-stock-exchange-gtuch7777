{/* <div class="container d-flex flex-column mt-2" id="container">

<div class="d-flex align-items-center justify-content-center" id="imageAndName"></div>

<div class="d-flex justify-content-center" id="priceAndChange"></div>

<div id="description"></div>

<div style="width: 800px;"><canvas id="acquisitions"></canvas></div> */}


class CompanyInfo {
    constructor(element, symbol) {
      this.symbol = symbol
      this.element = element
    }
  
    async load() {
      const response = await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${this.symbol}`)
      const data = await response.json()
      const { image, companyName, price, changesPercentage, description } = await data.profile
  
      this.displayIconAndName(image, companyName)
      this.displayPriceAndChange(price, changesPercentage)
      this.displayDescription(description)
    }
  
    convertToPercentages(number) {
      return Number(number).toFixed(2) + "%"
    }
  
    displayIconAndName(imageUrl, companyName) {
      let image = document.createElement("img")
      let imageContainer = document.createElement("div")
      this.element.append(imageContainer)
      imageContainer.id = "imageAndName"
      imageContainer.classList.add("d-flex", "align-items-center", "justify-content-center")
      document.getElementById('imageAndName').append(image)
      image.src = imageUrl
      let div = document.createElement("div");
      document.getElementById('imageAndName').append(div)
      div.innerHTML = companyName
    }
  
    displayPriceAndChange(price, change) {
      let div = document.createElement("div")
      let priceContainer = document.createElement("div")
      this.element.append(priceContainer)
      priceContainer.id = "priceAndChange"
      priceContainer.classList.add("d-flex", "justify-content-center")
      document.getElementById('priceAndChange').append(div)
      div.innerHTML = `Stock Price: $${price}`
      let div2 = document.createElement("div");
      document.getElementById('priceAndChange').append(div2)
      div2.innerHTML = `<span class="yo">(${this.convertToPercentages(change)})</span>`
      let percentageCheck = document.querySelector('span')
      if (percentageCheck.innerHTML.length === 7) {
        percentageCheck.classList.add('green')
      } else {
        percentageCheck.classList.add('red')
      }
    }
  
    displayDescription(description) {
      let div = document.createElement("div");
      let descriptionContainer = document.createElement("div")
      this.element.append(descriptionContainer)
      descriptionContainer.id = "description"
      document.getElementById('description').append(div)
      div.innerHTML = description
    }
  
    resetScreen() {
      document.getElementById('imageAndName').textContent = ""
      document.getElementById('priceAndChange').textContent = ""
      document.getElementById('description').textContent = ""
    }
  
    async addChart() {
      const responseHistory = await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${this.symbol}?serietype=line`)
      const dataHistory = await responseHistory.json()
      const resultsNew = dataHistory.historical.reverse()
      
      let chartContainer = document.createElement("div")
      chartContainer.innerHTML = `<canvas id="acquisitions"></canvas>`
      this.element.append(chartContainer)


      new Chart(
        document.getElementById('acquisitions'),
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


