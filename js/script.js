    
const wrapper = document.querySelector(".wrapper"),
musicimg = wrapper.querySelector(".img-area img"),
musicname = wrapper.querySelector(".song-details .name"),
musicartist = wrapper.querySelector(".song-details .artist"),
musicaudio = wrapper.querySelector("#main-audio"),
playpausebtn = wrapper.querySelector(".play-pause"),
prevbtn = wrapper.querySelector("#prev"),
nextbtn = wrapper.querySelector("#next"),
progressarea = wrapper.querySelector(".progress-area"),
progressbar = wrapper.querySelector(".progress-bar"),
musiclist = wrapper.querySelector(".music-list"),
showmorebtn = wrapper.querySelector("#more-music"),
hidemusicbtn = musiclist.querySelector("#close");

let musicindex = Math.floor((Math.random() *allmusic.length) + 1);

window.addEventListener("load", ()=>{
    loadmusic(musicindex);
    playingnow();
})


function loadmusic(indexnumb){
   musicname.innerText = allmusic[indexnumb - 1].name;
   musicartist.innerText = allmusic[indexnumb - 1].artist;
   musicimg.src = `../img/${allmusic[indexnumb - 1].img}.jpg`;
   musicaudio.src = `../img/${allmusic[indexnumb - 1].src}.mp3`;  
}

function playmusic(){
    wrapper.classList.add("paused");
    playpausebtn.querySelector("i").innerText = "pause";
    musicaudio.play();
}

function pausemusic(){
    wrapper.classList.remove("paused");
    playpausebtn.querySelector("i").innerText = "play_arrow";
    musicaudio.pause();
}

function nextmusic() {
    musicindex++;
    musicindex > allmusic.length ? musicindex = 1 : musicindex = musicindex;
    loadmusic(musicindex);
    playmusic();
    playingnow();
}

function prevmusic() {
    musicindex--;
    musicindex < 1 ? musicindex = allmusic.length : musicindex = musicindex;
    loadmusic(musicindex);
    playmusic();
    playingnow();
}

playpausebtn.addEventListener("click", ()=>{
    const ismusicpaused = wrapper.classList.contains("paused");
    ismusicpaused ? pausemusic() : playmusic();
    playingnow();
})

nextbtn.addEventListener("click", ()=>{
    nextmusic();
});

prevbtn.addEventListener("click", ()=>{
    prevmusic();
});


musicaudio.addEventListener("timeupdate", (e)=>{
    const currenttime = e.target.currentTime;
    const duration = e.target.duration;
    let progresswidth = (currenttime / duration) * 100;
    progressbar.style.width = `${progresswidth}%`;

    let musiccurrenttime = wrapper.querySelector(".current"),
    musicduration = wrapper.querySelector(".duration");

    musicaudio.addEventListener("loadeddata", ()=>{

        let audioduration = musicaudio.duration;
        let totalmin = Math.floor(audioduration / 60);
        let totalsec = Math.floor(audioduration % 60);
        if (totalsec < 10) {
            totalsec = `0${totalsec}`;
        }
        musicduration.innerText = `${totalmin}:${totalsec}`;  
    });

        let currentmin = Math.floor(currenttime / 60);
        let currentsec = Math.floor(currenttime % 60);
        if (currentsec < 10) {
            currentsec = `0${currentsec}`;
        }
        musiccurrenttime.innerText = `${currentmin}:${currentsec}`;

});

progressarea.addEventListener("click", (e)=>{
    let progresswidthval = progressarea.clientWidth;
    let clickedoffsetx = e.offsetX;
    let songduration  = musicaudio.duration;

    musicaudio.currentTime = (clickedoffsetx / progresswidthval) * songduration;
    playmusic();
});

const repeatbtn = wrapper.querySelector('#repeat-plist');
repeatbtn.addEventListener("click", ()=>{
    let gettext = repeatbtn.innerText;
    switch (gettext) {
        case "repeat":
            repeatbtn.innerText = "repeat_one";
            repeatbtn.setAttribute("title", "song looped");
            break;
        case "repeat_one":
            repeatbtn.innerText = "shuffle";
            repeatbtn.setAttribute("title", "playback shuffle");
            break;
        case "shuffle":
            repeatbtn.innerText = "repeat";
            repeatbtn.setAttribute("title", "playlist looped");
            break;
    }
});

musicaudio.addEventListener("ended", ()=>{
    let gettext = repeatbtn.innerText;
    switch (gettext) {
        case "repeat":
            nextmusic();
            break;
        case "repeat_one":
            musicaudio.currentTime = 0;
            loadmusic(musicindex);
            playmusic();
            break;
        case "shuffle":
            let randindex = Math.floor((Math.random() *allmusic.length) + 1);
            do {
                randindex = Math.floor((Math.random() *allmusic.length) + 1);
            } while (musicindex == randindex);
            musicindex = randindex;
            loadmusic(musicindex);
            playmusic();
            playingnow();
            break;
    }   
});


showmorebtn.addEventListener("click", ()=>{
    musiclist.classList.toggle("show");
});

hidemusicbtn.addEventListener("click", ()=>{
    showmorebtn.click();
});


const ultag = wrapper.querySelector("ul");

for (let i = 0; i < allmusic.length; i++) {
    let litag = `<li li-index="${i +1}">
                    <div class="row">
                        <span>${allmusic[i].name}</span>
                        <p>${allmusic[i].artist}</p>
                    </div>
                    <audio class="${allmusic[i].src}" src="../img/${allmusic[i].src}.mp3"></audio>
                    <span  id="${allmusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ultag.insertAdjacentHTML("beforeend", litag);

    let liaudioduration = ultag.querySelector(`#${allmusic[i].src}`);
    let liaudiotag = ultag.querySelector(`.${allmusic[i].src}`);

    
    liaudiotag.addEventListener("loadeddata", ()=>{
        let audioduration = liaudiotag.duration;
        let totalmin = Math.floor(audioduration / 60);
        let totalsec = Math.floor(audioduration % 60);
        if (totalsec < 10) {
            totalsec = `0${totalsec}`;
        }
        liaudioduration.innerText = `${totalmin}:${totalsec}`;  
        liaudioduration.setAttribute("t-duration", `${totalmin}:${totalsec}`);  

    });
}


const alllitags = ultag.querySelectorAll("li");
function playingnow() {
    for (let j = 0; j < alllitags.length; j++) {
        let audiotag = alllitags[j].querySelector(".audio-duration");
        if(alllitags[j].classList.contains("playing")){
            alllitags[j].classList.remove("playing");
           let adduration = audiotag.getAttribute("t-duration");
           audiotag.innerText = adduration;
        }

        if(alllitags[j].getAttribute("li-index") == musicindex){
            alllitags[j].classList.add("playing");
            audiotag.innerText = "playing";
        }
    
        alllitags[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element) {
    let getliindex = element.getAttribute("li-index");
    musicindex = getliindex;
    loadmusic(musicindex);
    playmusic();
    playingnow();
}