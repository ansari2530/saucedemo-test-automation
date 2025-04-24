# 🧪 Playwright Automation Suite

This project contains automated test cases using [Playwright] for verifying the **Login**, **Cart**, and **Homepage** flows of the [SauceDemo](https://www.saucedemo.com/) application.

     
## Installation

### Clone repo

```bash
# Clone the repo
git clone git@github.com:ansari2530/saucedemo-test-automation.git

# Install dependencies
$ npm install

# Install the browsers to run the tests with playwright
$ npx playwright install
```

## Playwright

This project was begun with [Playwright](https://playwright.dev/docs/intro)

### Basic usage

```bash
# Run test cases in headed mode
 npm run regression-headed

# Run test cases in headless mode
 npm run regression-headless
```



### Env setup

Create new file `.env` based on `.env.example` file. Update values for `.env` before running the project. 


## Project Convention

```
├── pages/  
│   ├── LoginPage.ts  
│   ├── CartPage.ts  
│   └── HomePage.ts  
│  
├── test-data/  
│   ├── homepage/  
│   │   └── homepage-testdata.json  
│   ├── cartpage/  
│   │   └── cartpage-testdata.json  
│   └── loginpage/  
│       └── loginpage-testdata.json  
│  
├── tests/  
│   ├── login.spec.ts  
│   ├── cartpage.spec.ts  
│   └── homepage.spec.ts  
│  
├── utils/  
│   ├── common-utility.ts  
│   ├── login-utility.ts  
│   └── reporter-utility.ts  
│  
├── .env  
├── playwright.config.ts 
```


## Documentation

- [Playwright](https://playwright.dev)

- **Typescript**
  - This consists of tsconfig.json file with configuration for the typescript compiler.


## Execution Setup via playwright command
 - All the test releated to homepage are grouped in tests/homepage folder 
 - command to run the script for homepage  `npx playwright test tests/homepage` 

 - All the test releated to cartpage are grouped in tests/homepage folder 
 - command to run the script for cartpage  `npx playwright test tests/cartpage` 

 - All the test releated to loginpage are grouped in tests/homepage folder 
 - command to run the script for loginpage `npx playwright test tests/loginpage` 
 
- command to run all the tests  `npx playwright test tests`

## Execution Setup via npm command

 - All the test releated to homepage are grouped in tests/homepage folder 
 - command to run the script for homepage  `npm run homepage` 

 - All the test releated to cartpage are grouped in tests/homepage folder 
 - command to run the script for cartpage  `npm run cartpage` 

 - All the test releated to loginpage are grouped in tests/homepage folder 
 - command to run the script for loginpage ``npm run loginpage` 

 ## Logger Setup 
 - All the information related to warnings ,errors stored in `logs` folder in `saucedemo.log` file 


 ## Jenkins CI/CD setup to execute the tests

 - Install Jenkins into your local machine

 - navigate to localhost:8080 and enter the username & password to run jenkins locally

 - Navigate to this link and download the provided config file [config.xml](https://drive.google.com/file/d/1nY_dmT9kLznpXtkTkn0RL3s8foSfyydb/view?usp=sharing)

 - Create a new freestyle Job using "New Item" named "Saucedemo-Automation"

 -  Navigate to /.jenkin/Jobs/Saucedemo-Automation in your local machine folder

 - copy & paste that above downloaded config.xml file into this "Saucedemo-Automation" folder.

 - restart the jenkins using localhost:8080/restart.

 - Look for the created job into the Dashboard.

 - navigate to configure & update the pipeline script with the actual project path under `dir`
   e.g. `dir('/Users/<foldername1>/<foldername2>/<foldername3>/saucedemo-test-automation')`

 - After tapping over it, select `build with parameters` choose the parameters value as i.e `tag`, `browser` & `mode`.
    e.g.
    - selection of `regression`, `chromium` & `headless` : Execute all the tests in headless chrome.
    - selection of `regression`, `chromium` & `headed` : Execute all the tests in UI headed chrome.
    - selection of `homepage`, `chromium` & `headless` : Execute all the homepage tests in headless chrome.
    - selection of `cartpage`, `chromium` & `headless` : Execute all the cartpage tests in headless chrome.
    - selection of `loginpage`, `chromium` & `headless` : Execute all the cartpage tests in headless chrome.
    - follow the same for firefox headed/headless mode as well.


 - select the options according to the requirement & execute the tests.

- NOTE: All the requested videos, reports, logs & config file are available here at this drive [link](https://drive.google.com/drive/folders/1ovp0Ecnt706TQ_VCZRIqD8KCuEk8EK7U?usp=sharing) 