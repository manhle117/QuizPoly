var app = angular.module("myApp",['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'home.html',
   })
    .when('/quiz/:id/:name',{
        templateUrl:'quiz-app.html',
        controller:'quizCtrl'
    })
    .when('/subjects',{
        templateUrl:'subjects.html',
        controller:'subjectCtrl'
   })
});
app.directive('quizfpoly',function(quizFactory,$routeParams){
    return{
        restrict : 'AE',
        scope: {},
        templateUrl: 'template-quiz.html',
        link: function(scope, elem, attrs){
            scope.start = function(){
                quizFactory.getQuestions().then(function(){
                    scope.subjectsName = $routeParams.name;
                    scope.id = 1;
                    scope.quizOver = false; // chưu hoàn thành
                    scope.inProgess = true;
                    scope.getQuestion();
                })               
            };
            scope.reset = function(){
                scope.inProgess = false;
                scope.score = 0;
            };
            scope.getQuestion = function(){
                var quiz = quizFactory.getQuestion(scope.id);
                if(quiz){
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;
                }else{
                    scope.quizOver = true;
                }
              
             
            }
            scope.checkAnswer = function(){
                // alert('answer');
                if(!$('input[name = answer]:checked').length) return;
                var ans = $('input[name = answer]:checked').val();
                if(ans == scope.answer){
                    //alert('Đúng');
                    scope.score ++;
                    scope.correctAns = true;
                }else{
                    //alert("sai");
                    scope.correctAns = false;
                }
                scope.answerMode = false;
            }
            scope.nextQuestion = function(){
                    scope.id ++;
                    scope.getQuestion();
                
            };
            

            scope.reset();
        }
    }
});

app.factory('quizFactory',function($http,$routeParams){
    return{
        getQuestions: function(){
            return   $http.get('../db/Quizs/'+ $routeParams.id+'.js').then(function(res){
                questions = res.data;
            });
        },
        getQuestion: function(id){
            var randomItem = questions[Math.floor(Math.random()*questions.length)];
            var count = questions.length;
            if(count > 10){
                count = 10;
            }
            if(id < count){
                return randomItem;
            }else{
                return false;
            }
        }
    }
});


// Ctrl đăng ký
app.controller('myctrlRegister', function($rootScope, $scope) {
     $scope.students= [];
    $http.get("../db/Students.js").then(function(response){
        $scope.students = response.data;
    });
    $scope.register = function() {
        var ig = true;
        for(var i=0; i<=  $scope.students.length; i++){
            if($scope.students[i].username == $scope.username){
                ig = false;
                return;
            };

        };
        if (ig == true) {
            alert("Dang nhap thanh cong");
            }else{
                alert("Taif khoan da ton tai");
            }
       
        
    };
    
});

// end  Ctrl đăng ký
//controller Subject
app.controller("subjectCtrl",function($scope, $http){
    $scope.subjects= [];
    $http.get("../db/Subjects.js").then(function(response){
        $scope.list_subjects = response.data;
    })
 
});
//End controller Subject
//controller quizs
app.controller("quizCtrl",function($scope, $http,$routeParams,quizFactory){
    // $http.get('../db/Quizs/'+ $routeParams.id +'.js').then(function(response){
    //     quizFactory.questions = response.data;
    // })
 
});
