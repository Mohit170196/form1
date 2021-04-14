var fetch = require('node-fetch')

async function  a(){
    let res = await fetch('http://localhost:3000/list', {
            // mode: 'no-cors',
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        },
    );
    res = res.json()
    console.log(res)

    //     .then(response => {
    //         response.json().then(json => {
    //             json.map(e => {
    //                 console.log(e)
    //             })
    //         });
    // });
}
a()
