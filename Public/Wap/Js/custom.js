// JavaScript Document
var fn=function ($) {
	//loading...
	$(window).load(function() { 
		$("#status").fadeOut(); // will first fade out the loading animation
		$("#preloader").delay(400).fadeOut("slow"); // will fade out the white DIV that covers the website.
	});
	//左边+右边 = 黑色层
	$(document).ready(function() {
		screen_width = $(document).width();
		screen_height = $(document).height();
		$('.all-elements').animate({
			//animate() 方法执行 CSS 属性集的自定义动画。
			//该方法通过CSS样式将元素从一个状态改变为另一个状态。CSS属性值是逐渐改变的，这样就可以创建动画效果。
			minHeight: 100+'%'
		});

	//$('.header-tip').delay(3000).slideUp(500);
		$('.header-tip').addClass('hide-header-tip');
		$('.show-submenu').click(function(){
		//$(this).find('submenu').toggle();
		//$(this).parent().find('.submenu').slideToggle(200);
		//toggleClass() 对设置或移除被选元素的一个或多个类进行切换。
		$(this).parent().find('.submenu').toggleClass('submenu-active');
		$(this).toggleClass('show-submenu-active');
		return false;
	});
//	var scroll_here_left = $('.scroll-here-left').offset().top;
//	$('.snap-drawer-left').animate({
//		scrollTop: scroll_here_left
//	}, 1800, 'easeOutExpo');
//	

//	var scroll_here_right = $('.scroll-here-right').offset().top;
//	$('.snap-drawer-right').animate({
//		scrollTop: scroll_here_right
//	}, 1800, 'easeOutExpo');
	window.addEventListener('load', function() {
		//addEventListener() 方法用于向指定元素添加事件句柄。
		FastClick.attach(document.body);
		//FastClick消除点击延时提高程序的运行效率.
		//使用 removeEventListener()方法来移除.addEventListener()方法添加的事件句柄。
	}, false);	

	//Submenu Deploy//
	$('.swipebox').click(function(){ 
		$('.gallery').hide(0);
		$('.portfolio-wide').hide(0);
	});	
	$('.open-nav').click(function() {
		//$(this).toggleClass('remove-sidebar');
		if( snapper.state().state=="left" ){
			snapper.close();
		} else {
			snapper.open('left');
		}
		return false;
	});

	$('.open-socials').click(function() {
		//$(this).toggleClass('remove-sidebar');
		if( snapper.state().state=="right" ){
			snapper.close();
		} else {
			snapper.open('right');
		}
		return false;
	});

	$('#menu_chats_a').click(function() {
		snapper.close();
		snapper.open('right');
		return false;
	});

	$('.sidebar1-close').click(function() {
		snapper.close();
	});
	$('.close-menu').click(function() {
		snapper.close();
		return false;
	});	

	var snapper = new Snap({
	  element: document.getElementById('content')
	});
	var endDate = "June 7, 2015 15:03:25";
	$('.countdown').countdown({
	  date: endDate,
	  render: function(data) {
		$(this.el).html(
		"<div class='countdown-box box-years'><div class='countdown-years'>" + this.leadingZeros(data.years, 2) + 
		"</div><span>years</span></div><div class='countdown-box box-days'><div class='countdown-days'>" + this.leadingZeros(data.days, 2) + 
		"</div><span>days</span></div><div class='countdown-box box-hours'><div class='countdown-hours'>" + this.leadingZeros(data.hours, 2) + 
		"</div><span>hours</span></div><div class='countdown-box box-minutes'><div class='countdown-minutes'>" + this.leadingZeros(data.min, 2) + 
		"</div><span>min</span></div><div class='countdown-box box-seconds'><div class='countdown-seconds'>" + this.leadingZeros(data.sec, 2) + 
		"</div><span>sec</span></div>");
	  }
	});

	//Animate.css scroll to begin animation //	
	var wow = new WOW(
	  {
		boxClass:     'animate',      // animated element css class (default is wow)
		animateClass: 'animated',     // animation css class (default is animated)
		offset:       0,              // distance to the element when triggering the animation (default is 0)
		mobile:       true,           // trigger animations on mobile devices (true is default)
	  }
	);
	wow.init();
	//通常情况下，一般初始化都由构造函数负责，也就是在构造对象的同时，进行初始化。

	//Go up
	$('.footer-up').click(function() {
		$('#content').animate({
			scrollTop:0
		}, 800, 'easeInOutQuad');
		return false;
	});

	//Portfolio//
	$('.adaptive-one-activate').click(function() {
		$('.portfolio-adaptive').removeClass('adaptive-three');
		$('.portfolio-adaptive').removeClass('adaptive-two');
		$('.portfolio-adaptive').addClass('adaptive-one');
		$(this).addClass('active-adaptive-style');
		$('.adaptive-two-activate, .adaptive-three-activate').removeClass('active-adaptive-style');
		return false;
	});

	$('.adaptive-two-activate').click(function() {
		$('.portfolio-adaptive').removeClass('adaptive-three');
		$('.portfolio-adaptive').addClass('adaptive-two');
		$('.portfolio-adaptive').removeClass('adaptive-one');	
		$(this).addClass('active-adaptive-style');	
		$('.adaptive-three-activate, .adaptive-one-activate').removeClass('active-adaptive-style');
		return false;
	});

	$('.adaptive-three-activate').click(function() {
		$('.portfolio-adaptive').addClass('adaptive-three');
		$('.portfolio-adaptive').removeClass('adaptive-two');
		$('.portfolio-adaptive').removeClass('adaptive-one');
		$(this).addClass('active-adaptive-style');	
		$('.adaptive-two-activate, .adaptive-one-activate').removeClass('active-adaptive-style');
		return false;
	});

	//Close Sharebox//
	$('.open-sharebox').click(function() {
		$('.sharebox-wrapper').fadeIn(200);
	});

	$('.close-sharebox').click(function() {
		$('.sharebox-wrapper').fadeOut(200);
	});	

	$('.open-loginbox').click(function() {
		$('.loginbox-wrapper').fadeIn(200);
	});

	$('.close-loginbox').click(function() {
		$('.loginbox-wrapper').fadeOut(200);
	});

	//Checkboxes
	$('.checkbox-one').click(function() {
		$(this).toggleClass('checkbox-one-checked');
		return false;
	});

	$('.checkbox-two').click(function() {
		$(this).toggleClass('checkbox-two-checked');
		return false;
	});

	$('.checkbox-three').click(function() {
		$(this).toggleClass('checkbox-three-checked');
		return false;
	});	

	$('.radio-one').click(function() {
		$(this).toggleClass('radio-one-checked');
		return false;
	});	

	$('.radio-two').click(function() {
		$(this).toggleClass('radio-two-checked');
		return false;
	});

	//Notifications
	$('.tap-dismiss-notification').click(function() {
		$(this).slideUp(200);
		return false;
	});

	$('.close-big-notification').click(function() {
		$(this).parent().slideUp(200);
		return false;
	});

	$('.notification-top').addClass('show-notification-top');

	$('.hide-top-notification').click(function(){
		$('.notification-top').removeClass('show-notification-top');
	});

	//Tabs 
	$('.tab-but-1').click(function() {
		$('.tab-but').removeClass('tab-active');
		$('.tab-but-1').addClass('tab-active');
		$('.tab-content').slideUp(200);
		//通过使用滑动效果，隐藏被选元素，如果元素已显示出来的话。
		//以滑动方式显示隐藏的 <p> 元素：
		$('.tab-content-1').slideDown(200);	
		return false;	
	});

	$('.tab-but-2').click(function() {
		$('.tab-but').removeClass('tab-active');
		$('.tab-but-2').addClass('tab-active');
		$('.tab-content').slideUp(200);
		$('.tab-content-2').slideDown(200);
		return false;		
	});	

	$('.tab-but-3').click(function() {
		$('.tab-but').removeClass('tab-active');
		$('.tab-but-3').addClass('tab-active');
		$('.tab-content').slideUp(200);
		$('.tab-content-3').slideDown(200);	
		return false;	
	});	

	$('.tab-but-4').click(function() {
		$('.tab-but').removeClass('tab-active');
		$('.tab-but-4').addClass('tab-active');
		$('.tab-content').slideUp(200);
		$('.tab-content-4').slideDown(200);
		return false;		
	});	

	$('.tab-but-5').click(function() {
		$('.tab-but').removeClass('tab-active');
		$('.tab-but-5').addClass('tab-active');
		$('.tab-content').slideUp(200);
		$('.tab-content-5').slideDown(200);	
		return false;	
	});	

	//Toggles
	$('.deploy-toggle-1').click(function() {
		$(this).parent().find('.toggle-content').slideToggle(200);
		$(this).toggleClass('toggle-1-active');
		return false;
	});

	$('.deploy-toggle-2').click(function() {
		$(this).parent().find('.toggle-content').slideToggle(200);
		$(this).toggleClass('toggle-2-active');
		return false;
	});

	$('.deploy-toggle-3').click(function() {
		$(this).parent().find('.toggle-content').slideToggle(200);
		$(this).find('em strong').toggleClass('toggle-3-active-ball');
		$(this).find('em').toggleClass('toggle-3-active-background');
		return false;
	});

	//Submenu Nav
	$('.submenu-nav-deploy').click(function() {
		$(this).toggleClass('submenu-nav-deploy-active');
		$(this).parent().find('.submenu-nav-items').slideToggle(200);
		return false;
	});

	//Sliding Door
	$('.sliding-door-top').click(function() {
		$(this).animate({
			left:'101%'
		}, 500, 'easeInOutExpo');
		return false;
	});

	$('.sliding-door-bottom a em').click(function() {
		$(this).parent().parent().parent().find('.sliding-door-top').animate({
			left:'0px'
		}, 500, 'easeOutBounce');
		return false;
	});

		

	/////////////////////////////////////////////////////////////////////////////////////////////
	//Detect user agent for known mobile devices and show hide elements for each specific element
	/////////////////////////////////////////////////////////////////////////////////////////////

	
	//toLowerCase() 方法用于把字符串转换为小写。indexOf() 方法对大小写敏感！
	//注释：如果要检索的字符串值没有出现，则该方法返回 -1。
	var isiPhone = navigator.userAgent.toLowerCase().indexOf("iphone");
	var isiPad = navigator.userAgent.toLowerCase().indexOf("ipad");
	var isiPod = navigator.userAgent.toLowerCase().indexOf("ipod");
	var isiAndroid = navigator.userAgent.toLowerCase().indexOf("android");

	if(isiPhone > -1) { 
		$('.ipod-detected').hide();	
		$('.ipad-detected').hide();		 
		$('.iphone-detected').show();		 
		$('.android-detected').hide();	 
	}

	if(isiPad > -1)	 {
		$('.ipod-detected').hide();		 
		$('.ipad-detected').show();		 
		$('.iphone-detected').hide();		 
		$('.android-detected').hide();	
	}

	if(isiPod > -1)	{		 	 
		$('.ipod-detected').show();		 
		$('.ipad-detected').hide();		 
		$('.iphone-detected').hide();		 
		$('.android-detected').hide();	 
	}   

	if(isiAndroid > -1) {		 
		$('.ipod-detected').hide();		 
		$('.ipad-detected').hide();		 
		$('.iphone-detected').hide();		 
		$('.android-detected').show();	 
	}  
	

	//Detect if iOS WebApp Engaged and permit navigation without deploying Safari
	(function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener("click",function(a){d=a.target;while(!f.test(d.nodeName))d=d.parentNode;"href"in d&&(d.href.indexOf("http")||~d.href.indexOf(e.host))&&(a.preventDefault(),e.href=d.href)},!1)}})(document,window.navigator,"standalone")

	var owlStaffControls = $(".staff-slider");
		owlStaffControls.owlCarousel({
			//Basic Stuff
			items : 3,
			itemsDesktop : [1199,3],
			itemsDesktopSmall : [980,3],
			itemsTablet: [768,2],
			itemsTabletSmall: [480,1],
			itemsMobile : [370,1],
			singleItem : false,
			itemsScaleUp : false,
			slideSpeed : 250,
			paginationSpeed : 250,
			rewindSpeed : 250,
			pagination:false,
			autoPlay : false,
			autoHeight: false,
		});

	$(".next-staff").click(function(){
	  //trigger() 方法触发被选元素的指定事件类型。
	  owlStaffControls.trigger('owl.next');
	  return false;
	});

	$(".prev-staff").click(function(){
	  owlStaffControls.trigger('owl.prev');
	  return false;
	});

	var owlQuoteSlider = $(".quote-slider");
		owlQuoteSlider.owlCarousel({
		items : 1,
		itemsDesktop : [1199,1],
		itemsDesktopSmall : [980,1],
		itemsTablet: [768,1],
		itemsTabletSmall: [480,1],
		itemsMobile : [370,1],
		singleItem : false,
		itemsScaleUp : false,
		slideSpeed : 800,
		paginationSpeed : 300,
		rewindSpeed : 250,
		pagination:false,
		autoPlay : true,
	});

	$(".next-quote").click(function() {
	  owlQuoteSlider.trigger('owl.next');
	  return false;
	});

	$(".prev-quote").click(function() {
	  owlQuoteSlider.trigger('owl.prev');
	  return false;
	});

	/////////////////
	//Image Gallery//
	// 图片   画廊 //
	/////////////////

	$(".swipebox").swipebox({
		useCSS : true, // false will force the use of jQuery for animations
		hideBarsDelay : 3000 // 0 to always show caption and action bar
	});

	$(".wide-gallery-item").swipebox({
		useCSS : true, // false will force the use of jQuery for animations
		hideBarsDelay : 3000 // 0 to always show caption and action bar
	});

	var time = 7; // time in seconds
	var $progressBar,
		$bar, 
		$elem, 
		isPause, 
		tick,
		percentTime;

	//Init the carousel
	$(".homepage-slider").owlCarousel({
		slideSpeed : 500,
		paginationSpeed : 500,
		singleItem : true,
		pagination:false,
		afterInit : progressBar,
		afterMove : moved,
		startDragging : pauseOnDragging
	});

	//Init progressBar where elem is $("#owl-demo")
	function progressBar(elem){
		$elem = elem;
		//build progress bar elements
		buildProgressBar();
		//start counting
		start();
	}

	//create div#progressBar and div#bar then prepend to $("#owl-demo")
	function buildProgressBar(){
		$progressBar = $("<div>",{
			id:"progressBar"
		});
		$bar = $("<div>",{
			id:"bar"
		});

		$progressBar.append($bar).prependTo($elem);
	}

	function start() {
		//reset timer
		percentTime = 0;
		isPause = false;
		//run interval every 0.01 second
		tick = setInterval(interval, 10);
	};

	function interval() {
		if(isPause === false){
			percentTime += 1 / time;
			$bar.css({
			   width: percentTime+"%"
			 });
			//if percentTime is equal or greater than 100
			if(percentTime >= 100){
			  //slide to next item 
			  $elem.trigger('owl.next')
			}
		}
	}

	//pause while dragging 
	function pauseOnDragging(){
		isPause = true;
	}

	//moved callback
	function moved(){
		//clear interval
		clearTimeout(tick);
		//start again
		start();
	}

	// Custom Navigation Events
	$(".next-home").click(function() {
		//$(".homepage-slider").trigger('owl.next');
		return false;
	});

	$(".prev-home").click(function() {
	//	$(".homepage-slider").trigger('owl.prev');
		return false;
	});	

	var coverpage_height = 0;

	function initiate_coverpages(){
		coverpage_height =  $(window).height();
		$('.coverpage').css({ height: coverpage_height+1 });	
	};

	initiate_coverpages();

	$(window).resize(function() {
		//当调整浏览器窗口的大小时，发生 resize 事件。
		initiate_coverpages();
	});

	$.scrollIt({
	  //upKey: 38,             // key code to navigate to the next section
	  //downKey: 40,           // key code to navigate to the previous section

	  scrollTime: 700,       // how long (in ms) the animation takes
	  easing: 'easeInOutExpo',      // the easing function for animation
	  activeClass: 'active-coverpage', // class given to the active nav element

	  //onPageChange: null,    // function(pageIndex) that is called when page is changed
	  //topOffset: 0           // offste (in px) for fixed top navigation
	});

	$(function() {
		$('#homepage-nav').find('a').click(function(e) {
			e.preventDefault();
			$(this.hash).show();
			$(this.hash).siblings().hide();
			$('#homepage-nav').find('a').removeClass('active-homepage-tab');
			$(this).addClass('active-homepage-tab');
		}).filter(':first').click();
		//filter() 方法会用匹配元素的子集构造一个新的 jQuery 对象.遍历+匹配
	});
  });
}