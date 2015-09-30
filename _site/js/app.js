$(function() {

    $('#scotch-panel').scotchPanel({
      containerSelector: 'body',
      direction: 'left',
      duration: 300,
      transition: 'ease',
      clickSelector: '#pl-toggle-panel',
      distanceX: '200px',
      enableEscapeKey: true
    });

  //   $('.coupon-list').isotope({
		//   itemSelector: '.coupon',
		//   layoutMode: 'fitRows',
		//   fitRows: {
		//   	gutter: 30
		//   }
		// });

});