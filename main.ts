import { all } from './data';
import puppeteer from 'puppeteer'
import { wf } from './writer';
(async()=>{

    const browser = await puppeteer.launch({
        protocolTimeout: 90000000,
        userDataDir: 'D:data',
        defaultViewport: null,
        headless: false
      });
      let page = await browser.newPage()
      page.setDefaultNavigationTimeout(120000)

      let ambient = all.ambient
      for (let genre of ambient){
        await page.goto(`https://rateyourmusic.com/genre/${genre.toLowerCase().replace(/ /g , '-')}/`);
        // await page.waitForNavigation();
        let num = await page.evaluate(async()=>{
            let wait = (delay: number) =>
            new Promise<void>(resolve =>
              setTimeout(() => resolve(), delay * 1000)
            )
          let fish = (arg: any) => {
            return document.querySelector(arg)
          }
          let fishes = (arg: any) => {
            return document.querySelectorAll(arg)
          };
          await wait(5)
          let numElment = fish('.page_genre_akas') as Element
          function extractNumber(text:any) {
            // Using regular expression to find the first occurrence of a number with or without commas
            const match = text.match(/\d{1,3}(?:,\d{3})*|^\d+$/);
            if (match) {
                return parseInt(match[0].replace(/,/g, ''));  // Remove all commas and convert to int
            } else {
                return null;  // No number found
            }
        }
        return extractNumber(numElment.textContent)
         
        }) as number 

        console.log(num);
        let pages= 0
        if(num<200){
            pages=1
        }
        else if(num<500){
            pages = 2

        }
        else if (num<1000){
            pages = 3

        }
        else if (num<2000){
            pages = 4
        }
        else if(num<5000){
            pages = 5
        }
        else if(num<15000){
            pages = 6
        }
        else if(num<30000){
            pages=7
        }
        else if(num<70000){
            pages = 9
        }
        else {
            pages=10
        };
        let finale: any = {};
        for(let l=1 ; l<= pages ;l++){
            try{
                
                await page.goto(`https://rateyourmusic.com/charts/top/album/all-time/g:exact,${genre.toLowerCase().replace(/ /g,'-')}/${l}/`)
                let sec = await page.waitForSelector('[id="page_sections_charts"]');
                let some = await page.evaluate(() => {

      
      
      
                    let some = [];
                    let a = document.querySelector('[id="page_charts_section_charts"]');
                    let bs = a?.querySelectorAll(".anchor");
                    let artists = bs
                      ? Array.from(bs).map(
                          (q) =>
                            q
                              ?.querySelector(".artist")
                              ?.querySelector("span")
                              ?.querySelector("span")?.textContent
                        )
                      : ["none"];
              
                    let handellb = (a: Element) => {
                      let name = a.querySelector(
                        '[class="ui_name_locale_original"]'
                      )?.textContent;
                      let rating = a.querySelector(
                        '[class="page_charts_section_charts_item_details_average_num"]'
                      )?.textContent;
                      let date = a
                        .querySelector('[class="page_charts_section_charts_item_date"]')
                        ?.querySelector("span")?.textContent;
                      // let img = a.querySelector("img")?.src;
                      let b = a.querySelector(
                        '[class="page_charts_section_charts_item_genres_primary"]'
                      )?.children;
                      let mainGenres: any;
                      if (b) {
                        let mainGenres = Array.from(b).map((q) => q.textContent);
                      } else {
                        let mainGenres = [];
                      }
                      // let  qq = a.querySelector('.ui_media_link_btn_spotify') as HTMLAnchorElement;
                      // let spotifyLink = qq?.href;
              
                      let full = {
                        name: name,
                        // imgSrc: img,
                        date: date,
                        rating: rating,
                        genres: mainGenres,
                        // spotifyLink: spotifyLink,
                      };
                      return full;
                    };
                    if (bs) {
                      let cs = Array.from(bs);
                      for (let b of cs) {
                        if (b) {
                          let gg = handellb(b);
                          some.push(gg);
                        }
                      }
                    }
              
                    //
              
                    return some;
                  });
                  let artists = await page.evaluate(() => {
                    let a = document.querySelector('[id="page_charts_section_charts"]');
                    let bs = a?.querySelectorAll(".anchor");
                    let artists = bs
                      ? Array.from(bs).map(
                          (q) =>
                            q
                              ?.querySelector(".artist")
                              ?.querySelector("span")
                              ?.querySelector("span")?.textContent
                        )
                      : ["none"];
                    return artists;
                  });
                  for (let i = 0; i < artists.length; i++) {
                    let point = artists[i];
                    if (point) {
                      if (finale[`${point}`]) {
                        finale[`${point}`].push(some[i]);
                      } else {
                        finale[`${point}`] = [some[i]];
                      }
                    }
                  }
                 
    


            }
            catch{}
        }
        wf(finale , genre , 'ambient')


      }


    
    
})()