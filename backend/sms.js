const express = require('express');
const cors = require('cors');
const smsServiceProvider = require('africastalking');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const smsServer = smsServiceProvider({
  username : "Malone_School_Setup",
  apiKey : "atsk_7b3a0e8eb9bc595d8ee15da889ecf28a4e8fdc7681749ddd9ef415e528001b13001904e6" 
})

const sms = smsServer.SMS;


app.post('/smsService' , async(req,res) => {
    const {phones , message} = req.body;
    
    try{
      const sending = await sms.send({
        to : phones,
        message : message
      });
      res.json({message : "messages sent succesfully" , type : true , response : sending});
    }catch(error){
        console.log("error sending" , error , phones);
        res.status(500).json({ success: false, error: error.message,phones : phones });
    }
})

const port = process.env.PORT || 3000;

app.listen(port , () => {
    console.log(`server is running at prt ${port}`);
})