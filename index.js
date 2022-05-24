const fs = require('fs');
const { readFileSync, writeFileSync } = require('fs');
const express = require('express')
const app = express()

const port = 3000 || process.env.PORT;
const domain = "http://localhost:3000" // make sure its not localhost:3000/ means not / in end of domain

function dataRead(){
    let  raw = readFileSync('./db/data.json', 'utf8');
    let  data = JSON.parse(raw);
    return data;
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

app.get('/', (req, res) => {
    res.send(`
    <style>
        .myForm {
            position: absolute;
            top: 33vh;
            left: 4vw;
            border-radius: 10px;
            background-color: rgba(252, 252, 252, 0.921);
            box-shadow: 0 5px 5px rgba(0, 0, 0, 0.215);
            font-family: 'Poppins';
            font-size: 0.8em;
            width: 20em;
            padding: 1em;
            border: 1px solid #ccc;
        }

        .myForm * {
            box-sizing: border-box;
        }

        .myForm fieldset {
            border: none;
            padding: 0;
        }

        .myForm legend,
        .myForm label {
            padding: 0;
            font-weight: bold;
        }

        .myForm label.choice {
            font-size: 0.9em;
            font-weight: normal;
        }

        .myForm input[type="text"],
        .myForm input[type="password"],
        .myForm input[type="tel"],
        .myForm input[type="email"],
        .myForm input[type="datetime-local"],
        .myForm select,
        .myForm textarea {
            display: block;
            width: 100%;
            border: 1px solid #ccc;
            font-family: 'Poppins';
            font-size: 0.9em;
            padding: 0.3em;
        }

        .myForm textarea {
            height: 100px;
        }

        .myForm button {
            padding: 1em;
            border-radius: 0.5em;
            background: #eee;
            border: none;
            font-weight: bold;
            margin-top: 1em;
        }

        .myForm button:hover {
            background: #ccc;
            cursor: pointer;
        }
    </style>
    <div class="myForm">

                    <p>
                        <label>Long Link
                            <input  type="text" id="long" name="long" >
                        </label>
                    </p>
                    <p style="display: flex;"><button onclick="healer()">Start</button></p>
    </div>
    
    
    <script>
     function healer(){
     link = "${domain}/api/gen/";
     link = link + btoa(document.getElementById('long').value);
     console.log(link);
    window.open(link ,"_self");
}
    </script>`)
})


app.get('/api/gen/:code', (req, res) => {

    let link = req.params.code

    link = atob(link);


    let d = dataRead();

    let id = makeid(5);

    while(d.find(elem => elem.short === id)){

        id = makeid(5);

    }

    d.push({
        short: id,
        long: link
    });

    writeFileSync('./db/data.json', JSON.stringify(d),   'utf-8', (err) => {
        if (err) console.log(err);
    });

    res.send(`${domain}/o/${id}`)
})



app.get('/o/:code', (req, res) => {
    let code = req.params.code;
    let d = dataRead();


    let findcode = d.find(elem => elem.short === code)

    if(findcode == undefined){
        res.send("Link is Never Made");
    }
    else
        res.status(301).redirect(`${findcode.long}`);

    


})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log('MADE BY HEALER')
  })