
class SearchResults {

    constructor() {
        // Declare all the variables to be worked with

        // Creating all the elements needed for html
        let listContainer = document.createElement('ul')
        let searchButton = document.createElement('button')
        let searchContainer = document.getElementById('searchContainer')
        let searchValue = document.createElement('input')
        let inputAndSearchContainer = document.createElement('div')
        let spinner = document.createElement('div')

        // Append so the html structure makes sense
        searchContainer.append(inputAndSearchContainer)
        inputAndSearchContainer.append(searchButton)
        inputAndSearchContainer.append(searchValue)
        searchContainer.append(spinner)

        // Edit the properties accordingly
        listContainer.id = "listContainer"
        searchContainer.classList.add("text-center")
        searchValue.type ="text"
        searchValue.id = "searchValue"
        searchValue.placeholder = "Type search here"
        searchValue.style.width = "100%"
        inputAndSearchContainer.classList.add("d-flex")
        inputAndSearchContainer.style.paddingBottom = ("1rem")
        searchButton.type = "submit"
        searchButton.id = "button"
        searchButton.innerText = "Search"
        searchButton.classList.add("btn", "btn-info", "btn-sm", "text-center")
        spinner.id = "loadingSpinner"
        spinner.classList.add("spinner-border", "d-none")

        // Construct the properties of the class
        this.listContainer = document.getElementById('listContainer')
        this.searchButton = document.getElementById("button");
        this.searchValue = document.getElementById("searchValue")
        this.spinner = document.getElementById('loadingSpinner')
        this.compareButton;

        // Append list container to its parent
        document.querySelector("[id='searchContainer']").append(listContainer)

        // Event listener that sends a fetch based on input value
        this.searchButton.addEventListener('click', this.getStockData.bind(this))

        
        

    }



    // Fetch that returns response from API
    async getStockData() {
        let searchInput = searchValue.value
        this.enableSpinner()
        const response = await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchInput}&limit=10&exchange=NASDAQ`)
        const data = await response.json()

        // Fetch the full company detail by looping through each symbol from the search result
        async function fetchFullCompanyDetail(key) {
            const response2 = await fetch(`https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${key}`)
            const data2 = await response2.json()
            return data2
        }

        // Create an array to put in results of the full company detail
        let results = [];

        const createArrayWithFullData = async () => {
            for (const key of data) {
                const result = await fetchFullCompanyDetail(key.symbol)
                results.push(result)
            }

            return results
        }

        // Using a method to connect the two datasets together, namely the "stock data" and "fullcompanydata". This is to create one merged dataset by using a unique identifier of Symbol

        await createArrayWithFullData()
        let mergedData = [];
        for (const item of data) {
            let match = await results.find(x => x.symbol === item.symbol);
            if (match) {
                mergedData.push({ ...item, ...match });
            }
        }

        // Create a list in the html with the merged data
        this.createList(mergedData)

        // Disable the loading spinner
        this.disableSpinner()

        // Change the color of the percentages
        this.changeColorPercentage()

    }

    // Create a list with the returned object
    
    createList(data) {

        let searchInput = searchValue.value

        const list = data.map(item => {
            return `<li class="list"> <img class="image" src=${item.profile.image} alt="Picture Dosen't exist"> <a href="company.html?symbol=${item.symbol}"> ${item.name} <span>(${item.symbol})</span> <span id="percentage">(${this.convertToPercentages(item.profile.changesPercentage)})</span> </a> <button class="compare btn btn-info btn-sm text-center" id="${item.symbol}">Compare</button> </li>`;
        }).join("");


        // Create a regex that searches for the name and ticker and adds a space around them

        const regex = new RegExp(`(?<=\\s|\\()${searchInput}`, "gi");
        const outputString = `${list.replace(regex, (match) => `<span class="yellow">${match}</span>`)}`;
        
        // Add the output to the container inner html
        
        listContainer.innerHTML = `${outputString}`
        listContainer.classList.add('list-group')

        this.compareButton = document.querySelectorAll("button")
        
        // Call the event listener and run function
        this.attachListeners(data)
    }

    changeColorPercentage() {
        let percentageCheck = document.querySelectorAll("[id='percentage']")
        for (let i = 0; i < percentageCheck.length; i++) {
            if (percentageCheck[i].innerHTML.length === 7) {
                percentageCheck[i].classList.add('green')
            } else {
                percentageCheck[i].classList.add('red')
            }
        }
    }

    // Function to convert to percentage
    convertToPercentages(number) {
        return Number(number).toFixed(2) + "%"
    }

    // Functions to disable and enable the loading spinner

    enableSpinner() {
        this.spinner.classList.remove("d-none")
    }

    disableSpinner() {
        this.spinner.classList.add("d-none")
    }


    // This event listener identifies which button has been clicked and then feeds the "symbol" into the find object symbol

    attachListeners(data) {
        for (const button of this.compareButton) {
          button.addEventListener('click', (event) => {
            const symbolButton = event.target.id
            this.findObjectBySymbol(symbolButton, data)
          });
        }
        
    }

    // Function to connect the symbol from the compare button click with the object and console log it

    findObjectBySymbol(symbol, array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i].symbol === symbol) {
            console.log(array[i])
          }
        }
        return null;
      }

}

// call this class

const showSearchResult = new SearchResults()