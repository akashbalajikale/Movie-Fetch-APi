let cl =console.log;

 const showModel =document.getElementById("showModel")
 const backDrop = document.getElementById("backDrop");
 const myModel = document.getElementById("myModel");
 const movieClose = [... document.querySelectorAll(".movieClose")]
 const movieForm = document.getElementById("movieForm");
 const titleControl = document.getElementById("title");
 const imgurlControl = document.getElementById("imgurl");
 const ratingControl = document.getElementById("rating");
 const movieContainer = document.getElementById("movieContainer"); 
 const updateBtn = document.getElementById("updateBtn")
const addBtn = document.getElementById("addBtn"); 
const cancelBtn = document.getElementById("cancelBtn"); 
const loader =document.getElementById('loader')

let baseUrl =`https://fetch-api-df0b1-default-rtdb.asia-southeast1.firebasedatabase.app/`;
// let movieUrl = `${baseUrl}cinema.json`
let movieUrl = `${baseUrl}movies1.json`
 
 const movieTemp = arr =>{
   let result ='';
   arr.forEach(ele =>{
      result +=`
               <div class="col-md-4 col-sm-6 mb-4">
                     <div class="card" id="${ele.id}">
                        <div class="card-header">
                           <strong> ${ele.title}</strong>
                        </div>
                        <div class="card-body">
                           <img class="img-fluid movieImg"src="${ele.imgurl}" alt="">
                        </div>
                        <div class="card-footer"> 
                         <p>${ele.rating}</p>  
                        </div>
                        <div class="card-footer d-flex justify-content-between"> 
                        <button class="btn btn-success" onclick="onEditbtn(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onDeletebtn(this)">Delete</button>
                        </div>
                     </div>
               </div>
      `
   })
   movieContainer.innerHTML =result;
 }
 
 const MakeMoviecall = (methodName, apiUrl, msgBody)=>{
    loader.classList.remove('d-none')
    return fetch(apiUrl, {
        method :methodName,
        body :JSON.stringify(msgBody),
        headers :{
            "autharization" : "bearer JWT token",
            "content-type" : "application/json; charset=UTF-8" 
        }
    })
      .then(res =>{
        return res.json()
      })
 }

 MakeMoviecall("GET", movieUrl)
    .then(res =>{
        let arr =[]
         for(let k in res){
            let o ={
                id: k,
                ...res[k]
            }
            arr.unshift(o)
         }
         
         movieTemp(arr)
    })
    .finally(()=>{
        loader.classList.add('d-none')
    })

const onMovie =(eve)=>{
    eve.preventDefault();
    let obj ={
        title : titleControl.value,
        imgurl : imgurlControl.value,
        rating : ratingControl.value
    }
    MakeMoviecall("POST", movieUrl, obj )
        .then(res =>{ 
            let card = document.createElement('div')
            card.className ="col-md-4 col-sm-6 mb-4";
        
            let result  = `
                            <div class="card" id="${res.name}">
                                <div class="card-header">
                                <strong> ${obj.title}</strong>
                                </div>
                                <div class="card-body">
                                <img class="img-fluid movieImg"src="${obj.imgurl}" alt="">
                                </div>
                                <div class="card-footer"> 
                                <p>${obj.rating}</p>  
                               </div>
                               <div class="card-footer d-flex justify-content-between"> 
                               <button class="btn btn-success" onclick="onEditbtn(this)">Edit</button>
                               <button class="btn btn-danger" onclick="onDeletebtn(this)">Delete</button>
                               </div>
                        </div>
            `
                card.innerHTML = result;
                cl(card)
                movieContainer.prepend(card)

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Post create successfully',
                    showConfirmButton: false,
                    timer: 1500
                  })
        })
        .catch(cl)
        .finally(()=>{
            onshowmodelhandler()
            movieForm.reset()
        loader.classList.add('d-none')

        })
}
 
const onEditbtn =(e)=>{
     let editId =e.closest('.card').id;
     localStorage.setItem("editId", editId)
     let editUrl =`${baseUrl}movies1/${editId}.json`
     MakeMoviecall("GET", editUrl)
        .then(res =>{
            titleControl.value = res.title;
            imgurlControl.value = res.imgurl;
            ratingControl.value = res.rating;
        })
        .catch(cl)
        .finally(()=>{
            onshowmodelhandler()
            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
            loader.classList.add('d-none')   
        })
}

const onupdateBtn =()=>{
    let updatId =localStorage.getItem("editId")
    localStorage.removeItem("editId")
    let updatUrl =`${baseUrl}movies1/${updatId}.json`
   let updatobj ={
    title : titleControl.value,
    imgurl : imgurlControl.value,
    rating : ratingControl.value
   }
   MakeMoviecall("PATCH", updatUrl, updatobj)
    .then(data =>{
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'your movie is updated',
            showConfirmButton: false,
            timer: 1000
          })
        let datapatch = [...document.getElementById(updatId).children]
        // cl(child)
        datapatch[0].innerHTML =` <strong> ${updatobj.title}</strong>`;
        datapatch[1].innerHTML =` <img class="img-fluid movieImg"src="${updatobj.imgurl}" alt="">`;
        datapatch[2].innerHTML = 
                                `<p>10/${updatobj.rating}</p>
                                  
                                `
    })
    .catch(cl)
    .finally(()=>{
        onshowmodelhandler()
        movieForm.reset()
        loader.classList.add('d-none')
        updateBtn.classList.add("d-none")
        addBtn.classList.remove("d-none")
    })
}

const onDeletebtn =(e)=>{
    let deletId =e.closest('.card').id;
    let deletUrl =`${baseUrl}movies1/${deletId}.json`
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
     
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'your has been deleted',
                showConfirmButton: false,
                timer: 1000
              })
            MakeMoviecall("DELETE", deletUrl)
            .then(res =>{
                let dltmovie =document.getElementById(deletId)
                dltmovie.remove()
                movieForm.reset()
            })
            .catch(cl)
            .finally(()=>{
                // onshowmodelhandler()
                
                loader.classList.add('d-none')
            })
        }else{
            return
        }
      })     
   }
const  onshowmodelhandler =(eve)=>{
    backDrop.classList.toggle("visible");
    myModel.classList.toggle("visible");
     updateBtn.classList.add('d-none')
    addBtn.classList.remove('d-none')
    
 }
 const onCancel =()=>{
    movieForm.reset()
    updateBtn.classList.add('d-none')
    addBtn.classList.remove('d-none')
 }

 showModel.addEventListener("click", onshowmodelhandler)
 movieClose.forEach(ele => ele.addEventListener("click", onshowmodelhandler))
 movieForm.addEventListener("submit", onMovie)
 updateBtn.addEventListener("click", onupdateBtn)
 cancelBtn.addEventListener("click", onCancel)




 