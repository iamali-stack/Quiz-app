// https://opentdb.com/api.php?amount=10&category=14&difficulty=hard

const myForm=document.querySelector('form')
const categoryInput=document.querySelector("#categoryMenu")
const diffculityInput=document.querySelector("#difficultyOptions")
const numberInput=document.querySelector("#questionsNumber")
const myRow = document.querySelector('.questions .container .row');    let myQuiz;
    let allQuestions;
    

    
    myForm.addEventListener('submit',async function(e){
        e.preventDefault()
       let category=categoryInput.value
       let difficulty=diffculityInput.value
       let number=numberInput.value
       
         myQuiz=new Quiz(category,difficulty,number)
         allQuestions= await myQuiz.getAllQuestions()
           let myQuestions=new Questions(0)
             console.log(myQuestions)
             myForm.classList.replace('d-flex','d-none')
          myQuestions.displayQuestions()
    })

    class Quiz{
        constructor(category,difficulty,number){
            this.category=category
            this.difficulty=difficulty
            this.number=number
            this.score=0
        }

        getApi(){
           return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`
        }
        async getAllQuestions(){
            let response=await fetch(this.getApi())
            let data=await response.json()
            return data.results

        }
        showResult(){
          return `
          <div
            class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
          >
            <h2 class="mb-0"> ${this.sceore==this.number ? "Congratulations 🎉": `your score is ${this.score}`}
            </h2>
            <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
          </div>
        `;
        }
    }
 
   
   class Questions{
    constructor(index){
        this.index=index
        this.questions=allQuestions[index].question
        this.correct_answer=allQuestions[index].correct_answer
        this.incorrect_answers=allQuestions[index].incorrect_answers
        this.category=allQuestions[index].category
        this.allAnswers=this.getAllAnswer()
        this.is_answered=false
    }
    getAllAnswer(){
        let allAnswer=[...this.incorrect_answers,this.correct_answer]
        allAnswer.sort()
        return allAnswer
        
    }
    
    displayQuestions(){
        const questionMarkUp = `
          <div class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
            <div class="w-100 d-flex justify-content-between">
              <span class="btn btn-category">${this.category}</span>
              <span class="fs-6 btn btn-questions"> ${this.index+1} of ${allQuestions.length} Questions</span>
            </div>
            <h2 class="text-capitalize h4 text-center">${this.questions}</h2>  
            <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
            ${this.allAnswers.map((answer) => `<li>${answer}</li>`).join("")}
            </ul>
            <h2 class="text-capitalize text-center score-color h3 fw-bold">
            <i class="bi bi-emoji-laughing"></i> Score:${myQuiz.score}</h2>        
          </div>
        `
       myRow.innerHTML=questionMarkUp

        let allchoices = document.querySelectorAll('.choices li');
        console.log(allchoices)
        allchoices.forEach ((li)=>{
          li.addEventListener('click', (e) => {
            
            this.checkAnswer(li)
            this.nextQuestion()
        })
      }

        )}
        // msh fahem
      checkAnswer(li){
        if(this.is_answered===false){
            
           this.is_answered=true
            if(li.innerHTML===this.correct_answer){
            myQuiz.score++
            console.log('correct')
            li.classList.add('correct' ,'animate__animated','animate__bounce') 

        }else{
            console.log('wrong')
            li.classList.add('wrong' ,'animate__animated','animate__shakeX')
        }
        }
      
  
      }
      nextQuestion(){
        this.index++
        setTimeout(()=>{
          if(this.index<allQuestions.length){
            
            let myNewQuestion=new Questions(this.index)
            myNewQuestion.displayQuestions()
          }else{
            let result=myQuiz.showResult()
            myRow.innerHTML=result
            document.querySelector('.again').addEventListener('click',function(){
              window.location.reload()
            });
          }
        },1500);
      }
    }
   



