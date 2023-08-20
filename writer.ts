const fs = require('fs');
const wf = async(ob:object, file:string,genre:string)=>{
    const jsonData = JSON.stringify(ob);
    fs.writeFile(`${genre}/${file}.json`, jsonData, (err:any) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('JSON file has been written successfully.');
      }
    });
    
}
export{wf}