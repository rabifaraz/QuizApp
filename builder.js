var firebaseConfig = {
    apiKey: "AIzaSyCqTXiRBEnMHZGEu14uE_57sslvcwdlV_I",
    authDomain: "a7layout-7ed56.firebaseapp.com",
    databaseURL: "https://a7layout-7ed56-default-rtdb.firebaseio.com",
    projectId: "a7layout-7ed56",
    storageBucket: "a7layout-7ed56.appspot.com",
    messagingSenderId: "1059789910437",
    appId: "1:1059789910437:web:017aa189a695f215a6b84c"
  };
  
  var app = firebase.initializeApp(firebaseConfig);

function setvalues(e) {
    e.preventDefault()
    
    var formData = new FormData(document.getElementById('formBuilder'))
    var question = {
        question: formData.get('question'),
        choices: [formData.get('opt1'), formData.get('opt2'), formData.get('opt3'), formData.get('opt4')].filter(opt => !!opt),
        answer: formData.get('answer')
    }
    // if(!question.question || !question.answer || !question.choices.length) return alert('Please fill required data')

    firebase.database().ref('questions/' + (Math.random() * 100).toFixed(0)).set(question);
    document.getElementById('formBuilder').reset()
    window.alert('Sucessfully set')

}