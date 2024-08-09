
const navbar =['feed','messages','video','event','pages','groups','market','blog'];
path = window.location.pathname.replace("/","")
if (navbar.includes(path)){
    document.querySelector(`.${path}`).classList.add('active')
}

//handle ajax
if(path== 'messages'){

    //initial socket 
    let ws
    ws = new WebSocket('ws://localhost:8081','echo-protocol');
    ws.onopen = function() {
        console.log('WebSocket connected');
        ws.send(JSON.stringify({type: 'register', userId : mainUserID}))
      };
    
    //get 
    const mainUserID = jwt_decode(document.cookie).id
    const chatForm  = document.querySelector('.chat')
    const textareaElement = chatForm.querySelector('textarea');
    const viewChat = document.querySelector('.views')
    const user_id = document.querySelector('.user').dataset.userId
    const userContainer = document.querySelector('.userlist')
    const nameUser = document.querySelector('.name-user')
    const avatarUser = [...document.querySelectorAll('.avatar-user img')]
    const usernameUser = document.querySelector('.username-user')  
    const fullnameUser = document.querySelector('.fullname-user')  
    const profileUser = document.querySelector('.user-profile')  
    const chatlist = document.querySelector('.chatlist')  
    let mainUser 
    
   
    fetch('/userlist')
    .then(response => {
      // Check if the request was successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Parse the JSON response
      return response.json();
    })
    .then(data => {
        //getMainuser  = 
       [mainUser] = data.filter(element =>{
            return element.userid == mainUserID
        })
        console.log(mainUser)
      // Do something with the JSON data
      data.forEach((element,index) => {
        if(index == (data.length - 1) ){
            fullnameUser.textContent=nameUser.textContent = element.firstname + " " + element.lastname
            usernameUser.textContent = `@${element.lastname}`
            profileUser.setAttribute('href',`/timeline?id=${element.userid}`)
            avatarUser.filter((image)=>{
            image.setAttribute('src',element.avatar) 
            //fill chat 
            fetch(`/messageDetail/${element.userid}`)
            .then(response => {
                return response.json()
            })
            .then(chatdata => {
                //frist element 
                
                let message = ''
                if(chatdata.length != 0){
                    chatdata.forEach(chatElement => {
                        if (chatElement.userSender_id == element.userid ){
                            
                            message +=`
                            <div class="flex gap-3">
                                    <img src="${element.avatar}" alt="" class="w-9 h-9 rounded-full shadow">
                                    <div class="px-4 py-2 rounded-[20px] max-w-sm bg-secondery"> ${chatElement.content} </div>
                                </div>
                            `
                        }else {
                            message +=`
                            <div class="flex gap-2 flex-row-reverse items-end mt-3">
                                <img src="${mainUser.avatar}" alt="" class="w-5 h-5 rounded-full shadow">
                                <div class="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow"> ${chatElement.content}</div>
                            </div>`
                        }
                    })
                    chatlist.innerHTML = ''
                    chatlist.insertAdjacentHTML('afterbegin',message)
                }
                else {
                    chatlist.innerHTML = ''
                }
            })
            })

        }
         
        let content = `
        <a href="#" class="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery user" data-user-id="${element.userid}">
        <div class="relative w-14 h-14 shrink-0"> 
            <img src="${element.avatar}" alt="" class="object-cover w-full h-full rounded-full">
            <div class="w-4 h-4 absolute bottom-0 right-0  bg-green-500 rounded-full border border-white dark:border-slate-800"></div>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
                <div class="mr-auto text-sm text-black dark:text-white font-medium">${element.firstname + " " + element.lastname}</div>
                <div class="text-xs font-light text-gray-500 dark:text-white/70">09:40AM</div> 
            </div>
            <div class="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">Love your photos 😍</div>
        </div>
    </a>
        `
    userContainer.insertAdjacentHTML("afterbegin",content)
        
     });
     //handle select chat 
      [...document.querySelectorAll('.user')].forEach(element =>{
        element.addEventListener('click',(e)=>{
            if(element.hasChildNodes(e.target)){
                const [userdata] = data.filter((user)=>{
                  
                      return user.userid == element.dataset.userId
                })
                fullnameUser.textContent=nameUser.textContent = userdata.firstname + " " + userdata.lastname
                usernameUser.textContent = `@${userdata.lastname}`
                profileUser.setAttribute('href',`/timeline?id=${userdata.userid}`)
                avatarUser.filter((image)=>{
                image.setAttribute('src',userdata.avatar)
                })

            //fillchat
            fetch(`/messageDetail/${userdata.userid}`)
            .then(response => {
                return response.json()
            })
            .then(chatdata => {
                //frist element 
                let message = ''
                if(chatdata.length != 0){
                    chatdata.forEach(chatElement => {
                        if (chatElement.userSender_id == userdata.userid ){
                            
                            message +=`
                            <div class="flex gap-3">
                                    <img src="${userdata.avatar}" alt="" class="w-9 h-9 rounded-full shadow">
                                    <div class="px-4 py-2 rounded-[20px] max-w-sm bg-secondery"> ${chatElement.content} </div>
                                </div>
                            `
                        }else {
                            message +=`
                            <div class="flex gap-2 flex-row-reverse items-end mt-3">
                                <img src="${mainUser.avatar}" alt="" class="w-5 h-5 rounded-full shadow">
                                <div class="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow"> ${chatElement.content}</div>
                            </div>`
                        }
                    })
                    chatlist.innerHTML = ''
                    chatlist.insertAdjacentHTML('afterbegin',message)
                }
                else {
                    chatlist.innerHTML = ''
                }
            })
            }
          })
      })
      
      ws.onmessage = function(event) {
        //handl insert HTML
        
     let  messageObj = JSON.parse(event.data)
     const [usersender] = data.filter(element => {
            return element.userid == messageObj.from 
        })
        if(messageObj.from == profileUser.getAttribute('href').split('=')[1]){
         
           
           let receiveHTML =`
            
            <div class="flex gap-3">
                    <img src="${usersender.avatar}" alt="" class="w-9 h-9 rounded-full shadow">
                    <div class="px-4 py-2 rounded-[20px] max-w-sm bg-secondery"> ${messageObj.message} </div>
                </div>
            `
             chatlist.insertAdjacentHTML('beforeend',receiveHTML)
            
    
          }else if (messageObj.from == mainUserID){
            let senderHTML = `
                                    <div class="flex gap-2 flex-row-reverse items-end mt-3">
                                        <img src="${mainUser.avatar}" alt="" class="w-5 h-5 rounded-full shadow">
                                        <div class="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow"> ${messageObj.message}</div>
                                    </div>`
          chatlist.insertAdjacentHTML('beforeend',senderHTML)
          };
        }


    })

    //handl event submit 
    chatForm.addEventListener('submit',(event) => {
        event.preventDefault();
        if (textareaElement.value != ""){
            const urlregex = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.*$/

            const  data = {
                type : "message",
                sender_id : mainUserID,
                revceiver_id : profileUser.getAttribute('href').split('=')[1],
                message : textareaElement.value,
                type_message :  urlregex.test(textareaElement.value) ? "url" : "text"
            }
            const jsonString = JSON.stringify(data);
            ws.send(jsonString);
    
          textareaElement.value=''
        }
        
    })

    
}
if(path == 'setting'){
    //get element 
    
  let buttonSubmit = document.querySelector('.buttonSubmit_Avatar')
  const fileInput = document.querySelector('.avatar_file');
  const formData = new FormData();
 
  
  //add event 
  buttonSubmit.addEventListener('click',async(e) => {
    formData.append('file', (fileInput.files)[0]);
   //handl post request 
   response = await fetch('/setting/upload-file',{
    method: 'POST',
    body: formData
   })
   if(response.status == 200){
    const data =  await response.text()
    alert(data)
    window.location.href='/setting'
   }else{
    alert('Something went wrong')
   }
  })
}
// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
    } else {
    document.documentElement.classList.remove('dark')
    }

