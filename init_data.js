let graph = new Graph(cy);
let system = new System();
let generator = new CodeGenerator();

$('#backgroundColor-first').val('#e2d0d0');
$('#backgroundColor-second').val('#949995');
$('#color4').val('#83b55a');
$('#color3').val('#a83030');

$('#clear_edges').click(function () {
    graph.clear_edges();
});

$('#clear_graph').click(function () {
    graph.clear_graph(); // done
});

$('#reset_configuration').click(function () {
    graph.reset_configuration(); // Done
    system.reset_configuration();
})

$('#remove_selected').click(function () {
    graph.remove_selected_elements() // done
})

$('#color5').on('change', function () {
    graph.change_selected_elements_color(); // done
})

$('#make_component').on('click', function () {
   graph.make_component(); // done
});

$('#change_element').on('click', function () {
    graph.change_text(); // done
})

$('#change_edge').on('click', function () {
    graph.change_text_edge();
})

$('#select_all_edges').on('click', function () {
   graph.select_all_edges();
});

$('#select_all_nodes').on('click', function () {
    graph.select_all_nodes();
});

$('#play').on('click', function () {
    let selected_algo = $('#algorithm-select option:selected').val()
    graph.run_algorithm(selected_algo);
});

$('#discovered').on('click', function () {
   graph.show_time();
});


$('#python').on('click', function () {
    generator.generate_python_code();
})

$('#java').on('click', function () {
    generator.generate_java_code();
})

$(function () {

    $('#tab2').addClass('open-section');
    $('#tab1, #tab3').addClass('hide-section');

    $('#algorithm').click(function () {
        $('#tab1').removeClass('hide-section').addClass('open-section');
        $('#tab2, #tab3').removeClass('open-section').addClass('hide-section');
    })

    $('#configuration').click(function () {
        $('#tab2').removeClass('hide-section').addClass('open-section');
        $('#tab1, #tab3').removeClass('open-section').addClass('hide-section');
    })

    $('#tutorial').click(function () {
        $('#tab3').removeClass('hide-section').addClass('open-section');
        $('#tab1, #tab2').removeClass('open-section').addClass('hide-section');
    })


    $('.main-nav li:nth-child(2)').addClass('active');
    $(".main-nav li").click(function () {
        $('.main-nav li').removeClass('active');
        $(this).addClass('active');
    })
})



$(function () {
    let line = $('#main-hr');
    line.css({
        'left': $('.row li:nth-child(2)').position().left,
        'width': $('.row li:nth-child(2)').width()
    });

    $(".main-nav li").hover(function () {
        let el = $(this);
        line.stop().animate({
            'left': el.position().left,
            'width': el.width()
        }, 300)
    }, function () {
        let active_el = $('.main-nav .active');
        line.stop().animate({
            'left': active_el.position().left,
            'width': active_el.width()
        }, 300);
    });
})



