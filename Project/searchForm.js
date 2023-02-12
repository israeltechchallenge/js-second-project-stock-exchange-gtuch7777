class SearchForm {
    constructor() {
      this.symbol = new URLSearchParams(window.location.search).toString().split("=", [2])[1];
      document.addEventListener("DOMContentLoaded", this.getCompanyProfile.bind(this));
    }
  
    async getCompanyProfile() {
      const response = await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${this.symbol}`)
      const data = await response.json()
      const { image, companyName, price, changesPercentage, description } = await data.profile
  
      this.displayIconAndName(image, companyName)
      this.displayPriceAndChange(price, changesPercentage)
      this.displayDescription(description)
      this.getHistoricalResults(this.symbol)
    }
  
    convertToPercentages(number) {
      return Number(number).toFixed(2) + "%"
    }
  
    displayIconAndName(imageUrl, companyName) {
      let image = document.createElement("img")
      document.getElementById('imageAndName').append(image)
      image.src = imageUrl
      let div = document.createElement("div");
      document.getElementById('imageAndName').append(div)
      div.innerHTML = companyName
    }
  
    displayPriceAndChange(price, change) {
      let div = document.createElement("div");
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
      document.getElementById('description').append(div)
      div.innerHTML = description
    }
  
    resetScreen() {
      document.getElementById('imageAndName').textContent = ""
      document.getElementById('priceAndChange').textContent = ""
      document.getElementById('description').textContent = ""
    }
  
    async getHistoricalResults() {
      const responseHistory = await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${this.symbol}?serietype=line`)
      const dataHistory = await responseHistory.json()
      const resultsNew = dataHistory.historical.reverse()
  
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

const showForm = new SearchForm();