// Whenever the user explicitly chooses light mode
localStorage.theme = 'light'

// Whenever the user explicitly chooses dark mode
localStorage.theme = 'dark'

// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem('theme')



// add post upload image 
document.getElementById('addPostUrl').addEventListener('change', function(){
if (this.files[0] ) {
    var picture = new FileReader();
    picture.readAsDataURL(this.files[0]);
    picture.addEventListener('load', function(event) {
    document.getElementById('addPostImage').setAttribute('src', event.target.result);
    document.getElementById('addPostImage').style.display = 'block';
    });
}
});


// Create Status upload image 
document.getElementById('createStatusUrl').addEventListener('change', function(){
if (this.files[0] ) {
    var picture = new FileReader();
    picture.readAsDataURL(this.files[0]);
    picture.addEventListener('load', function(event) {
    document.getElementById('createStatusImage').setAttribute('src', event.target.result);
    document.getElementById('createStatusImage').style.display = 'block';
    });
}
});


// create product upload image
document.getElementById('createProductUrl').addEventListener('change', function(){
if (this.files[0] ) {
    var picture = new FileReader();
    picture.readAsDataURL(this.files[0]);
    picture.addEventListener('load', function(event) {
    document.getElementById('createProductImage').setAttribute('src', event.target.result);
    document.getElementById('createProductImage').style.display = 'block';
    });
}
});








    