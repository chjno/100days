var parentCounts = [];
var maxParentCount = 0;
$('body :visible').each(function (){
  var parentCount = $(this).parentsUntil('body').length;

  if (parentCount > 0){

    this.style.filter = 'blur(' + (parentCount / 8.0) + 'px)';
    // $(this).addClass(parentCount + '-parents');

    // if (parentCounts.indexOf(parentCount) == -1){
    //   parentCounts.push(parentCount);
    //   newStyle(parentCount);

    //   if (maxParentCount < parentCount){
    //     maxParentCount = parentCount;
    //   }
    // }
  }
});


// function newStyle(parentCount){
//   var style = document.createElement('style');
//   style.type = 'text/css';
//   style.innerHTML = '.' + parentCount + '-parents { filter: blur(' + 'px); }';
//   document.getElementsByTagName('head')[0].appendChild(style);
  
// }