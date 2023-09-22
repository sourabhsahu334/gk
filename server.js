const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const cron = require('node-cron');
const GKmodal = require('./modal/gkmodal');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Enable CORS for all routes
app.use(cors(corsOptions));
const port = process.env.PORT || 3000;
app.use(express.json());
require("./db")
require('dotenv').config();
app.get("/",async(req,res)=>{
  res.json({success:true})
})

const array = [ "india-gk","world-gk","gk-questions","gk-quiz","biology-gk","science-gk","physics-gk","chemistry-gk","general-awareness","computer-gk","political-gk","economics-gk","history-gk","sports-gk","geography-gk","teaching-aptitude-in-hindi","khan-sir-gk","ssc-gk-in-hindi","rail-gk","upsc-gk-in-hindi","indian-army-gk-in-hindi","reasoning-in-hindi","up-gk-in-hindi","rajasthan-gk-in-hindi","chhattisgarh-gk-in-hindi","ramayan-gk","current-affairs-2019-in-hindi"];

app.get("/getalldata",async(req,res)=>{
 
try {
      await GKmodal.deleteMany();
      // await Singletypenews.deleteMany();
     
     for ( const item of array){
      let temporaryboject=[]
      for(let i = 0 ; i <6;i++){
      const url = `https://gk-hindi.in/${item}?page=${i}`; // Replace with the URL you want to scrape
  
      // Fetch the HTML content of the website
      const response = await axios.get(url);
  
      // Log the entire response
  
      const html = response.data;
  
      // Load the HTML content into Cheerio
      const $ = cheerio.load(html);
  
     console.log(html);
      const  dataArray=[];
      let questionarray= [];
   
     $('.question-wrapper').each((index, element) => {
      // Extract the text content of each element and push it to the dataArray
      const cardData = $(element).find('.question p b').text();
  
      dataArray.push(cardData);
       questionarray = dataArray[0].split(/\d+\.\s+/).filter(Boolean);
       
       for ( let i =0 ;i <questionarray.length;i++){
        const questionoptions = [];
        const answer= $(element).find(`.showAnswerBtn[data-id=${i}]`).attr('data-answer');

        $(` ul.list-unstyled .option-q${i} `).each((index,element)=>{
          const options= $(element).text();
        questionoptions.push(options);
        })
        const obj= {
          question:questionarray[i],
          options:questionoptions,
          answer:answer,
        }
        temporaryboject.push(obj)
       }
      
    });
  }
  await GKmodal.create({
    data:temporaryboject,
    type:item
  })
}
     res.json({success:true,lenght:length.length})

} catch (error) {
  console.log(error);
  res.json({error:error})
}
})

app.get("/",(req,res)=>{
  res.json({succes:true})
})
app.get("/getdata",async(req,res)=>{
  try {
        const data = await GKmodal.find();
        res.json({succes:true,data:data})
  } catch (error) {
    res.json({
      error:error,
      success:false
    })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
