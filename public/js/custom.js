// -------Read More-------
$(document).ready(function () {
    $('.moreless-button a').click(function() {
        $('.moretext').slideToggle();
        if ($('.moreless-button a').text() == "READ MORE") {
          $(this).text("READ LESS")
          $('.moreless-button a').addClass('read_less')
          
        } else {
          $(this).text("READ MORE")
          $('.moreless-button a').removeClass('read_less')
        }
    });
    
    $('.less_more a').click(function() {
      $('.more_text').slideToggle();
      if ($('.less_more a').text() == "Learn More") {
        $(this).text("Learn less")
        $(this).text("READ LESS").addClass('read_less')
      } else {
        $(this).text("Learn More")
      }
  });

    // slider
    $(".v_slider").slick({    
      infinite: true,     
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay:true,
      autoplaySpeed:1500,
      arrows:true,
      dots:false,          
    });
    $(".testimonial_slider").slick({    
        infinite: true,     
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay:false,
        autoplaySpeed:1500,
        arrows:true,
        dots:false,    
        responsive: [
          {
            breakpoint: 1023,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,              
              infinite:true,
            },
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
            {
              breakpoint: 575,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
          },
          
        ],        
      });
      $(".product_slider").slick({    
        infinite: true,     
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay:false,
        autoplaySpeed:1500,
        arrows:true,
        dots:false,    
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,              
              infinite:true,
            },
          },
          {
            breakpoint: 800,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
            {
              breakpoint: 575,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
          },
          
        ],        
      });
       
// thumbnail slider
$('.slider-for').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  adaptiveHeight: true,
  asNavFor: '.slider-nav'
});

$('.slider-nav').slick({
slidesToShow: 4,
slidesToScroll: 1,
asNavFor: '.slider-for',
dots: false,
arrows: true,
centerMode: true,
focusOnSelect: true,

responsive: [
  {
    breakpoint: 1980,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 1,              
      infinite:true,
    },
  },
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 1,              
      infinite:true,
    },
  },
  
],    
});            
});

// list grid view
(function(){  
  var icon = document.getElementsByClassName('icon');
  var products = document.getElementsByClassName('list-view-filter'); 
  function hasClass(elem, className) {
    return elem.classList.contains(className);
  }  
  for (var i = 0, len = icon.length; i < len; i++) {   
    icon[i].addEventListener('click', function() {      
      if (hasClass(this, 'active')) {        
        return;      
      } else {       
        for (var j = 0, len = icon.length; j < len; j++) {          
          icon[j].classList.toggle('active');
        }       
        products[0].classList.toggle('list');
        products[0].classList.toggle('grid');
      }
    });
  }
})();

// Tabing

// Show the first tab by default
$('.tabs-stage div').hide();
$('.tabs-stage div:first').show();
if( $(window).width() < 576 ) {
  $('.tabs-stage div:first').hide(); 
}
$('.tabs-nav li:first').addClass('tab-active');

// Change tab class and display content
$('.tabs-nav a').on('click', function(event){
  event.preventDefault();
  $('.tabs-nav li').removeClass('tab-active');
  $(this).parent().addClass('tab-active');
  $('.tabs-stage div').hide();
  $($(this).attr('href')).show();
});

 

// Mmenu

$(document).on('ready', function() {            
  new Mmenu( "#menu", {        
      "navbars": [          
          {
            type: 'tabs',
            content: [
                '<a href="#panel-menu"><i class="fa fa-bars"></i> <span>Menu</span></a>',
                '<a href="#panel-account"><img src="images/pink_user.png" width="20px" height="20px" class="user_menu"> <span>Account</span></a>',                
            ],
        },      
      ],
      "extensions": [
        "position-right"
     ]
   });                  
}); 




//  search overlay
$(document).ready(function() {
	$(".search_input").click(function() {
	   $(".togglesearch").toggle();
	   
	 });
});
function openSearch() {
  document.getElementById("myOverlay").style.display = "block";
}

function closeSearch() {
  document.getElementById("myOverlay").style.display = "none";
}



// Acordion


$(".sidebar_left ").on("click", function() {
  if ($(this).hasClass("active")) {
    $(this).removeClass("active");
    $(this)
      .siblings(".product_list_content .list_content_left")
      .slideUp(200);
  }else {
    
    $(".product_list_content .sidebar_left").removeClass("active");
    $(this).addClass("active");
    $(".product_list_content .list_content_left").slideUp(200);
    $(this)
      .siblings(".product_list_content .list_content_left")
      .slideDown(200);
  }
});

if( $(window).width() < 1024 ) {
  $(".content_left_element > h4").on("click", function() {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(this)
        .siblings(".sidebar_list")
        .slideUp(200);
      $(".content_left_element > h4 span")
        .removeClass("minus")
        .addClass("plus");
    } else {
      $(".content_left_element > h4 span")
        .removeClass("minus")
        .addClass("plus");
      $(this)
        .find("span")
        .removeClass("plus")
        .addClass("minus");
      $(".content_left_element > h4").removeClass("active");
      $(this).addClass("active");
      $(".sidebar_list").slideUp(200);
      $(this)
        .siblings(".sidebar_list")
        .slideDown(200);
    }
  });
}

// category accordion

jQuery(function ($) {
  if( $(window).width() > 1023 ) {
    $('.toggle_categories:first').next().show()
  } 
  $('.toggle_categories').on('click', function () {    
    $(this).next().slideToggle(200);    
    $(this).toggleClass('open', 200);
  });  
  });

  if( $(window).width() < 1024 ) {
    $('.category_left_inner h4').on('click', function () {    
      $(this).next().slideToggle(200);    
      $(this).toggleClass('open', 200);
    });  
  }

  $('.review_click').click(function(){
    var attr = $(this).attr('href')
    $('.tabs-nav  li').removeClass('tab-active');    
    $('.tabs-nav li.tab_3').addClass('tab-active');    
    $('.tabs-stage#tab-3').show();
    $(attr).show();    
    });
  
    
   
  // $('.review_click').on('click', function(e){
  //     e.preventDefault();
  //     const elem = this;   
  //     $('html, body').animate({
  //         scrollTop: $( $(elem).attr('href') ).offset().top
  //      }, 2000);
  // });
    




$(window).scroll(function() {
  if ($(this).scrollTop() >= 50) {        
      $('.scroll_top').fadeIn(200);   
  } else {
      $('.scroll_top').fadeOut(200);   
  }
});
$('.scroll_top').click(function() {      
  $('body,html').animate({
      scrollTop : 0                      
  }, 500);
});

$('.review_click').click(function(event) {     
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
        &&
        location.hostname == this.hostname
      ) {
      
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
       
        if (target.length) {
         
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000, function() {
          
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { 
              return false;
            } else {
              $target.attr('tabindex','-1'); 
              $target.focus(); 
            };
          });
        }
      }
    });

// $('.review_click').click(function(){
     
//   const elem = this;   
//   $('html, body').animate({
//       scrollTop: $( $(elem).attr('href') ).offset().top
//    }, 2000);  
//   });

