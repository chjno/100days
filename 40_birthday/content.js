function morePosts(){
  var bday = $('._4-u2.mbm._5jmm._5pat._5v3q._4-u8:contains(on your Timeline for your birthday)');
  if ($(bday).find('._44b2').length > 0){
    $(bday).find('._44b2')[0].click();
    setTimeout(morePosts, 200);
  } else {
    likeBdayPosts(bday);
  }
}
morePosts();

function likeBdayPosts(bday){
  var list = $(bday).find('.uiList.uiCollapsedList');
  var wishes = $(list).find('li');
  var likeButts = $(wishes).find('.UFILikeLink._4x9-._4x9_._48-k');
  $(likeButts).each(function (){
    if (this.hasAttribute('aria-pressed')){
      if (this.getAttribute('aria-pressed') == 'false'){
        this.click();
      }
    }
  });
}
